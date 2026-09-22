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
export interface Article {
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
  knowledge?: KnowledgeContext;
}
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
