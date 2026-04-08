/**
 * Enums for consistent status and role values
 */

export enum ProjectStatus {
  NEW = 'new',
  REVIEWING = 'reviewing',
  ANALYZED = 'analyzed',
  QUOTED = 'quoted',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export enum UserRole {
  ADMIN = 'admin',
  SALES = 'sales',
  CONSULTANT = 'consultant',
  ENGINEER = 'engineer',
  VIEWER = 'viewer',
}

export enum BudgetRange {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  ENTERPRISE = 'enterprise',
}

export enum ActivityAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  VIEW = 'view',
  ANALYZE = 'analyze',
  EXPORT = 'export',
}

export enum TargetType {
  PROJECT = 'project',
  REQUIREMENT = 'requirement',
  ANALYSIS_REPORT = 'analysis_report',
  ENGINEER_HANDOFF = 'engineer_handoff',
  CLIENT = 'client',
}
