import crypto from 'node:crypto';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SECRET = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const PROJECT_CODE = process.env.PROJECT_CODE || 'ROSSI-PMO';
const PROJECT_NAME = process.env.PROJECT_NAME || 'Rossi Supermercados';

if (!URL || !SECRET) {
  throw new Error('Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SECRET_KEY no ambiente.');
}

const sources = {
  pendencias: process.env.SHEET_URL_PENDENCIAS,
  riscos: process.env.SHEET_URL_RISCOS,
  gaps: process.env.SHEET_URL_GAPS,
  atividades: process.env.SHEET_URL_ATIVIDADES,
  geral: process.env.SHEET_URL_GERAL,
  tap: process.env.SHEET_URL_TAP,
};

function parseCSVRow(line, delimiter) {
  const out = [];
  let cur = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === delimiter && !inQuotes) {
      out.push(cur.trim());
      cur = '';
      continue;
    }
    cur += ch;
  }
  out.push(cur.trim());
  return out;
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (!lines.length) return [];

  const headerIdx = lines.findIndex((line) => /\bID\b/i.test(line) && /(Categoria|Descri|Area|Área|Projeto|Processo)/i.test(line));
  const resolvedHeaderIdx = headerIdx >= 0 ? headerIdx : 0;
  const headerLine = lines[resolvedHeaderIdx];
  const delimiter = headerLine.split(';').length > headerLine.split(',').length ? ';' : ',';
  const headers = parseCSVRow(headerLine, delimiter).map((header) => header.trim());

  return lines.slice(resolvedHeaderIdx + 1)
    .map((line) => parseCSVRow(line, delimiter))
    .map((values) => Object.fromEntries(headers.map((header, index) => [header, (values[index] || '').trim()])))
    .filter((row) => Object.values(row).some(Boolean));
}

async function supabase(path, method = 'GET', body) {
  const res = await fetch(`${URL}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: SECRET,
      Authorization: `Bearer ${SECRET}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(`${method} ${path} -> ${res.status} ${await res.text()}`);
  }

  if (res.status === 204) return [];
  return res.json();
}

function hashRow(row) {
  return crypto.createHash('sha1').update(JSON.stringify(row)).digest('hex');
}

function pick(row, fields, fallback = '') {
  const found = fields.find((field) => row[field] !== undefined && row[field] !== '');
  return found ? row[found] : fallback;
}

async function ensureProject() {
  const [project] = await supabase(`projects?code=eq.${encodeURIComponent(PROJECT_CODE)}&select=id`);
  if (project?.id) return project.id;

  const created = await supabase('projects', 'POST', [{ code: PROJECT_CODE, name: PROJECT_NAME }]);
  return created[0].id;
}

async function registerSource(projectId, sourceType, sourceUrl) {
  const [source] = await supabase('spreadsheet_sources?on_conflict=project_id,source_type', 'POST', [{
    project_id: projectId,
    source_type: sourceType,
    source_url: sourceUrl,
    is_active: true,
    last_sync_at: new Date().toISOString(),
  }]);
  return source?.id;
}

async function insertSourceRows(projectId, sourceType, rows) {
  if (!rows.length) return;
  await supabase('source_rows', 'POST', rows.map((row) => ({
    project_id: projectId,
    source_type: sourceType,
    row_data: row,
  })));
}

async function importRows(projectId, type, rows) {
  if (type === 'pendencias') {
    const payload = rows.map((row) => ({
      project_id: projectId,
      external_id: pick(row, ['ID', 'Id', 'id'], hashRow(row)),
      area: pick(row, ['Área', 'Area']),
      category: pick(row, ['Categoria', 'Category']),
      stage: pick(row, ['Etapa', 'Stage']),
      sprint: pick(row, ['Sprint']),
      activity: pick(row, ['Atividade', 'Activity']),
      description: pick(row, ['Descrição', 'Descricao', 'Description'], 'Sem descrição'),
      owner: pick(row, ['Responsável', 'Responsavel', 'Owner']),
      client_owner: pick(row, ['Responsável Cliente', 'Responsavel Cliente']),
      criticality: pick(row, ['Criticidade', 'Criticality']),
      status: pick(row, ['Status'], 'aberta'),
      condition: pick(row, ['Condição', 'Condicao']),
      source_row_hash: hashRow(row),
    }));
    await supabase('issues?on_conflict=project_id,external_id', 'POST', payload);
    return payload.length;
  }

  if (type === 'riscos') {
    const payload = rows.map((row) => ({
      project_id: projectId,
      external_id: pick(row, ['ID', 'Id', 'id'], hashRow(row)),
      process: pick(row, ['Projeto', 'Processo', 'Process']),
      owner: pick(row, ['Responsável', 'Responsavel', 'Owner']),
      probability: Number(pick(row, ['Probabilidade', 'Probability'], '0')) || null,
      impact: Number(pick(row, ['Impacto', 'Impact'], '0')) || null,
      strategy: pick(row, ['Tratamento', 'Estratégia', 'Estrategia', 'Strategy']),
      mitigation_plan: pick(row, ['Plano de Mitigação', 'Plano de Mitigacao']),
      contingency_plan: pick(row, ['Plano de Contingência', 'Plano de Contingencia']),
      description: pick(row, ['Descrição', 'Descricao', 'Description'], 'Sem descrição'),
      life_cycle_status: pick(row, ['Status Ciclo de Vida', 'Status'], 'aberto'),
      source_row_hash: hashRow(row),
    }));
    await supabase('risks?on_conflict=project_id,external_id', 'POST', payload);
    return payload.length;
  }

  return 0;
}

async function main() {
  const projectId = await ensureProject();

  for (const [type, sheetUrl] of Object.entries(sources)) {
    if (!sheetUrl) continue;

    const sourceId = await registerSource(projectId, type, sheetUrl);
    const [job] = await supabase('import_jobs', 'POST', [{ project_id: projectId, source_id: sourceId, source_type: type, status: 'running' }]);

    try {
      const csv = await fetch(sheetUrl).then((response) => response.text());
      const rows = parseCSV(csv);
      await insertSourceRows(projectId, type, rows);
      const rowsUpserted = await importRows(projectId, type, rows);
      await supabase(`import_jobs?id=eq.${job.id}`, 'PATCH', { status: 'success', rows_read: rows.length, rows_upserted: rowsUpserted, finished_at: new Date().toISOString() });
      console.log(`${type}: ${rows.length} linhas lidas, ${rowsUpserted} registros upsertados.`);
    } catch (error) {
      await supabase(`import_jobs?id=eq.${job.id}`, 'PATCH', { status: 'failed', error_message: error.message, finished_at: new Date().toISOString() });
      throw error;
    }
  }

  console.log('Importação concluída com sucesso.');
}

main();
