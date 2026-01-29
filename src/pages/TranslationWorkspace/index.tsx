import React, { useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  FlexLayout,
  StackingLayout,
  Title,
  Paragraph,
  Button,
  TextLabel,
  ContainerLayout,
  Progress,
  QuestionIcon,
  ChevronRightIcon,
} from '@nutanix-ui/prism-reactjs';

import { useTranslationState } from './hooks/useTranslationState';
import { MOCK_MAPPINGS } from './constants';
import {
  AnyResourceMapping,
  VPCMapping as VPCMappingType,
  SecurityGroupMapping as SGMappingType,
  SubnetMapping as SubnetMappingType,
  EC2Mapping as EC2MappingType,
  ConfidenceFilterType,
} from './types';
import { CONNECTION_STEPS } from '../ConnectAWS/types';
import StepFooter, { STEP_FOOTER_HEIGHT } from '../../components/StepFooter';

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

// Title Bar Component - persists across all wizard steps
interface TitleBarProps {
  title: string;
}

const TitleBar: React.FC<TitleBarProps> = ({ title }) => (
  <ContainerLayout
    padding="20px"
    style={{
      paddingLeft: '40px',
      paddingRight: '40px',
      borderBottom: '1px solid var(--color-border-separator)',
      background: 'var(--color-background-base)',
    }}
  >
    <Title size={Title.TitleSizes.H2}>{title}</Title>
  </ContainerLayout>
);

// Wizard Progress Component - persists across all wizard steps
interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  description: string;
}

const WizardProgress: React.FC<WizardProgressProps> = ({
  currentStep,
  totalSteps,
  stepTitle,
  description,
}) => {
  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <StackingLayout itemGap="M" padding="0px">
      <FlexLayout alignItems="center" justifyContent="space-between">
        <StackingLayout itemGap="S">
          <TextLabel
            type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}
            size={TextLabel.TEXT_LABEL_SIZE.SMALL}
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: 'var(--color-text-link)',
              fontWeight: 600,
            }}
          >
            STEP {currentStep} OF {totalSteps}
          </TextLabel>
          <Title size={Title.TitleSizes.H3}>{stepTitle}</Title>
        </StackingLayout>
        <TextLabel type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}>
          {progressPercent}% Completed
        </TextLabel>
      </FlexLayout>
      <Progress
        percent={progressPercent}
        status={Progress.ProgressStatus.ACTIVE}
        label={false}
      />
      <Paragraph type="secondary" forceMultiLineHeight>
        {description}
      </Paragraph>
    </StackingLayout>
  );
};

// Need Help Component - positioned above the footer
const NeedHelpBox: React.FC = () => (
  <ContainerLayout
    border
    padding="15px"
    style={{
      cursor: 'pointer',
      position: 'fixed',
      bottom: '84px',
      right: '24px',
      width: '280px',
      background: 'var(--color-background-base)',
      zIndex: 100,
    }}
  >
    <FlexLayout alignItems="center" justifyContent="space-between">
      <FlexLayout alignItems="center" itemGap="S">
        <QuestionIcon color="var(--color-text-secondary-label)" />
        <StackingLayout itemGap="S">
          <TextLabel type={TextLabel.TEXT_LABEL_TYPE.PRIMARY}>
            Need help?
          </TextLabel>
          <TextLabel
            type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}
            size={TextLabel.TEXT_LABEL_SIZE.SMALL}
          >
            Contact Support
          </TextLabel>
        </StackingLayout>
      </FlexLayout>
      <ChevronRightIcon color="var(--color-text-secondary-label)" />
    </FlexLayout>
  </ContainerLayout>
);

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
  const history = useHistory();

  const {
    mappings,
    stats,
    filter,
    approveMapping,
    rejectMapping,
    setSearchQuery,
    setConfidenceTabFilter,
  } = useTranslationState(MOCK_MAPPINGS);

  // Step 3 data
  const currentStep = 3;
  const currentStepData = CONNECTION_STEPS[currentStep - 1];

  // Handlers
  const handleCompleteReview = useCallback(() => {
    console.log('Completing review...', { sessionId });
    // Navigate to IaC Preview (step 5)
    history.push(`/security/${sessionId}`);
  }, [sessionId, history]);

  const handleBack = useCallback(() => {
    history.push(`/scan/${sessionId}`);
  }, [sessionId, history]);

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
    <FlexLayout flexDirection="column" style={{ minHeight: '100vh', width: '100%', paddingBottom: `${STEP_FOOTER_HEIGHT}px` }}>
      {/* Title Bar - persists across all wizard steps */}
      <TitleBar title="Migrate AWS Environment" />

      {/* Main Content Area */}
      <ContainerLayout padding="40px" style={{ flex: 1 }}>
        <StackingLayout style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Wizard Progress - persists across all wizard steps */}
          <WizardProgress
            currentStep={currentStep}
            totalSteps={CONNECTION_STEPS.length}
            stepTitle={currentStepData.title}
            description={currentStepData.description}
          />

          {/* Main Content Container */}
          <ContainerLayout border padding="30px" style={{ marginTop: '20px' }}>
            <StackingLayout itemGap="L">
              {/* Stats Overview */}
              {/* <StatsOverview stats={stats} /> */}

              {/* Mapped Configurations by Confidence Rating Section */}
              <StackingLayout itemGap="M">
                <Title size={Title.TitleSizes.H3}>Mapped Configurations by Confidence Rating</Title>

                {/* Filter Bar with Confidence Tabs */}
                <FilterBar
                  searchQuery={filter.searchQuery}
                  activeConfidenceTab={filter.confidenceTabFilter}
                  onSearchChange={setSearchQuery}
                  onConfidenceTabChange={setConfidenceTabFilter}
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
                <FlexLayout justifyContent="flex-start" alignItems="center" style={{ marginTop: '20px' }}>
                </FlexLayout>
              </StackingLayout>
            </StackingLayout>
          </ContainerLayout>
        </StackingLayout>
      </ContainerLayout>

      {/* <NeedHelpBox /> */}

      {/* Step Footer */}
      <StepFooter
        currentStep={currentStep}
        totalSteps={CONNECTION_STEPS.length}
        nextLabel="Check Security Issues"
        onNext={handleCompleteReview}
        onBack={handleBack}
        extraContent={<FlexLayout alignItems="center" itemGap="M">
          <TextLabel type={TextLabel.TEXT_LABEL_TYPE.PRIMARY}>
            Approved Mappings
          </TextLabel>
          <Title size={Title.TitleSizes.H3}>
            {stats.approvedCount} of {stats.totalResources}
          </Title>
        </FlexLayout>
        }
      />
    </FlexLayout>
  );
}
