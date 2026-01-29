export type CloudProvider = 'aws' | 'vmware' | 'gcp';

export type EnvironmentStatus = 'active' | 'coming_soon' | 'beta';

export interface CloudProviderInfo {
  id: CloudProvider;
  name: string;
  shortName: string;
  description: string;
  isAvailable: boolean;
}

export interface Environment {
  id: string;
  provider: CloudProvider;
  name: string;
  description: string;
  status: EnvironmentStatus;
  isConnected: boolean;
  activePipelines?: number;
  currentLoad?: number;
  teamMembers?: string[];
}

export interface StatsData {
  totalMigrations: number;
  totalMigrationsChange: number;
  activeTransfers: number;
  isRunning: boolean;
  successRate: number;
  successRateStatus: 'stable' | 'improving' | 'declining';
  infraSavings: number;
  infraSavingsChange: number;
}

export const CLOUD_PROVIDERS: CloudProviderInfo[] = [
  {
    id: 'aws',
    name: 'Amazon Web Services',
    shortName: 'AWS',
    description: 'Migrate EC2 & RDS instances',
    isAvailable: true,
  },
  {
    id: 'vmware',
    name: 'VMware vSphere',
    shortName: 'VMW',
    description: 'Migrate from on-premise',
    isAvailable: false,
  },
  {
    id: 'gcp',
    name: 'Google Cloud',
    shortName: 'GCP',
    description: 'Migrate Compute Engine',
    isAvailable: false,
  },
];

export const MOCK_STATS: StatsData = {
  totalMigrations: 342,
  totalMigrationsChange: 12,
  activeTransfers: 12,
  isRunning: true,
  successRate: 99.8,
  successRateStatus: 'stable',
  infraSavings: 124000,
  infraSavingsChange: 8,
};

export const MOCK_ENVIRONMENTS: Environment[] = [
  {
    id: 'env-1',
    provider: 'aws',
    name: 'AWS to Nutanix Cloud',
    description: 'EC2 to AHV automated translation pipeline.',
    status: 'active',
    isConnected: true,
    activePipelines: 24,
    currentLoad: 65,
    teamMembers: ['JD', 'AS'],
  },
  {
    id: 'env-2',
    provider: 'vmware',
    name: 'VMware to Nutanix',
    description: 'Legacy ESXi to AHV direct translation engine.',
    status: 'coming_soon',
    isConnected: false,
  },
  {
    id: 'env-3',
    provider: 'gcp',
    name: 'GCP to Nutanix Cloud',
    description: 'Google Cloud Compute Engine translation.',
    status: 'beta',
    isConnected: true,
  },
];
