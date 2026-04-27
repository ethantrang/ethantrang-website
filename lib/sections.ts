import fs from 'fs';
import path from 'path';
import type { Section, SectionsConfig } from './types';

const SECTIONS_FILE = path.join(process.cwd(), 'sections.json');

export function getSections(): Section[] {
  const raw = fs.readFileSync(SECTIONS_FILE, 'utf-8');
  const config: SectionsConfig = JSON.parse(raw);
  return config.sections.sort((a, b) => a.order - b.order);
}

export function saveSections(sections: Section[]): void {
  const config: SectionsConfig = { sections };
  fs.writeFileSync(SECTIONS_FILE, JSON.stringify(config, null, 2), 'utf-8');
}
