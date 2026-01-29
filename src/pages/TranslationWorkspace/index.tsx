import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  FlexLayout,
  StackingLayout,
  Title,
  Paragraph,
  Button,
  TextLabel,
  ContainerLayout,
  SaveIcon,
  TickCircleIcon,
} from '@nutanix-ui/prism-reactjs';

import { useTranslationState } from './hooks/useTranslationState';
import { MOCK_MAPPINGS } from './constants';
import {
  AnyResourceMapping,
  VPCMapping as VPCMappingType,
  SecurityGroupMapping as SGMappingType,
  SubnetMapping as SubnetMappingType,
  EC2Mapping as EC2MappingType,
  ResourceFilterType,
} from './types';

// Components
import StatsOverview from './components/StatsOverview';
import FilterBar from './components/FilterBar';
import VPCMapping from './components/VPCMapping';
import SecurityGroupMapping from './components/SecurityGroupMapping';
import SubnetMapping from './components/SubnetMapping';
import EC2Mapping from './components/EC2Mapping';

interface RouteParams {
  sessionId: string;
}

// Column Headers Component
function ColumnHeaders(): React.ReactElement {
  return (
    <FlexLayout
      alignItems="center"
      style={{
        padding: '12px 20px',
        borderBottom: '1px solid var(--color-border-separator)',
      }}
    >
      <TextLabel
        type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}
        size={TextLabel.TEXT_LABEL_SIZE.SMALL}
        style={{
          flex: 2,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        AWS SOURCE CONFIGURATION
      </TextLabel>
      <TextLabel
        type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}
        size={TextLabel.TEXT_LABEL_SIZE.SMALL}
        style={{
          width: '60px',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {/* Arrow column - no header text */}
      </TextLabel>
      <TextLabel
        type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}
        size={TextLabel.TEXT_LABEL_SIZE.SMALL}
        style={{
          flex: 2,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        NUTANIX TARGET CONFIGURATION
      </TextLabel>
      <TextLabel
        type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}
        size={TextLabel.TEXT_LABEL_SIZE.SMALL}
        style={{
          width: '160px',
          textAlign: 'right',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        CONFIDENCE
      </TextLabel>
    </FlexLayout>
  );
}

// Render mapping based on type
function renderMapping(
  mapping: AnyResourceMapping,
  handlers: {
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    onEdit?: (id: string) => void;
    onVLANSelect?: (id: string, vlanKey: string) => void;
    onCategoryChange?: (id: string, category: string) => void;
    onActionChange?: (id: string, action: string) => void;
  }
): React.ReactElement | null {
  switch (mapping.source.type) {
    case 'vpc':
      return (
        <VPCMapping
          key={mapping.id}
          mapping={mapping as VPCMappingType}
          onApprove={handlers.onApprove}
          onReject={handlers.onReject}
          onEdit={handlers.onEdit}
        />
      );
    case 'security_group':
      return (
        <SecurityGroupMapping
          key={mapping.id}
          mapping={mapping as SGMappingType}
          onApprove={handlers.onApprove}
          onReject={handlers.onReject}
          onEdit={handlers.onEdit}
          onCategoryChange={handlers.onCategoryChange}
          onActionChange={handlers.onActionChange}
        />
      );
    case 'subnet':
      return (
        <SubnetMapping
          key={mapping.id}
          mapping={mapping as SubnetMappingType}
          onApprove={handlers.onApprove}
          onReject={handlers.onReject}
          onEdit={handlers.onEdit}
          onVLANSelect={handlers.onVLANSelect}
        />
      );
    case 'ec2':
      return (
        <EC2Mapping
          key={mapping.id}
          mapping={mapping as EC2MappingType}
          onApprove={handlers.onApprove}
          onReject={handlers.onReject}
          onEdit={handlers.onEdit}
        />
      );
    default:
      return null;
  }
}

export default function TranslationWorkspace(): React.ReactElement {
  const { sessionId } = useParams<RouteParams>();

  const {
    mappings,
    stats,
    filter,
    hasUnsavedChanges,
    approveMapping,
    rejectMapping,
    setSearchQuery,
    setFilterType,
  } = useTranslationState(MOCK_MAPPINGS);

  // Handlers
  const handleSaveDraft = useCallback(() => {
    // TODO: Implement save draft functionality
    console.log('Saving draft...', { sessionId, hasUnsavedChanges });
    alert('Draft saved successfully!');
  }, [sessionId, hasUnsavedChanges]);

  const handleCommitTranslation = useCallback(() => {
    // TODO: Implement commit functionality with confirmation modal
    const confirmed = window.confirm(
      `Are you sure you want to commit ${stats.readyToCommit} translations?\n\n` +
        `Total Resources: ${stats.totalResources}\n` +
        `Ready to Commit: ${stats.readyToCommit}\n` +
        `Needs Review: ${stats.needsReview}`
    );

    if (confirmed) {
      console.log('Committing translations...', { sessionId });
      alert('Translations committed successfully!');
    }
  }, [sessionId, stats]);

  const handleExport = useCallback(() => {
    // TODO: Implement export functionality
    console.log('Exporting mappings...');
    alert('Export functionality coming soon!');
  }, []);

  const handleAdvancedFilter = useCallback(() => {
    // TODO: Implement advanced filter modal
    console.log('Opening advanced filter...');
    alert('Advanced filter coming soon!');
  }, []);

  const handleVLANSelect = useCallback(
    (mappingId: string, vlanKey: string) => {
      // TODO: Implement VLAN selection
      console.log('VLAN selected:', { mappingId, vlanKey });
    },
    []
  );

  const handleCategoryChange = useCallback(
    (mappingId: string, category: string) => {
      // TODO: Implement category change
      console.log('Category changed:', { mappingId, category });
    },
    []
  );

  const handleActionChange = useCallback(
    (mappingId: string, action: string) => {
      // TODO: Implement action change
      console.log('Action changed:', { mappingId, action });
    },
    []
  );

  const mappingHandlers = {
    onApprove: approveMapping,
    onReject: rejectMapping,
    onEdit: undefined, // TODO: Implement edit modal
    onVLANSelect: handleVLANSelect,
    onCategoryChange: handleCategoryChange,
    onActionChange: handleActionChange,
  };

  return (
    <ContainerLayout padding="40px">
      <StackingLayout itemGap="L">
        {/* Header */}
        <FlexLayout justifyContent="space-between" alignItems="flex-start">
          <StackingLayout itemGap="XS">
            <Title size={Title.TitleSizes.H1}>Translation Workspace</Title>
            <Paragraph type="secondary" forceMultiLineHeight>
              Mapping AWS VPC infrastructure to Nutanix Prism Central.
              Review AI suggestions before committing.
            </Paragraph>
          </StackingLayout>
          <FlexLayout itemGap="S">
            <Button
              type={Button.ButtonTypes.SECONDARY}
              onClick={handleSaveDraft}
              disabled={!hasUnsavedChanges}
            >
              <FlexLayout alignItems="center" itemGap="XS">
                <SaveIcon style={{ width: '16px', height: '16px' }} />
                Save Draft
              </FlexLayout>
            </Button>
            <Button
              type={Button.ButtonTypes.PRIMARY}
              onClick={handleCommitTranslation}
              disabled={stats.readyToCommit === 0}
            >
              <FlexLayout alignItems="center" itemGap="XS">
                <TickCircleIcon style={{ width: '16px', height: '16px' }} />
                Commit Translation
              </FlexLayout>
            </Button>
          </FlexLayout>
        </FlexLayout>

        {/* Stats Overview */}
        <StatsOverview stats={stats} />

        {/* Filter Bar */}
        <FilterBar
          searchQuery={filter.searchQuery}
          activeFilter={filter.type}
          onSearchChange={setSearchQuery}
          onFilterChange={setFilterType}
          onExport={handleExport}
          onAdvancedFilter={handleAdvancedFilter}
        />

        {/* Column Headers */}
        <ColumnHeaders />

        {/* Resource Mapping Cards */}
        <StackingLayout itemGap="none">
          {mappings.length === 0 ? (
            <ContainerLayout
              border
              padding="40px"
              style={{ textAlign: 'center' }}
            >
              <TextLabel type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}>
                No resources found matching your filters.
              </TextLabel>
            </ContainerLayout>
          ) : (
            mappings.map((mapping) => renderMapping(mapping, mappingHandlers))
          )}
        </StackingLayout>

        {/* Summary Footer */}
        <FlexLayout justifyContent="space-between" alignItems="center">
          <TextLabel type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}>
            Showing {mappings.length} of {stats.totalResources} resources
          </TextLabel>
          <TextLabel type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}>
            Session ID: {sessionId}
          </TextLabel>
        </FlexLayout>
      </StackingLayout>
    </ContainerLayout>
  );
}
