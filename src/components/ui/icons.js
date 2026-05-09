import { createElement } from 'react';
import * as Icons from 'lucide-react';
export function DynamicIcon({ name, className }) { const Icon = Icons[name] || Icons.Circle; return createElement(Icon, { className }); }
