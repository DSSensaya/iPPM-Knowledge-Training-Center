import {
  assessments,
  functions,
  issues,
  knowledgeLinks,
  processSteps,
  releaseAssignments,
  roleCatalog,
  trainingAssignments,
} from '../data/catalog';
import type { EvidenceRef, SubjectRef } from '../data/domain';
import type { Article } from '../data/types';

export function subjectsFor(article: Article): SubjectRef[] {
  const k = article.knowledge;
  if (!k) return [];
  const selected = functions.filter((f) => k.functionIds.includes(f.id));
  return [
    ...k.functionIds.map((id) => ({ kind: 'function' as const, id })),
    ...k.stepIds.map((id) => ({ kind: 'step' as const, id })),
    ...k.procedures.map((p) => ({ kind: 'procedure' as const, id: p.id })),
    ...selected.flatMap((f) =>
      f.scopeLinks.map((s) => ({ kind: 'scope' as const, id: s.scopeId })),
    ),
  ];
}
// Preserve all matching source assertions; never choose a winner by file date or status.
export function forSubjects<T extends { subject: SubjectRef }>(
  records: T[],
  subjects: SubjectRef[],
) {
  return records.filter((r) =>
    subjects.some((s) => s.kind === r.subject.kind && s.id === r.subject.id),
  );
}
export function knowledgeFor(article: Article) {
  const k = article.knowledge;
  const subjects = subjectsFor(article);
  return {
    functions: functions.filter((f) => k?.functionIds.includes(f.id)),
    steps: processSteps.filter((s) => k?.stepIds.includes(s.id)),
    issues: issues.filter((i) => k?.issueIds.includes(i.id)),
    links: knowledgeLinks.filter((link) => k?.linkIds?.includes(link.id)),
    assessments: forSubjects(assessments, subjects),
    training: forSubjects(trainingAssignments, subjects),
    releases: forSubjects(releaseAssignments, subjects),
  };
}
export function articleEvidence(article: Article): EvidenceRef[] {
  const data = knowledgeFor(article);
  const refs = [
    ...(article.knowledge?.evidence ?? []),
    ...(article.knowledge?.procedures.flatMap((p) => p.evidence) ?? []),
    ...data.functions.flatMap((f) => [...f.evidence, ...f.scopeLinks.flatMap((s) => s.evidence)]),
    ...[
      ...data.steps,
      ...data.issues,
      ...data.assessments,
      ...data.training,
      ...data.releases,
      ...data.links,
    ].flatMap((r) => r.evidence),
  ];
  return [...new Map(refs.map((r) => [JSON.stringify(r), r])).values()];
}
export function knowledgeSearchText(article: Article) {
  if (!article.knowledge) return '';
  const data = knowledgeFor(article);
  const procedures = article.knowledge.procedures;
  return [
    ...roleCatalog
      .filter((r) => article.roles.includes(r.id))
      .flatMap((r) => [r.label, ...r.aliases]),
    ...data.functions.flatMap((f) => [
      f.title,
      f.outcome,
      ...f.aliases,
      ...f.context.tools,
      ...f.context.projectTypes,
      ...f.scopeLinks.map((s) => s.scopeId),
    ]),
    ...data.steps.flatMap((s) => [s.number, s.title]),
    ...procedures.flatMap((p) => [
      p.title,
      p.trigger,
      ...p.prerequisites,
      ...(p.requiredRights ?? []),
      ...p.actions.map((a) => `${a.text} ${a.tool}`),
      ...p.expectedResults,
      ...p.checkQuestions,
    ]),
    ...data.issues.flatMap((i) => [i.title, i.limitation]),
    ...data.links.flatMap((link) => [link.statement, link.condition ?? '']),
    ...(data.steps.length > 0 ? ['SB1 Schulungsblock 1'] : []),
  ].join(' ');
}
