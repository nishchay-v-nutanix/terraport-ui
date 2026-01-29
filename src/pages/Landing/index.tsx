import React, { useState } from 'react';
import {
  Button,
  FlexLayout,
  StackingLayout,
  Title,
  Paragraph,
  TextLabel,
  Link,
  Input,
  ContainerLayout,
  PlusIcon,
} from '@nutanix-ui/prism-reactjs';

import {
  Environment,
  MOCK_ENVIRONMENTS,
  MOCK_STATS,
} from './types';
import EmptyState from './components/EmptyState';
import EnvironmentCard from './components/EnvironmentCard';
import StatsOverview from './components/StatsOverview';
import {
  EnvironmentsGrid,
  AddEnvironmentCard,
} from './styles';
import history from '../../routes/history';

export default function Landing(): React.ReactElement {
  const [environments, setEnvironments] = useState<Environment[]>([]);

  const hasEnvironments = environments.length > 0;

  const handleCreateMigration = () => {
    history.push('/connect-aws');
  };

  const handleConnectProvider = (providerId: string) => {
    if (providerId === 'aws') {
      history.push('/connect-aws');
    } else {
      console.log('Connect provider:', providerId);
    }
  };

  const handleEnvironmentAction = (environmentId: string) => {
    console.log('Environment action:', environmentId);
  };

  const handleAddEnvironment = () => {
    console.log('Add environment clicked');
  };

  const toggleDemoMode = () => {
    if (environments.length === 0) {
      setEnvironments(MOCK_ENVIRONMENTS);
    } else {
      setEnvironments([]);
    }
  };

  const renderHeader = () => (
    <ContainerLayout padding="20px">
      <FlexLayout alignItems="center" justifyContent="space-between">
        <FlexLayout flexGrow="1" style={{ maxWidth: 480 }}>
          <Input
            placeholder="Search environments, pipelines, or logs..."
            search
            style={{ width: '100%' }}
          />
        </FlexLayout>
        <FlexLayout alignItems="center" itemGap="M">
          <Button
            type={Button.ButtonTypes.PRIMARY}
            onClick={hasEnvironments ? handleCreateMigration : toggleDemoMode}
          >
            <FlexLayout alignItems="center" itemGap="XS">
              <PlusIcon />
              Create New Migration
            </FlexLayout>
          </Button>
        </FlexLayout>
      </FlexLayout>
    </ContainerLayout>
  );

  if (!hasEnvironments) {
    return (
      <FlexLayout flexDirection="column" style={{ minHeight: '100%', width: '100%' }}>
        {renderHeader()}
        <ContainerLayout padding="40px">
          <EmptyState
            onCreateMigration={handleCreateMigration}
            onConnectProvider={handleConnectProvider}
          />
        </ContainerLayout>
      </FlexLayout>
    );
  }

  return (
    <FlexLayout flexDirection="column" style={{ minHeight: '100%', width: '100%' }}>
      {renderHeader()}
      <ContainerLayout padding="40px">
        <StackingLayout itemGap="XL">
          {/* Overview Section */}
          <StackingLayout itemGap="S">
            <Title size={Title.TitleSizes.H2}>Overview</Title>
            <Paragraph type="secondary">
              Real-time insight into your infrastructure translation pipelines.
            </Paragraph>
          </StackingLayout>

          <StatsOverview stats={MOCK_STATS} />

          {/* Environments Section */}
          <FlexLayout alignItems="center" justifyContent="space-between">
            <Title size={Title.TitleSizes.H2}>Migration Environments</Title>
            <Link type="forward" href="#environments">
              View all environments
            </Link>
          </FlexLayout>

          <EnvironmentsGrid>
            {environments.map((env) => (
              <EnvironmentCard
                key={env.id}
                environment={env}
                onAction={() => handleEnvironmentAction(env.id)}
              />
            ))}
            <AddEnvironmentCard onClick={handleAddEnvironment}>
              <StackingLayout itemGap="S" style={{ alignItems: 'center' }}>
                <PlusIcon color="var(--color-text-secondary-label)" />
                <Title size={Title.TitleSizes.H4}>Add New Environment</Title>
                <TextLabel type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}>
                  Configure a custom source-target path
                </TextLabel>
              </StackingLayout>
            </AddEnvironmentCard>
          </EnvironmentsGrid>

          {/* Demo toggle button */}
          <Button
            type={Button.ButtonTypes.SECONDARY}
            onClick={toggleDemoMode}
          >
            Toggle Empty State (Demo)
          </Button>
        </StackingLayout>
      </ContainerLayout>
    </FlexLayout>
  );
}
