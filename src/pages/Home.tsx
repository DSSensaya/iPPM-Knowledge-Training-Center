import {
  ArrowRight,
  Bookmark,
  BookOpen,
  GraduationCap,
  ListTodo,
  Network,
  UserRound,
} from 'lucide-react';
import { PageTitle, SearchForm } from '../components/ui';

const workEntries = [
  {
    path: '/aufgaben',
    title: 'Aufgaben',
    description: 'Finden Sie Ihre konkrete Aufgabe und den passenden Bedienweg.',
    action: 'Aufgabe finden',
    icon: ListTodo,
  },
  {
    path: '/prozesse',
    title: 'Prozesse',
    description: 'Verschaffen Sie sich einen Überblick über Abläufe und einzelne Prozessschritte.',
    action: 'Prozesse erkunden',
    icon: Network,
  },
  {
    path: '/wissen',
    title: 'Wissen',
    description: 'Schlagen Sie Anleitungen, Erläuterungen und Antworten auf häufige Fragen nach.',
    action: 'Wissen entdecken',
    icon: BookOpen,
  },
];

const orientationEntries = [
  {
    path: '/rollen',
    title: 'Rollen',
    description: 'Aufgaben und Wissen für Ihre Rolle in iPPM.',
    icon: UserRound,
  },
  {
    path: '/releases',
    title: 'Releases & Schulungen',
    description: 'Releasebezüge, Schulungsblöcke und vorhandene Materialien.',
    icon: GraduationCap,
  },
  {
    path: '/mein-bereich',
    title: 'Mein Lernbereich',
    description: 'Ihre gemerkten Beiträge und lokalen Lesemarkierungen.',
    icon: Bookmark,
  },
];

export default function Home() {
  return (
    <div className="home">
      <PageTitle
        eyebrow="iPPM Knowledge & Training Center"
        title="Ihr Einstieg in iPPM"
        description="Anleitungen finden, Abläufe verstehen und Wissen vertiefen. Starten Sie mit einer Suche oder wählen Sie den passenden Bereich."
      />
      <div className="home-search">
        <SearchForm large />
      </div>

      <section aria-labelledby="home-work-title">
        <h2 id="home-work-title">Direkt zum passenden Bereich</h2>
        <ul className="cards home-entries">
          {workEntries.map(({ path, title, description, action, icon: Icon }) => (
            <li key={path}>
              <a className="home-card" href={`#${path}`} aria-labelledby={`home-${path.slice(1)}`}>
                <Icon className="home-card-icon" size={24} aria-hidden="true" />
                <h3 id={`home-${path.slice(1)}`}>{title}</h3>
                <p>{description}</p>
                <span className="home-card-action">
                  {action}
                  <ArrowRight size={18} aria-hidden="true" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="home-orientation-title">
        <h2 id="home-orientation-title">Orientierung & Lernen</h2>
        <ul className="cards home-entries">
          {orientationEntries.map(({ path, title, description, icon: Icon }) => (
            <li key={path}>
              <a
                className="home-card home-card-compact"
                href={`#${path}`}
                aria-labelledby={`home-${path.slice(1)}`}
              >
                <div className="home-card-heading">
                  <Icon size={20} aria-hidden="true" />
                  <h3 id={`home-${path.slice(1)}`}>{title}</h3>
                  <ArrowRight size={18} aria-hidden="true" />
                </div>
                <p>{description}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <div className="home-help">
        <p>Neu im Knowledge Center? Hinweise zur Nutzung finden Sie unter Hilfe & FAQ.</p>
        <a className="button secondary" href="#/hilfe">
          Hilfe & FAQ
          <ArrowRight size={16} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
