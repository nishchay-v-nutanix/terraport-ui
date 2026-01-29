import React from 'react';
import {
  FlexLayout,
  StackingLayout,
  Title,
  Paragraph,
  Badge,
  ContainerLayout,
} from '@nutanix-ui/prism-reactjs';

import { CloudProviderInfo } from '../../types';

interface CloudProviderCardProps {
  provider: CloudProviderInfo;
}

export default function CloudProviderCard({
  provider,
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
        {/* Header with badge */}
        <FlexLayout alignItems="flex-start" justifyContent="space-between">
          <Badge
            count={shortName}
            color={Badge.BadgeColorTypes.GRAY}
            type={Badge.BadgeTypes.TAG}
          />
          {!isAvailable && (
            <Badge
              count="Coming Soon"
              color={Badge.BadgeColorTypes.GRAY}
              type={Badge.BadgeTypes.TAG}
            />
          )}
        </FlexLayout>

        {/* Provider Info */}
        <StackingLayout itemGap="XS">
          <Title size={Title.TitleSizes.H3}>{name}</Title>
          <Paragraph type="secondary">{description}</Paragraph>
        </StackingLayout>
      </StackingLayout>
    </ContainerLayout>
  );
}
