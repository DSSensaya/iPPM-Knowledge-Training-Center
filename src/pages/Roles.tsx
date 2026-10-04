import { content } from '../content';
import { getRoleView } from '../lib/queries';
import { PageTitle } from '../components/ui';
export default function Roles({ id }: { id?: string }) {
  const roles = id ? content.roles.filter((r) => r.id === id) : content.roles;
  return (
    <>
      <PageTitle
        eyebrow="Ihre Rolle verstehen"
        title="Rollen"
        description="Fachliche Verantwortung und Wissen für PM, PMO, TM und ILSM. Eine Rolle allein verleiht keine technischen Zugriffsrechte."
      />
      {!roles.length && <p>Rolle nicht gefunden.</p>}
      {roles.map((r) => {
        const view = getRoleView(r.id);
        return (
          <section className="role-view" key={r.id}>
            <h2>
              <a href={'#/rollen/' + r.id}>{r.label}</a>
            </h2>
            <p>{r.responsibility}</p>
            <h3>Prozessschritte in Ihrer Verantwortung</h3>
            <ul>
              {view.steps.map((s) => (
                <li key={s.id}>
                  <a href={'#/schritt/' + s.id}>
                    {s.number} {s.title}
                  </a>
                </li>
              ))}
            </ul>
            <h3>Wissen für Ihre Rolle</h3>
            <ul>
              {view.articles.map((a) => (
                <li key={a.id}>
                  <a href={'#/artikel/' + a.id}>{a.title}</a>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </>
  );
}
