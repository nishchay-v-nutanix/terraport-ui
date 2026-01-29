import React from 'react';
import {
  FlexLayout,
  StackingLayout,
  Title,
  TextLabel,
  ContainerLayout,
  ConnectIcon,
  SecureIcon,
  VMIcon,
  StorageIcon,
  QuestionSquareIcon,
} from '@nutanix-ui/prism-reactjs';
import { NutanixResourceType } from '../../types';

interface TargetPanelProps {
  hasMatch: boolean;
  resourceType?: NutanixResourceType;
  resourceName?: string;
  location?: React.ReactNode;
  configLines?: string[];
  noMatchMessage?: string;
  children?: React.ReactNode;
}

const getResourceTypeIcon = (type?: NutanixResourceType): React.ReactNode => {
  const iconStyle = { width: '32px', height: '32px' };

  if (!type) {
    return (
      <QuestionSquareIcon
        style={{ ...iconStyle, color: 'var(--color-text-warning)' }}
      />
    );
  }

  switch (type) {
    case 'vlan':
    case 'ip_pool':
      return (
        <ConnectIcon
          style={{ ...iconStyle, color: 'var(--color-text-success)' }}
        />
      );
    case 'security_policy':
      return (
        <SecureIcon style={{ ...iconStyle, color: 'var(--color-text-link)' }} />
      );
    case 'vm':
      return (
        <VMIcon style={{ ...iconStyle, color: 'var(--color-text-success)' }} />
      );
    case 'volume_group':
      return (
        <StorageIcon
          style={{ ...iconStyle, color: 'var(--color-text-link)' }}
        />
      );
    default:
      return (
        <ConnectIcon
          style={{ ...iconStyle, color: 'var(--color-text-secondary-label)' }}
        />
      );
  }
};

const getResourceTypeLabel = (type?: NutanixResourceType): string => {
  if (!type) return 'No Match';

  switch (type) {
    case 'vlan':
      return 'VLAN';
    case 'ip_pool':
      return 'IP Pool';
    case 'security_policy':
      return 'Security Policy';
    case 'vm':
      return 'VM Profile';
    case 'volume_group':
      return 'Volume Group';
    case 'category':
      return 'Category';
    default:
      return 'Resource';
  }
};

export default function TargetPanel({
  hasMatch,
  resourceType,
  resourceName,
  location,
  configLines = [],
  noMatchMessage = 'Please select a target manually',
  children,
}: TargetPanelProps): React.ReactElement {
  if (!hasMatch) {
    return (
      <StackingLayout itemGap="S" style={{ flex: 2 }}>
        <FlexLayout alignItems="center" itemGap="S">
          {getResourceTypeIcon(undefined)}
          <StackingLayout itemGap="S">
            <Title size={Title.TitleSizes.H3}>No Match Found</Title>
            <TextLabel type={TextLabel.TEXT_LABEL_TYPE.WARNING}>
              {noMatchMessage}
            </TextLabel>
          </StackingLayout>
        </FlexLayout>
        {children}
      </StackingLayout>
    );
  }

  return (
    <StackingLayout itemGap="S" style={{ flex: 2 }}>
      {/* Header with icon and resource info */}
      <FlexLayout alignItems="center" itemGap="S">
        {getResourceTypeIcon(resourceType)}
        <StackingLayout itemGap="S">
          <FlexLayout alignItems="center" itemGap="XS">
            <Title size={Title.TitleSizes.H3}>{resourceName}</Title>
            <TextLabel
              type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}
              size={TextLabel.TEXT_LABEL_SIZE.SMALL}
            >
              {getResourceTypeLabel(resourceType)}
            </TextLabel>
          </FlexLayout>
          {location && (
            typeof location === 'string' ? (
              <TextLabel type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}>
                {location}
              </TextLabel>
            ) : (
              location
            )
          )}
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

      {/* Custom content (e.g., dropdowns) */}
      {children}
    </StackingLayout>
  );
}
