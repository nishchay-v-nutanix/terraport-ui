import React from 'react';
import {
  Button,
  FlexLayout,
  StackingLayout,
  Title,
  Paragraph,
  Link,
  TextLabel,
  Divider,
  PlusIcon,
} from '@nutanix-ui/prism-reactjs';

import { CLOUD_PROVIDERS, CloudProviderInfo } from '../../types';
import CloudProviderCard from '../CloudProviderCard';
import { ProvidersGrid } from './styles';

interface EmptyStateProps {
  onCreateMigration: () => void;
  onConnectProvider: (_providerId: string) => void;
}

export default function EmptyState({
  onCreateMigration,
  onConnectProvider,
}: EmptyStateProps): React.ReactElement {
  return (
    <FlexLayout
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      padding="40px"
    >
      {/* Hero Section */}
      <StackingLayout itemGap="M" style={{ alignItems: 'center', textAlign: 'center', maxWidth: 600 }}>
        <Title size={Title.TitleSizes.H1}>No Migrations Yet</Title>
        <Paragraph type="secondary" forceMultiLineHeight>
          Ready to modernize? Connect your legacy cloud source to automatically
          translate your infrastructure to Nutanix-compatible plans.
        </Paragraph>
        <Button
          type={Button.ButtonTypes.PRIMARY}
          onClick={onCreateMigration}
        >
          <FlexLayout alignItems="center" itemGap="XS" padding="0px-10px">
            <PlusIcon />
            Create Your First Migration
          </FlexLayout>
        </Button>
      </StackingLayout>

      {/* Divider with text */}
      <FlexLayout
        alignItems="center"
        itemGap="L"
        padding="40px"
        style={{ width: '100%', maxWidth: 800 }}
      >
        <Divider />
        <TextLabel
          type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}
          size={TextLabel.TEXT_LABEL_SIZE.SMALL}
          style={{ whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: 1.5 }}
        >
          Or start by connecting a provider
        </TextLabel>
        <Divider />
      </FlexLayout>

      {/* Provider Cards */}
      <ProvidersGrid>
        {CLOUD_PROVIDERS.map((provider: CloudProviderInfo) => (
          <CloudProviderCard
            key={provider.id}
            provider={provider}
            onConnect={() => onConnectProvider(provider.id)}
          />
        ))}
      </ProvidersGrid>

      {/* Help Link */}
      <FlexLayout alignItems="center" itemGap="S" padding="40px">
        <TextLabel type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}>
          Need help setting up your first environment?
        </TextLabel>
        <Link type="primary" href="#docs">
          Read the documentation.
        </Link>
      </FlexLayout>
    </FlexLayout>
  );
}
