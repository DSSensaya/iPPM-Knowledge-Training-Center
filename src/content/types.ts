/** Canonical JSON contract. IDs are references, never array positions. */
export type ContentStatus = 'draft' | 'usable' | 'approved';
export type MaterialKind = 'guide' | 'orientation' | 'reference';
export interface Section {
  title: string;
  body: string;
  steps?: string[];
  purpose?: 'exercise' | 'context';
}
export interface Sourced {
  sourceRefs?: string[];
  sourceNote?: string;
}
export interface Open {
  openPoints?: string[];
  openPointIds?: string[];
}
export interface Relationship {
  targetId: string;
  relation: 'whole' | 'partial' | 'prerequisite' | 'related' | 'feeds' | 'requires';
  note?: string;
  condition?: string;
}
export interface Material {
  articleId: string;
  kind: MaterialKind;
  /** Explicit material validity. No inference from a step's training blocks. */
  releaseIds: string[];
  procedureIds?: string[];
}
export interface Role {
  id: string;
  label: string;
  aliases?: string[];
  responsibility: string;
}
export interface Destination {
  id: string;
  title: string;
  aliases?: string[];
}
export interface System extends Destination {
  destinations?: Destination[];
}
export interface Release {
  id: string;
  title: string;
  code: string;
  description?: string;
}
export interface TrainingBlock {
  id: string;
  releaseId: string;
  title: string;
  code: string;
}
export interface Source {
  id: string;
  title: string;
  path: string;
  date?: string;
}
export interface SharedOpenPoint extends Sourced {
  id: string;
  text: string;
}
export interface Article extends Sourced, Open {
  id: string;
  title: string;
  summary: string;
  roleIds: string[];
  systemIds: string[];
  status: ContentStatus;
  content: Section[];
  releaseIds?: string[];
  relatedArticleIds?: string[];
  procedureIds?: string[];
  topic?: string;
  kind?: string;
}
export interface Procedure extends Sourced, Open {
  id: string;
  title: string;
  trigger: string;
  taskId?: string;
  relatedArticleId?: string;
  releaseIds?: string[];
  prerequisites: string[];
  requiredRights?: string[];
  actions: {
    text: string;
    tool?: string;
    toolSelection?: { toolIds: string[]; relation: 'all' | 'alternative' };
  }[];
  expectedResults: string[];
  checkQuestions?: string[];
  relationships?: Relationship[];
}
export interface Work extends Sourced, Open {
  id: string;
  title: string;
  roleIds: string[];
  systemIds: string[];
  releaseIds?: string[];
  trainingBlockIds: string[];
  materials: Material[];
}
export interface ProcessStep extends Work {
  number: string;
  phase: string;
  description?: string;
  input?: string;
  output?: string;
  taskIds?: string[];
  aliases?: string[];
}
export interface Process extends Sourced {
  id: string;
  title: string;
  description: string;
  steps: ProcessStep[];
}
export interface Task extends Work {
  summary: string;
  aliases?: string[];
  content?: Section[];
  relationships?: Relationship[];
}
/** Broader official scope references; never count these as executable tasks or steps. */
export interface Topic extends Sourced, Open {
  id: string;
  title: string;
  summary: string;
  aliases?: string[];
  content?: Section[];
  materials?: Material[];
  relationships?: Relationship[];
}
export interface ContentStore {
  articles: Article[];
  processes: Process[];
  tasks: Task[];
  topics: Topic[];
  roles: Role[];
  systems: System[];
  releases: Release[];
  trainingBlocks: TrainingBlock[];
  procedures: Procedure[];
  sources: Source[];
  openPoints: SharedOpenPoint[];
  help: { question: string; answer: string }[];
}
