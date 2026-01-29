import React from 'react';
import {
  Button,
  FlexLayout,
  StackingLayout,
  Title,
  Paragraph,
  Badge,
  ContainerLayout,
  ChevronRightIcon,
} from '@nutanix-ui/prism-reactjs';

import { CloudProviderInfo } from '../../types';

interface CloudProviderCardProps {
  provider: CloudProviderInfo;
  onConnect: () => void;
}

export default function CloudProviderCard({
  provider,
  onConnect,
}: CloudProviderCardProps): React.ReactElement {
  const { shortName, name, description, isAvailable } = provider;

  return (
    <ContainerLayout
      border
      padding="20px"
      style={{
        opacity: isAvailable ? 1 : 0.6,
        transition: 'all 0.2s ease',
      }}
    >
      <StackingLayout itemGap="M">
        {/* Header with badge and status */}
        <FlexLayout alignItems="flex-start" justifyContent="space-between">
          <Badge
            count={shortName}
            color={Badge.BadgeColorTypes.GRAY}
            type={Badge.BadgeTypes.TAG}
          />
          <Badge
            color={isAvailable ? Badge.BadgeColorTypes.GREEN : Badge.BadgeColorTypes.GRAY}
          />
        </FlexLayout>

        {/* Provider Info */}
        <StackingLayout itemGap="XS">
          <Title size={Title.TitleSizes.H3}>{name}</Title>
          <Paragraph type="secondary">{description}</Paragraph>
        </StackingLayout>

        {/* Connect Button */}
        <Button
          type={Button.ButtonTypes.SECONDARY}
          onClick={isAvailable ? onConnect : undefined}
          disabled={!isAvailable}
          fullWidth
        >
          <FlexLayout alignItems="center" justifyContent="center" itemGap="XS">
            Connect
            <ChevronRightIcon />
          </FlexLayout>
        </Button>
      </StackingLayout>
    </ContainerLayout>
  );
}
