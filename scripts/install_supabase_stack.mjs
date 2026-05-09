import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const targetDir = process.argv[2];
const shouldPatchIndex = process.argv.includes('--patch-index');
const force = process.argv.includes('--force');

if (!targetDir) {
  throw new Error('Uso: node scripts/install_supabase_stack.mjs /caminho/do/outro-projeto [--patch-index] [--force]');
}

const files = [
  'supabase/migrations/20260502_000001_initial_schema.sql',
  'supabase/migrations/20260504_000002_project_sync_and_tap.sql',
  'supabase/migrations/20260505_000003_api_access_and_rpc.sql',
  'scripts/import_spreadsheets_to_supabase.mjs',
  '.env.supabase.example',
  'supabase/setup/supabase-runtime.js',
  'supabase/setup/supabase-configurador.html',
  'docs/implantacao_supabase.md',
];

async function copyStackFile(relativePath) {
  const destination = path.join(targetDir, relativePath);
  if (existsSync(destination) && !force) {
    console.log(`mantido: ${relativePath} (use --force para sobrescrever)`);
    return;
  }
  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(relativePath, destination);
  console.log(`copiado: ${relativePath}`);
}

async function patchIndex() {
  const indexPath = path.join(targetDir, 'index.html');
  if (!existsSync(indexPath)) {
    console.log('index.html não encontrado; copie manualmente supabase/setup/supabase-configurador.html para Configurações.');
    return;
  }

  const html = await readFile(indexPath, 'utf8');
  if (html.includes('supabase-configuracoes')) {
    console.log('index.html já contém supabase-configuracoes.');
    return;
  }

  const snippet = await readFile('supabase/setup/supabase-configurador.html', 'utf8');
  const patched = html.includes('</body>') ? html.replace('</body>', `${snippet}\n</body>`) : `${html}\n${snippet}`;
  await writeFile(indexPath, patched);
  console.log('index.html atualizado com o bloco Supabase. Revise a posição no menu Configurações.');
}

for (const file of files) {
  await copyStackFile(file);
}

if (shouldPatchIndex) {
  await patchIndex();
}

console.log('Estrutura Supabase instalada no projeto de destino.');
