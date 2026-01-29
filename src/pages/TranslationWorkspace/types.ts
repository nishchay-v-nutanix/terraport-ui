// Confidence levels for AI suggestions
export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'manual';

// Translation status
export type TranslationStatus = 'pending' | 'approved' | 'rejected' | 'modified';

// Resource types
export type AWSResourceType = 'vpc' | 'subnet' | 'security_group' | 'ec2' | 'ebs';
export type NutanixResourceType = 'vlan' | 'ip_pool' | 'category' | 'security_policy' | 'vm' | 'volume_group';

// Base AWS Resource
export interface AWSResource {
  id: string;
  type: AWSResourceType;
  name: string;
  region: string;
  tags: Record<string, string>;
}

// VPC Resource
export interface AWSVPCResource extends AWSResource {
  type: 'vpc';
  cidrBlock: string;
}

// Subnet Resource
export interface AWSSubnetResource extends AWSResource {
  type: 'subnet';
  vpcId: string;
  cidr: string;
  availabilityZone: string;
  isPublic: boolean;
}

// Security Group Resource
export interface AWSSecurityGroupResource extends AWSResource {
  type: 'security_group';
  vpcId: string;
  description: string;
  inboundRules: SecurityGroupRule[];
  outboundRules: SecurityGroupRule[];
}

export interface SecurityGroupRule {
  protocol: string;
  port: number | string;
  source: string;
  description?: string;
}

// EC2 Instance Resource
export interface AWSEC2Resource extends AWSResource {
  type: 'ec2';
  instanceType: string;
  vCPU: number;
  memory: string;
  ebsVolumes: string[];
  subnetId: string;
  securityGroupIds: string[];
}

// EBS Volume Resource
export interface AWSEBSResource extends AWSResource {
  type: 'ebs';
  volumeType: string;
  size: string;
  iops?: number;
  encrypted: boolean;
  attachedTo?: string;
}

// Nutanix Target Configurations
export interface NutanixVLAN {
  id?: string;
  name: string;
  prismCentral: string;
  subnetType: 'VLAN' | 'OVERLAY';
  ipPrefix: string;
  vlanId?: number;
}

export interface NutanixIPPool {
  id?: string;
  name: string;
  startIP: string;
  endIP: string;
  gateway?: string;
  dns?: string[];
}

export interface NutanixCategory {
  name: string;
  value: string;
}

export interface NutanixSecurityPolicy {
  id?: string;
  name: string;
  appCategory: NutanixCategory;
  action: 'Allow' | 'Deny' | 'Monitor';
  verificationRequired: boolean;
}

export interface NutanixVMProfile {
  id?: string;
  name: string;
  cluster: string;
  sockets: number;
  coresPerSocket: number;
  memory: string;
}

export interface NutanixVolumeGroup {
  id?: string;
  name: string;
  cluster: string;
  size: string;
  storageContainer: string;
}

// Resource Mapping (the translation)
export interface ResourceMapping<S = AWSResource, T = unknown> {
  id: string;
  source: S;
  target: T | null;
  confidence: ConfidenceLevel;
  status: TranslationStatus;
  validationErrors?: string[];
  needsReview: boolean;
  modifiedBy?: string;
  modifiedAt?: Date;
}

// Specific mapping types
export type VPCMapping = ResourceMapping<AWSVPCResource, NutanixVLAN>;
export type SubnetMapping = ResourceMapping<AWSSubnetResource, NutanixVLAN & { ipPool?: NutanixIPPool }>;
export type SecurityGroupMapping = ResourceMapping<AWSSecurityGroupResource, NutanixSecurityPolicy>;
export type EC2Mapping = ResourceMapping<AWSEC2Resource, NutanixVMProfile>;
export type EBSMapping = ResourceMapping<AWSEBSResource, NutanixVolumeGroup>;

export type AnyResourceMapping = VPCMapping | SubnetMapping | SecurityGroupMapping | EC2Mapping | EBSMapping;

// Stats
export interface TranslationStats {
  totalResources: number;
  needsReview: number;
  readyToCommit: number;
}

// Filter state
export type ResourceFilterType = 'all' | 'vpc' | 'subnet' | 'security_group' | 'ec2' | 'ebs';

export interface FilterState {
  type: ResourceFilterType;
  searchQuery: string;
  showOnlyNeedsReview: boolean;
  confidenceFilter: ConfidenceLevel | 'all';
}

// Page state
export interface TranslationWorkspaceState {
  sessionId: string;
  sourceVpcId: string;
  targetPrismCentral: string;
  mappings: AnyResourceMapping[];
  stats: TranslationStats;
  filter: FilterState;
  isLoading: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
}
