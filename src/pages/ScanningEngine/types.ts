export interface ScanSession {
  id: string;
  region: string;
  status: 'active' | 'paused' | 'completed' | 'aborted';
  startTime: Date;
}

export interface ScanStats {
  totalResources: number;
  totalResourcesChange: number;
  mappableResources: number;
  mappableResourcesChange: number;
  unsupportedFlags: number;
  unsupportedFlagsChange: number;
}

export interface ScanProgress {
  percent: number;
  currentItem: string;
  estimatedRemaining: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'INFO' | 'SUCCESS' | 'WARN' | 'SCAN' | 'MAPPED' | 'CURRENT';
  message: string;
}

export type LogType = LogEntry['type'];
