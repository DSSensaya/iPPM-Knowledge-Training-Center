import { inventory } from '../data/inventory';
import { normalize } from './search';

export function searchInventory(
  query: string,
  kind = 'Alle Einträge',
  state = 'Alle Inhaltsstände',
) {
  const words = normalize(query).trim().split(/\s+/).filter(Boolean);
  return inventory.filter(
    (entry) =>
      (kind === 'Alle Einträge' || entry.kind === kind) &&
      (state === 'Alle Inhaltsstände' || entry.state === state) &&
      words.every((word) =>
        normalize(
          [entry.id, entry.title, ...entry.aliases, entry.context, entry.state].join(' '),
        ).includes(word),
      ),
  );
}
