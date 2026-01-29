import React from 'react';
import {
  Button,
  FlexLayout,
  StackingLayout,
  Title,
  Paragraph,
  Badge,
  Progress,
  TextLabel,
  ContainerLayout,
  ChevronRightIcon,
} from '@nutanix-ui/prism-reactjs';

import { Environment, CloudProvider } from '../../types';

interface EnvironmentCardProps {
  environment: Environment;
  onAction: () => void;
}

const PROVIDER_SHORT_NAMES: Record<CloudProvider, string> = {
  aws: 'AWS',
  vmware: 'VMW',
  gcp: 'GCP',
};

const STATUS_CONFIG: Record<string, { label: string; color: typeof Badge.BadgeColorTypes[keyof typeof Badge.BadgeColorTypes] }> = {
  active: { label: 'Active', color: Badge.BadgeColorTypes.GREEN },
  coming_soon: { label: 'Coming Soon', color: Badge.BadgeColorTypes.GRAY },
  beta: { label: 'Beta', color: Badge.BadgeColorTypes.YELLOW },
};

export default function EnvironmentCard({
  environment,
  onAction,
}: EnvironmentCardProps): React.ReactElement {
  const {
    provider,
    name,
    description,
    status,
    activePipelines,
    currentLoad,
    teamMembers,
  } = environment;

  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.coming_soon;

  const renderActiveContent = () => (
    <StackingLayout itemGap="M">
      {/* Metrics */}
      <StackingLayout itemGap="S">
        <FlexLayout alignItems="center" itemGap="M">
          <TextLabel
            type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}
            size={TextLabel.TEXT_LABEL_SIZE.SMALL}
          >
            Current Load
          </TextLabel>
          <TextLabel type={TextLabel.TEXT_LABEL_TYPE.PRIMARY}>
            {activePipelines} Active Pipelines
          </TextLabel>
        </FlexLayout>
        {currentLoad !== undefined && (
          <Progress
            percent={currentLoad}
            status={Progress.ProgressStatus.ACTIVE}
            label={false}
          />
        )}
      </StackingLayout>

      {/* Footer */}
      <FlexLayout alignItems="center" justifyContent="space-between">
        <FlexLayout alignItems="center" itemGap="none">
          {teamMembers?.slice(0, 2).map((member, index) => (
            <Badge
              key={index}
              count={member}
              color={Badge.BadgeColorTypes.GRAY}
              style={{ marginLeft: index > 0 ? -8 : 0 }}
            />
          ))}
          {teamMembers && teamMembers.length > 2 && (
            <Badge
              count={`+${teamMembers.length - 2}`}
              color={Badge.BadgeColorTypes.GRAY}
              style={{ marginLeft: -8 }}
            />
          )}
        </FlexLayout>
        <Button type={Button.ButtonTypes.SECONDARY} onClick={onAction}>
          <FlexLayout alignItems="center" itemGap="XS">
            Manage
            <ChevronRightIcon />
          </FlexLayout>
        </Button>
      </FlexLayout>
    </StackingLayout>
  );

  const renderComingSoonContent = () => (
    <FlexLayout alignItems="center" justifyContent="flex-end">
      <Button type={Button.ButtonTypes.SECONDARY} onClick={onAction}>
        Notify when available
      </Button>
    </FlexLayout>
  );

  const renderBetaContent = () => (
    <StackingLayout itemGap="M">
      <Badge
        count="Limited Availability"
        color={Badge.BadgeColorTypes.YELLOW}
        type={Badge.BadgeTypes.TAG}
      />
      <Paragraph type="supplementary">
        Currently available for select enterprise partners only.
      </Paragraph>
      <FlexLayout alignItems="center" justifyContent="flex-end">
        <Button type={Button.ButtonTypes.PRIMARY} onClick={onAction}>
          Request Access
        </Button>
      </FlexLayout>
    </StackingLayout>
  );

  const renderContent = () => {
    switch (status) {
      case 'active':
        return renderActiveContent();
      case 'coming_soon':
        return renderComingSoonContent();
      case 'beta':
        return renderBetaContent();
      default:
        return null;
    }
  };

  return (
    <ContainerLayout
      border
      padding="20px"
      style={{
        opacity: status === 'coming_soon' ? 0.6 : 1,
        transition: 'all 0.2s ease',
      }}
    >
      <StackingLayout itemGap="M">
        {/* Header */}
        <FlexLayout alignItems="center" justifyContent="space-between">
          <FlexLayout alignItems="center" itemGap="S">
            <Badge
              count={PROVIDER_SHORT_NAMES[provider]}
              color={Badge.BadgeColorTypes.GRAY}
              type={Badge.BadgeTypes.TAG}
            />
            <ChevronRightIcon color="var(--color-text-secondary-label)" />
            <Badge
              count="NTNX"
              color={Badge.BadgeColorTypes.BLUE}
              type={Badge.BadgeTypes.TAG}
            />
          </FlexLayout>
          <Badge
            count={statusConfig.label}
            color={statusConfig.color}
            type={Badge.BadgeTypes.TAG}
          />
        </FlexLayout>

        {/* Environment Info */}
        <StackingLayout itemGap="XS">
          <Title size={Title.TitleSizes.H3}>{name}</Title>
          <Paragraph type="secondary">{description}</Paragraph>
        </StackingLayout>

        {/* Status-specific content */}
        {renderContent()}
      </StackingLayout>
    </ContainerLayout>
  );
}
