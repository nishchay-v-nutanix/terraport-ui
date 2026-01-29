import React from 'react';
import {
  FlexLayout,
  StackingLayout,
  Title,
  TextLabel,
  ContainerLayout,
  Badge,
} from '@nutanix-ui/prism-reactjs';

interface StatsCardProps {
  title: string;
  value: number;
  changePercent: number;
  changeDirection: 'up' | 'down';
  description: string;
  statusColor: 'green' | 'yellow' | 'blue';
  icon?: React.ReactNode;
}

const getStatusDotColor = (color: 'green' | 'yellow' | 'blue'): string => {
  switch (color) {
    case 'green':
      return 'var(--color-text-success)';
    case 'yellow':
      return 'var(--color-text-warning)';
    case 'blue':
      return 'var(--color-text-link)';
    default:
      return 'var(--color-text-secondary-label)';
  }
};

export default function StatsCard({
  title,
  value,
  changePercent,
  changeDirection,
  description,
  statusColor,
  icon,
}: StatsCardProps): React.ReactElement {
  const badgeColor =
    changeDirection === 'up'
      ? Badge.BadgeColorTypes.GREEN
      : Badge.BadgeColorTypes.RED;

  return (
    <ContainerLayout
      border
      padding="20px"
      style={{ flex: 1 }}
    >
      <FlexLayout justifyContent="space-between" alignItems="flex-start">
        <StackingLayout itemGap="S">
          {/* Status dot + Title */}
          <FlexLayout alignItems="center" itemGap="XS">
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: getStatusDotColor(statusColor),
              }}
            />
            <TextLabel
              type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}
              size={TextLabel.TEXT_LABEL_SIZE.SMALL}
              style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}
            >
              {title}
            </TextLabel>
          </FlexLayout>

          {/* Value + Change Badge */}
          <FlexLayout alignItems="center" itemGap="S">
            <Title size={Title.TitleSizes.H1}>{value.toLocaleString()}</Title>
            <Badge
              color={badgeColor}
              count={`${changeDirection === 'up' ? '↗' : '↘'}${changePercent}%`}
              type={Badge.BadgeTypes.TAG}
            />
          </FlexLayout>

          {/* Description */}
          <TextLabel type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}>
            {description}
          </TextLabel>
        </StackingLayout>

        {/* Right-side Icon */}
        {icon && (
          <div style={{ color: 'var(--color-text-secondary-label)' }}>
            {icon}
          </div>
        )}
      </FlexLayout>
    </ContainerLayout>
  );
}
