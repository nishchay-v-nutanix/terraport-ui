import React from 'react';
import {
  FlexLayout,
  StackingLayout,
  Title,
  TextLabel,
  Badge,
  ContainerLayout,
} from '@nutanix-ui/prism-reactjs';

import { StatsData } from '../../types';
import { StatsGrid } from './styles';

interface StatsOverviewProps {
  stats: StatsData;
}

export default function StatsOverview({
  stats,
}: StatsOverviewProps): React.ReactElement {
  const formatCurrency = (value: number): string => {
    if (value >= 1000) {
      return `$${Math.floor(value / 1000)}k`;
    }
    return `$${value}`;
  };

  return (
    <StatsGrid>
      {/* Total Migrations */}
      <ContainerLayout border padding="20px">
        <StackingLayout itemGap="S">
          <FlexLayout alignItems="center" justifyContent="space-between">
            <TextLabel type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}>
              Total Migrations
            </TextLabel>
          </FlexLayout>
          <FlexLayout alignItems="baseline" itemGap="S">
            <Title size={Title.TitleSizes.H1}>{stats.totalMigrations}</Title>
            <Badge
              count={`↑ ${stats.totalMigrationsChange}%`}
              color={stats.totalMigrationsChange > 0 ? Badge.BadgeColorTypes.GREEN : Badge.BadgeColorTypes.RED}
              type={Badge.BadgeTypes.TAG}
            />
          </FlexLayout>
          <TextLabel
            type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}
            size={TextLabel.TEXT_LABEL_SIZE.SMALL}
          >
            Workloads translated successfully
          </TextLabel>
        </StackingLayout>
      </ContainerLayout>

      {/* Active Transfers */}
      <ContainerLayout border padding="20px">
        <StackingLayout itemGap="S">
          <FlexLayout alignItems="center" justifyContent="space-between">
            <TextLabel type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}>
              Active Transfers
            </TextLabel>
          </FlexLayout>
          <FlexLayout alignItems="baseline" itemGap="S">
            <Title size={Title.TitleSizes.H1}>{stats.activeTransfers}</Title>
            <Badge
              color={Badge.BadgeColorTypes.BLUE}
              text="Running"
            />
          </FlexLayout>
          <TextLabel
            type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}
            size={TextLabel.TEXT_LABEL_SIZE.SMALL}
          >
            Current processing queue
          </TextLabel>
        </StackingLayout>
      </ContainerLayout>

      {/* Success Rate */}
      <ContainerLayout border padding="20px">
        <StackingLayout itemGap="S">
          <FlexLayout alignItems="center" justifyContent="space-between">
            <TextLabel type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}>
              Success Rate
            </TextLabel>
          </FlexLayout>
          <FlexLayout alignItems="baseline" itemGap="S">
            <Title size={Title.TitleSizes.H1}>{stats.successRate}%</Title>
            <Badge
              color={Badge.BadgeColorTypes.GREEN}
              text="Stable"
            />
          </FlexLayout>
          <TextLabel
            type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}
            size={TextLabel.TEXT_LABEL_SIZE.SMALL}
          >
            Last 30 days reliability
          </TextLabel>
        </StackingLayout>
      </ContainerLayout>

      {/* Infra Savings */}
      <ContainerLayout border padding="20px">
        <StackingLayout itemGap="S">
          <FlexLayout alignItems="center" justifyContent="space-between">
            <TextLabel type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}>
              Infra Savings
            </TextLabel>
          </FlexLayout>
          <FlexLayout alignItems="baseline" itemGap="S">
            <Title size={Title.TitleSizes.H1}>{formatCurrency(stats.infraSavings)}</Title>
            <Badge
              count={`↗ ${stats.infraSavingsChange}%`}
              color={stats.infraSavingsChange > 0 ? Badge.BadgeColorTypes.GREEN : Badge.BadgeColorTypes.RED}
              type={Badge.BadgeTypes.TAG}
            />
          </FlexLayout>
          <TextLabel
            type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}
            size={TextLabel.TEXT_LABEL_SIZE.SMALL}
          >
            Est. annual cloud cost reduction
          </TextLabel>
        </StackingLayout>
      </ContainerLayout>
    </StatsGrid>
  );
}
