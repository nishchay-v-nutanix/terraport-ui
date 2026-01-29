export interface AWSCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  defaultRegion: string;
  accountAlias: string;
}

export interface ConnectionStep {
  id: number;
  title: string;
  description: string;
}

export const CONNECTION_STEPS: ConnectionStep[] = [
  { id: 1, title: 'Connection & Discovery', description: 'Enter your IAM credentials' },
  { id: 2, title: 'Resource Selection', description: 'Choose resources to migrate' },
  { id: 3, title: 'Translation Config', description: 'Configure translation settings' },
  { id: 4, title: 'Review & Deploy', description: 'Review and initiate migration' },
];

export const AWS_REGIONS = [
  { value: 'us-east-1', label: 'US East (N. Virginia)' },
  { value: 'us-east-2', label: 'US East (Ohio)' },
  { value: 'us-west-1', label: 'US West (N. California)' },
  { value: 'us-west-2', label: 'US West (Oregon)' },
  { value: 'eu-west-1', label: 'EU (Ireland)' },
  { value: 'eu-west-2', label: 'EU (London)' },
  { value: 'eu-central-1', label: 'EU (Frankfurt)' },
  { value: 'ap-south-1', label: 'Asia Pacific (Mumbai)' },
  { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' },
  { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
  { value: 'ap-southeast-2', label: 'Asia Pacific (Sydney)' },
];

export const REQUIRED_PERMISSIONS = [
  'ec2:DescribeInstances',
  'ec2:DescribeRegions',
  'iam:GetUser',
];
