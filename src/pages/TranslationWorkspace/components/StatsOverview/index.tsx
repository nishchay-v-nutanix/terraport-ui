import React from 'react';
import {
  FlexLayout,
  StackingLayout,
  Title,
  TextLabel,
  ContainerLayout,
  Progress,
  GridViewIcon,
  AlertTriangleIcon,
  SuccessStatusIcon,
} from '@nutanix-ui/prism-reactjs';
import { TranslationStats } from '../../types';

interface StatsOverviewProps {
  stats: TranslationStats;
}

interface StatCardProps {
  title: string;
  value: number;
  total: number;
  color: 'blue' | 'yellow' | 'green';
  icon: React.ReactNode;
}

const getProgressColor = (color: 'blue' | 'yellow' | 'green'): string => {
  switch (color) {
    case 'blue':
      return 'var(--color-text-link)';
    case 'yellow':
      return 'var(--color-text-warning)';
    case 'green':
      return 'var(--color-text-success)';
    default:
      return 'var(--color-text-secondary-label)';
  }
};

function StatCard({
  title,
  value,
  total,
  color,
  icon,
}: StatCardProps): React.ReactElement {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <ContainerLayout border padding="20px" style={{ flex: 1 }}>
      <FlexLayout justifyContent="space-between" alignItems="flex-start">
        <StackingLayout itemGap="S">
          <FlexLayout alignItems="center" itemGap="XS">
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: getProgressColor(color),
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
          <Title size={Title.TitleSizes.H1}>{value.toLocaleString()}</Title>
          <div style={{ width: '100%' }}>
            <Progress
              percent={percent}
              status={Progress.ProgressStatus.ACTIVE}
              label={false}
              style={{
                '--progress-bar-filled-color': getProgressColor(color),
              } as React.CSSProperties}
            />
          </div>
        </StackingLayout>
        <div
          style={{
            color: 'var(--color-text-secondary-label)',
            width: '24px',
            height: '24px',
          }}
        >
          {icon}
        </div>
      </FlexLayout>
    </ContainerLayout>
  );
}

export default function StatsOverview({
  stats,
}: StatsOverviewProps): React.ReactElement {
  return (
    <FlexLayout itemGap="L" alignItems="stretch">
      <StatCard
        title="Total Resources"
        value={stats.totalResources}
        total={stats.totalResources}
        color="blue"
        icon={<GridViewIcon style={{ width: '24px', height: '24px' }} />}
      />
      <StatCard
        title="Needs Review"
        value={stats.needsReview}
        total={stats.totalResources}
        color="yellow"
        icon={<AlertTriangleIcon style={{ width: '24px', height: '24px' }} />}
      />
      <StatCard
        title="Ready to Commit"
        value={stats.readyToCommit}
        total={stats.totalResources}
        color="green"
        icon={<SuccessStatusIcon style={{ width: '24px', height: '24px' }} />}
      />
    </FlexLayout>
  );
}
