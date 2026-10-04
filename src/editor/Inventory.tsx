import { getInventory } from '../lib/queries';
import { PageTitle } from '../components/ui';
export default function Inventory() {
  const entries = getInventory();
  return (
    <>
      <PageTitle
        eyebrow="Redaktion"
        title="Abgeleiteter Bestand"
        description="Diese Sicht entsteht ausschließlich aus den kanonischen Fachobjekten. Hier werden keine separaten Daten gepflegt."
      />
      <p>{entries.length} Objekte</p>
      <ul className="result-list">
        {entries.map((e) => (
          <li key={e.id}>
            <a href={e.href}>{e.title}</a>
            <p className="small muted">
              {e.kind} · {e.id}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
