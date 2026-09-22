import { articles } from '../data/content';
import type { Role } from '../data/types';
export function normalize(value: string) {
  return value
    .toLocaleLowerCase('de')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
export function searchArticles(
  query: string,
  topic = 'Alle Themen',
  role: Role = 'Alle Rollen',
  kind = 'Alle Formate',
) {
  const words = normalize(query).trim().split(/\s+/).filter(Boolean);
  return articles
    .filter(
      (a) =>
        (topic === 'Alle Themen' || a.topic === topic) &&
        (role === 'Alle Rollen' || a.roles.includes(role)) &&
        (kind === 'Alle Formate' || a.kind === kind),
    )
    .map((article) => {
      const title = normalize(article.title);
      const summary = normalize(`${article.summary} ${article.topic}`);
      const full = normalize(
        `${article.title} ${article.summary} ${article.topic} ${article.roles.join(' ')} ${article.sections.map((s) => `${s.title} ${s.body} ${(s.steps || []).join(' ')}`).join(' ')} ${article.takeaway}`,
      );
      return {
        article,
        matches: words.every((word) => full.includes(word)),
        score: words.reduce(
          (sum, word) => sum + (title.includes(word) ? 4 : summary.includes(word) ? 2 : 1),
          0,
        ),
      };
    })
    .filter((result) => result.matches)
    .sort((a, b) => b.score - a.score)
    .map((result) => result.article);
}
