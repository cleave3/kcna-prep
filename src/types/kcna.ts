export type DomainId = 
  | 'fundamentals'
  | 'orchestration'
  | 'architecture'
  | 'observability'
  | 'delivery';

export interface DomainInfo {
  id: DomainId;
  name: string;
  weight: number; // percentage (e.g. 46, 22, 16, 8, 8)
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  description: string;
}

export interface ExamQuestion {
  id: string;
  examId: 1 | 2 | 3 | 4;
  domain: DomainId;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  sourceReference?: string;
}

export interface Flashcard {
  id: string;
  domain: DomainId;
  category: string;
  question: string;
  answer: string;
  keyTakeaway?: string;
  examTrap?: string;
}

export interface CheatMatrixRow {
  [key: string]: string;
}

export interface CheatMatrixTable {
  id: string;
  title: string;
  subtitle: string;
  domain: DomainId;
  columns: { key: string; label: string }[];
  rows: CheatMatrixRow[];
  notes?: string[];
}

export interface KubectlItem {
  id: string;
  command: string;
  description: string;
  category: 'Cluster & Context' | 'Working with Resources' | 'Debugging & Inspecting' | 'Deployments & Scaling' | 'Namespaces & Config';
  exampleSnippet?: string;
}

export interface ResourceAbbrev {
  full: string;
  short: string;
  apiGroup?: string;
  namespaced: boolean;
  notes?: string;
}

export interface NoteSection {
  id: string;
  title: string;
  domain: DomainId;
  tags: string[];
  summary: string;
  details: string[];
  importantTakeaway: string;
}
