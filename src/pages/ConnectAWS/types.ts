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
  { id: 1, title: 'Connect to AWS', description: 'Enter your IAM credentials to allow Terraport to discover your AWS infrastructure.' },
  { id: 2, title: 'Scan AWS Resources', description: 'Terraport scans your AWS environment to discover all resources, their configurations, and dependencies. This automated discovery ensures nothing is missed during migration.' },
  { id: 3, title: 'Review Resource Mappings', description: 'Review and refine the AI-suggested mappings between your AWS resources and Nutanix configurations. Mapping is optional—you can proceed with unmapped resources, but they will require manual configuration after migration. Resources with higher confidence scores are more likely to translate correctly.' },
  { id: 4, title: 'View Security Issues', description: 'Review security vulnerabilities and compliance issues detected in your AWS resources. Address critical security findings before migration to ensure a secure Nutanix deployment.' },
  { id: 5, title: 'Review & Deploy', description: 'Review and initiate migration' },
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
