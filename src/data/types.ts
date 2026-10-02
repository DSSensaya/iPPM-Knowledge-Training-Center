import type { KnowledgeContext, RoleId } from './domain';
export type Role =
  | 'Alle Rollen'
  | 'Projektleitung'
  | 'Projektteam'
  | 'Portfoliomanagement'
  | RoleId;
export type Topic =
  | 'Grundlagen'
  | 'Projektplanung'
  | 'Status & Reporting'
  | 'Ressourcen'
  | 'Portfolio'
  | 'Team & Zugriff';
export interface Section {
  title: string;
  body: string;
  steps?: string[];
}
export interface ContentRevision {
  number: number;
  date: string;
  note: string;
  // Snapshot of the source files used by this content revision.
  sources: { sourceId: string; sha256: string }[];
}
export interface ReviewEvidence {
  revision: number;
  date: string;
  reviewer: string;
  subject: string;
  environment: string;
  record: string;
}
export interface UserConfirmation {
  // Absent for historical personal confirmations; Center approval is explicit.
  kind?: 'center-final';
  revision: number;
  date: string;
  confirmedBy: string;
  fields: string[];
}
interface ArticleBase {
  extra?: Record<string, string>;
  id: string;
  title: string;
  summary: string;
  topic: Topic;
  roles: Role[];
  kind: 'Anleitung' | 'Grundlagen' | 'Checkliste' | 'FAQ';
  minutes: number;
  updated: string;
  sections: Section[];
  takeaway: string;
  related: string[];
}
export type Article = ArticleBase &
  (
    | { status: 'demo'; knowledge?: never; revisions?: never; reviews?: never }
    | {
        status: 'source-draft' | 'reviewed';
        knowledge: KnowledgeContext;
        revisions: ContentRevision[];
        reviews: ReviewEvidence[];
        userConfirmations?: UserConfirmation[];
      }
  );
export interface LearningPath {
  id: string;
  title: string;
  summary: string;
  role: Role;
  level: string;
  lessons: string[];
  question: string;
  answers: string[];
  correct: number;
  explanation: string;
}
export interface Process {
  id: string;
  title: string;
  summary: string;
  phases: { title: string; role: string; description: string; output: string; article: string }[];
}
