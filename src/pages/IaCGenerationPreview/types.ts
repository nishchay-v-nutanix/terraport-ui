// File types for Terraform configuration
export type TerraformFileType =
  | 'main'
  | 'variables'
  | 'outputs'
  | 'provider'
  | 'tfvars';

// Individual file representation
export interface TerraformFile {
  id: string;
  name: string;
  type: TerraformFileType;
  content: string;
  language: 'hcl' | 'json'; // For Monaco syntax highlighting
}

// Editor tab state
export interface EditorTab {
  fileId: string;
  fileName: string;
  isActive: boolean;
}

// Status bar information
export interface EditorStatus {
  ready: boolean;
  errors: number;
  warnings: number;
  line: number;
  column: number;
  encoding: string;
  language: string;
}

// Page state
export interface IaCPreviewState {
  files: TerraformFile[];
  openTabs: EditorTab[];
  activeFileId: string | null;
  editorStatus: EditorStatus;
  isExporting: boolean;
  isFullscreen: boolean;
}

// Route params
export interface RouteParams {
  sessionId: string;
}
