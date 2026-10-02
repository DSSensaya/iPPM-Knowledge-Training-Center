// Additive knowledge model. Browser progress continues to reference Article IDs only.
export type RoleId = 'pm' | 'pmo' | 'tm' | 'ilsm';
export interface EvidenceRef {
  sourceId: string;
  locator: string;
  sourceKey?: string;
  derivation: 'direct' | 'inferred';
}
export interface SourceDocument {
  id: string;
  title: string;
  filename: string;
  date: string | null;
  status: string;
  sha256: string;
}
export interface Context {
  projectTypes: string[];
  levels: string[];
  tools: string[];
  environment: string | null;
}
export type SubjectRef = { kind: 'function' | 'step' | 'procedure' | 'scope'; id: string };
export interface ScopeItem {
  id: string;
  title: string;
  evidence: EvidenceRef[];
}
export interface FunctionDefinition {
  id: string;
  title: string;
  outcome: string;
  aliases: string[];
  roleIds: RoleId[];
  context: Context;
  scopeLinks: {
    scopeId: string;
    coverage: 'whole' | 'partial' | 'prerequisite';
    evidence: EvidenceRef[];
  }[];
  evidence: EvidenceRef[];
}
export interface ProcessStep {
  id: string;
  processId: string;
  number: string;
  title: string;
  phase: string;
  roleId: RoleId;
  functionIds: string[];
  input: string;
  output: string;
  evidence: EvidenceRef[];
}
export interface ReleaseAssignment {
  id: string;
  subject: SubjectRef;
  stageId: string;
  basis: 'current-scope' | 'historical-plan' | 'roadmap-target';
  aspect: string;
  evidence: EvidenceRef[];
}
export interface TrainingAssignment {
  id: string;
  subject: SubjectRef;
  blockId: string;
  included: boolean | null;
  statement: string;
  evidence: EvidenceRef[];
}
export interface Assessment {
  id: string;
  subject: SubjectRef;
  dimension: 'technical' | 'ttt' | 'documentation' | 'training' | 'procedure-description';
  originalValue: string;
  value: 'verified' | 'partial' | 'described-draft' | 'qualified' | 'unknown';
  scope: string;
  environment: string | null;
  issueIds: string[];
  evidence: EvidenceRef[];
}
export interface Issue {
  id: string;
  title: string;
  status: string;
  subjects: SubjectRef[];
  limitation: string;
  evidence: EvidenceRef[];
}
export interface KnowledgeLink {
  id: string;
  from: SubjectRef;
  to: SubjectRef;
  relation: 'feeds' | 'requires';
  statement: string;
  condition?: string;
  evidence: EvidenceRef[];
}
export interface ToolSelection {
  toolIds: string[];
  relation: 'all' | 'alternative';
}
export interface Procedure {
  id: string;
  title: string;
  functionId: string;
  relatedArticleId?: string;
  trigger: string;
  prerequisites: string[];
  requiredRights?: string[];
  actions: { text: string; tool: string; toolSelection?: ToolSelection }[];
  expectedResults: string[];
  checkQuestions: string[];
  evidence: EvidenceRef[];
}
export interface OwnerChangeTrainerPackage {
  procedureId: string;
  customerProject: string;
  pmAccount: string;
  currentOwner: string;
  currentSubprojects: string;
  variants: {
    id: 'tm' | 'ilsm';
    label: string;
    subproject: string;
    targetAccount: string;
    plannedOwner: string;
    plannedSubprojects: string;
  }[];
  prechecks: string[];
  pmExpected: string;
  targetExpected: string;
  resetCheck: string;
}
export interface KnowledgeContext {
  applicationLimitations?: string[];
  functionIds: string[];
  stepIds: string[];
  issueIds: string[];
  linkIds?: string[];
  evidence: EvidenceRef[];
  procedures: Procedure[];
  trainer: {
    objective: string;
    preparation: string[];
    exercise: string;
    expectedResult: string;
    limitation: string;
    ownerChange?: OwnerChangeTrainerPackage;
  };
}
