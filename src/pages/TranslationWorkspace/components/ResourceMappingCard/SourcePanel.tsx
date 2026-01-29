import React from 'react';
import {
  FlexLayout,
  StackingLayout,
  Title,
  TextLabel,
  ContainerLayout,
  CloudIcon,
  LayersIcon,
  SecureIcon,
  VMIcon,
  StorageIcon,
} from '@nutanix-ui/prism-reactjs';
import { AWSResourceType } from '../../types';
import { REGION_DISPLAY_NAMES } from '../../constants';

interface SourcePanelProps {
  resourceType: AWSResourceType;
  resourceId: string;
  resourceName: string;
  region: string;
  configLines: string[];
}

const getResourceTypeIcon = (type: AWSResourceType): React.ReactNode => {
  const iconStyle = { width: '32px', height: '32px' };

  switch (type) {
    case 'vpc':
      return (
        <CloudIcon
          style={{ ...iconStyle, color: 'var(--color-text-warning)' }}
        />
      );
    case 'subnet':
      return (
        <LayersIcon style={{ ...iconStyle, color: 'var(--color-text-error)' }} />
      );
    case 'security_group':
      return (
        <SecureIcon style={{ ...iconStyle, color: 'var(--color-text-link)' }} />
      );
    case 'ec2':
      return (
        <VMIcon style={{ ...iconStyle, color: 'var(--color-text-success)' }} />
      );
    case 'ebs':
      return (
        <StorageIcon
          style={{ ...iconStyle, color: 'var(--color-text-link)' }}
        />
      );
    default:
      return (
        <CloudIcon
          style={{ ...iconStyle, color: 'var(--color-text-secondary-label)' }}
        />
      );
  }
};

const getResourceTypeLabel = (type: AWSResourceType): string => {
  switch (type) {
    case 'vpc':
      return 'VPC';
    case 'subnet':
      return 'Subnet';
    case 'security_group':
      return 'Security Group';
    case 'ec2':
      return 'EC2 Instance';
    case 'ebs':
      return 'EBS Volume';
    default:
      return 'Resource';
  }
};

export default function SourcePanel({
  resourceType,
  resourceId,
  resourceName,
  region,
  configLines,
}: SourcePanelProps): React.ReactElement {
  const regionDisplayName = REGION_DISPLAY_NAMES[region] || region;

  return (
    <StackingLayout itemGap="S" style={{ flex: 2 }}>
      {/* Header with icon and resource info */}
      <FlexLayout alignItems="center" itemGap="S">
        {getResourceTypeIcon(resourceType)}
        <StackingLayout itemGap="S">
          <FlexLayout alignItems="center" itemGap="XS">
            <Title size={Title.TitleSizes.H3}>{resourceId}</Title>
            <TextLabel
              type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}
              size={TextLabel.TEXT_LABEL_SIZE.SMALL}
            >
              {getResourceTypeLabel(resourceType)}
            </TextLabel>
          </FlexLayout>
          <TextLabel type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}>
            {resourceName} | {regionDisplayName}
          </TextLabel>
        </StackingLayout>
      </FlexLayout>

      {/* Code block for configuration */}
      {configLines.length > 0 && (
        <ContainerLayout
          backgroundColor="dark"
          padding="10px"
          style={{
            fontFamily: 'monospace',
            fontSize: '12px',
            borderRadius: '4px',
          }}
        >
          <StackingLayout itemGap="XS">
            {configLines.map((line, index) => (
              <TextLabel
                key={index}
                type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}
                style={{
                  display: 'block',
                  color: 'var(--color-text-secondary-label)',
                }}
              >
                {line}
              </TextLabel>
            ))}
          </StackingLayout>
        </ContainerLayout>
      )}
    </StackingLayout>
  );
}
