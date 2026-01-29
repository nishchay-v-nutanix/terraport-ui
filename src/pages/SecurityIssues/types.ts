// Security issue severity levels
export type SecuritySeverity = 'critical' | 'high' | 'medium' | 'low';

// Security issue categories
export type SecurityCategory =
  | 'overly_permissive'
  | 'missing_encryption'
  | 'public_exposure'
  | 'weak_authentication'
  | 'compliance'
  | 'network';

// Security issue status
export type SecurityIssueStatus = 'pending' | 'acknowledged' | 'resolved' | 'ignored';

// Affected resource info
export interface AffectedResource {
  id: string;
  type: string;
  name: string;
  region: string;
}

// Security issue definition
export interface SecurityIssue {
  id: string;
  title: string;
  description: string;
  severity: SecuritySeverity;
  category: SecurityCategory;
  status: SecurityIssueStatus;
  affectedResource: AffectedResource;
  recommendation: string;
  details: string[];
  riskScore: number; // 1-100
}

// Stats for the security review
export interface SecurityStats {
  totalIssues: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  acknowledgedCount: number;
}

// Filter state
export type SeverityFilterType = 'all' | 'critical' | 'high' | 'medium' | 'low';

export interface SecurityFilterState {
  severityFilter: SeverityFilterType;
  searchQuery: string;
  showOnlyUnacknowledged: boolean;
}

// Page state
export interface SecurityIssuesState {
  issues: SecurityIssue[];
  stats: SecurityStats;
  filter: SecurityFilterState;
  isLoading: boolean;
}
