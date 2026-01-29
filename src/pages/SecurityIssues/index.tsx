import React, { useState, useCallback, useMemo } from 'react';
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
  Badge,
  Input,
  AlertTriangleIcon,
  BanCircleIcon,
  QuestionIcon,
  ChevronRightIcon,
  SuccessStatusIcon,
} from '@nutanix-ui/prism-reactjs';

import { CONNECTION_STEPS } from '../ConnectAWS/types';
import StepFooter, { STEP_FOOTER_HEIGHT } from '../../components/StepFooter';
import {
  SecurityIssue,
  SecurityStats,
  SeverityFilterType,
  SecurityIssueStatus,
} from './types';
import {
  MOCK_SECURITY_ISSUES,
  SEVERITY_FILTER_TABS,
  SEVERITY_COLORS,
  SEVERITY_LABELS,
  CATEGORY_LABELS,
} from './constants';

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

// Severity Badge Component
interface SeverityBadgeProps {
  severity: string;
}

const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
  const color = SEVERITY_COLORS[severity] || '#6b7280';
  const label = SEVERITY_LABELS[severity] || severity;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        borderRadius: '4px',
        backgroundColor: `${color}15`,
        border: `1px solid ${color}`,
      }}
    >
      <TextLabel
        type={TextLabel.TEXT_LABEL_TYPE.PRIMARY}
        size={TextLabel.TEXT_LABEL_SIZE.SMALL}
        style={{ color, fontWeight: 600, textTransform: 'uppercase' }}
      >
        {label}
      </TextLabel>
    </div>
  );
};

// Stats Overview Component
interface StatsOverviewProps {
  stats: SecurityStats;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => (
  <FlexLayout itemGap="L" style={{ marginBottom: '20px' }}>
    <ContainerLayout
      border
      padding="20px"
      style={{ flex: 1, textAlign: 'center' }}
    >
      <StackingLayout itemGap="XS">
        <Title size={Title.TitleSizes.H2}>{stats.totalIssues}</Title>
        <TextLabel type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}>
          Total Issues
        </TextLabel>
      </StackingLayout>
    </ContainerLayout>
    <ContainerLayout
      border
      padding="20px"
      style={{ flex: 1, textAlign: 'center', borderColor: SEVERITY_COLORS.critical }}
    >
      <StackingLayout itemGap="XS">
        <Title size={Title.TitleSizes.H2} style={{ color: SEVERITY_COLORS.critical }}>
          {stats.criticalCount}
        </Title>
        <TextLabel type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}>
          Critical
        </TextLabel>
      </StackingLayout>
    </ContainerLayout>
    <ContainerLayout
      border
      padding="20px"
      style={{ flex: 1, textAlign: 'center', borderColor: SEVERITY_COLORS.high }}
    >
      <StackingLayout itemGap="XS">
        <Title size={Title.TitleSizes.H2} style={{ color: SEVERITY_COLORS.high }}>
          {stats.highCount}
        </Title>
        <TextLabel type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}>
          High
        </TextLabel>
      </StackingLayout>
    </ContainerLayout>
    <ContainerLayout
      border
      padding="20px"
      style={{ flex: 1, textAlign: 'center', borderColor: SEVERITY_COLORS.medium }}
    >
      <StackingLayout itemGap="XS">
        <Title size={Title.TitleSizes.H2} style={{ color: SEVERITY_COLORS.medium }}>
          {stats.mediumCount}
        </Title>
        <TextLabel type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}>
          Medium
        </TextLabel>
      </StackingLayout>
    </ContainerLayout>
    <ContainerLayout
      border
      padding="20px"
      style={{ flex: 1, textAlign: 'center', borderColor: SEVERITY_COLORS.low }}
    >
      <StackingLayout itemGap="XS">
        <Title size={Title.TitleSizes.H2} style={{ color: SEVERITY_COLORS.low }}>
          {stats.lowCount}
        </Title>
        <TextLabel type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}>
          Low
        </TextLabel>
      </StackingLayout>
    </ContainerLayout>
  </FlexLayout>
);

// Security Issue Card Component
interface SecurityIssueCardProps {
  issue: SecurityIssue;
  onAcknowledge: (id: string) => void;
}

const SecurityIssueCard: React.FC<SecurityIssueCardProps> = ({
  issue,
  onAcknowledge,
}) => {
  const isAcknowledged = issue.status === 'acknowledged';
  const severityColor = SEVERITY_COLORS[issue.severity] || '#6b7280';

  return (
    <ContainerLayout
      border
      padding="20px"
      style={{
        marginBottom: '12px',
        borderLeft: `4px solid ${severityColor}`,
        backgroundColor: isAcknowledged
          ? 'var(--color-background-success-light)'
          : undefined,
      }}
    >
      <FlexLayout alignItems="flex-start" itemGap="L">
        {/* Icon */}
        <FlexLayout
          alignItems="center"
          justifyContent="center"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '8px',
            backgroundColor: `${severityColor}15`,
            flexShrink: 0,
          }}
        >
          {issue.severity === 'critical' || issue.severity === 'high' ? (
            <BanCircleIcon
              style={{ width: '24px', height: '24px', color: severityColor }}
            />
          ) : (
            <AlertTriangleIcon
              style={{ width: '24px', height: '24px', color: severityColor }}
            />
          )}
        </FlexLayout>

        {/* Content */}
        <StackingLayout itemGap="S" style={{ flex: 1 }}>
          {/* Header Row */}
          <FlexLayout
            alignItems="center"
            justifyContent="space-between"
            itemGap="M"
          >
            <FlexLayout alignItems="center" itemGap="M">
              <Title size={Title.TitleSizes.H4}>{issue.title}</Title>
              <SeverityBadge severity={issue.severity} />
              <Badge
                color={Badge.BadgeColorTypes.GRAY}
                count={CATEGORY_LABELS[issue.category] || issue.category}
                type={Badge.BadgeTypes.TAG}
              />
            </FlexLayout>
            {isAcknowledged && (
              <FlexLayout alignItems="center" itemGap="XS">
                <SuccessStatusIcon
                  style={{
                    width: '16px',
                    height: '16px',
                    color: 'var(--color-text-success)',
                  }}
                />
                <TextLabel
                  type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}
                  size={TextLabel.TEXT_LABEL_SIZE.SMALL}
                  style={{ color: 'var(--color-text-success)' }}
                >
                  Acknowledged
                </TextLabel>
              </FlexLayout>
            )}
          </FlexLayout>

          {/* Description */}
          <Paragraph type="secondary" forceMultiLineHeight>
            {issue.description}
          </Paragraph>

          {/* Affected Resource */}
          <FlexLayout alignItems="center" itemGap="S">
            <TextLabel
              type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}
              size={TextLabel.TEXT_LABEL_SIZE.SMALL}
            >
              Affected Resource:
            </TextLabel>
            <Badge
              color={Badge.BadgeColorTypes.BLUE}
              count={`${issue.affectedResource.type}: ${issue.affectedResource.name}`}
              type={Badge.BadgeTypes.TAG}
            />
            <TextLabel
              type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}
              size={TextLabel.TEXT_LABEL_SIZE.SMALL}
            >
              ({issue.affectedResource.region})
            </TextLabel>
          </FlexLayout>

          {/* Details */}
          <ContainerLayout
            padding="10px"
            style={{
              backgroundColor: 'var(--color-background-light)',
              borderRadius: '4px',
            }}
          >
            <StackingLayout itemGap="XS">
              <TextLabel
                type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}
                size={TextLabel.TEXT_LABEL_SIZE.SMALL}
                style={{ fontWeight: 600 }}
              >
                Details:
              </TextLabel>
              {issue.details.map((detail, index) => (
                <TextLabel
                  key={index}
                  type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}
                  size={TextLabel.TEXT_LABEL_SIZE.SMALL}
                >
                  • {detail}
                </TextLabel>
              ))}
            </StackingLayout>
          </ContainerLayout>

          {/* Recommendation */}
          <StackingLayout itemGap="XS">
            <TextLabel
              type={TextLabel.TEXT_LABEL_TYPE.PRIMARY}
              size={TextLabel.TEXT_LABEL_SIZE.SMALL}
              style={{ fontWeight: 600 }}
            >
              Recommendation:
            </TextLabel>
            <Paragraph type="secondary" forceMultiLineHeight>
              {issue.recommendation}
            </Paragraph>
          </StackingLayout>
        </StackingLayout>

        {/* Action Button */}
        <FlexLayout
          alignItems="center"
          justifyContent="flex-end"
          style={{ width: '140px', flexShrink: 0 }}
        >
          {!isAcknowledged ? (
            <Button
              type={Button.ButtonTypes.SECONDARY}
              onClick={() => onAcknowledge(issue.id)}
            >
              Acknowledge
            </Button>
          ) : (
            <Button type={Button.ButtonTypes.SECONDARY} disabled>
              Acknowledged
            </Button>
          )}
        </FlexLayout>
      </FlexLayout>
    </ContainerLayout>
  );
};

// Filter Bar Component
interface FilterBarProps {
  searchQuery: string;
  activeSeverityTab: SeverityFilterType;
  onSearchChange: (query: string) => void;
  onSeverityTabChange: (severity: SeverityFilterType) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  activeSeverityTab,
  onSearchChange,
  onSeverityTabChange,
}) => (
  <FlexLayout
    alignItems="center"
    justifyContent="space-between"
    style={{ marginBottom: '20px' }}
  >
    {/* Severity Tabs */}
    <FlexLayout alignItems="center" itemGap="S">
      {SEVERITY_FILTER_TABS.map((tab) => (
        <Button
          key={tab.key}
          type={
            activeSeverityTab === tab.key
              ? Button.ButtonTypes.PRIMARY
              : Button.ButtonTypes.SECONDARY
          }
          onClick={() => onSeverityTabChange(tab.key as SeverityFilterType)}
          style={{
            borderRadius: '20px',
            padding: '6px 16px',
          }}
        >
          {tab.label}
        </Button>
      ))}
    </FlexLayout>

    {/* Search */}
    <FlexLayout alignItems="center" style={{ width: '300px' }}>
      <Input
        value={searchQuery}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onSearchChange(e.target.value)
        }
        placeholder="Search issues..."
        style={{ width: '100%' }}
      />
    </FlexLayout>
  </FlexLayout>
);

export default function SecurityIssues(): React.ReactElement {
  const { sessionId } = useParams<RouteParams>();
  const history = useHistory();

  // State
  const [issues, setIssues] = useState<SecurityIssue[]>(MOCK_SECURITY_ISSUES);
  const [severityFilter, setSeverityFilter] = useState<SeverityFilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Step 4 data
  const currentStep = 4;
  const currentStepData = CONNECTION_STEPS[currentStep - 1];

  // Calculate stats
  const stats = useMemo<SecurityStats>(() => {
    const acknowledgedCount = issues.filter(
      (i) => i.status === 'acknowledged'
    ).length;
    return {
      totalIssues: issues.length,
      criticalCount: issues.filter((i) => i.severity === 'critical').length,
      highCount: issues.filter((i) => i.severity === 'high').length,
      mediumCount: issues.filter((i) => i.severity === 'medium').length,
      lowCount: issues.filter((i) => i.severity === 'low').length,
      acknowledgedCount,
    };
  }, [issues]);

  // Filter issues
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      // Severity filter
      if (severityFilter !== 'all' && issue.severity !== severityFilter) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = issue.title.toLowerCase().includes(query);
        const matchesDescription = issue.description.toLowerCase().includes(query);
        const matchesResource = issue.affectedResource.name
          .toLowerCase()
          .includes(query);
        if (!matchesTitle && !matchesDescription && !matchesResource) {
          return false;
        }
      }

      return true;
    });
  }, [issues, severityFilter, searchQuery]);

  // Handlers
  const handleAcknowledge = useCallback((id: string) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === id
          ? { ...issue, status: 'acknowledged' as SecurityIssueStatus }
          : issue
      )
    );
  }, []);

  const handleNext = useCallback(() => {
    // Navigate to IaC Generation Preview (step 5)
    history.push(`/preview/${sessionId}`);
  }, [sessionId, history]);

  const handleBack = useCallback(() => {
    // Navigate back to Translation Workspace (step 3)
    history.push(`/translation/${sessionId}`);
  }, [sessionId, history]);

  return (
    <FlexLayout
      flexDirection="column"
      style={{ minHeight: '100vh', width: '100%', paddingBottom: `${STEP_FOOTER_HEIGHT}px` }}
    >
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
              <StatsOverview stats={stats} />

              {/* Security Issues Section */}
              <StackingLayout itemGap="M">
                <Title size={Title.TitleSizes.H3}>
                  Security Issues by Severity
                </Title>

                {/* Filter Bar */}
                <FilterBar
                  searchQuery={searchQuery}
                  activeSeverityTab={severityFilter}
                  onSearchChange={setSearchQuery}
                  onSeverityTabChange={setSeverityFilter}
                />

                {/* Security Issue Cards */}
                <StackingLayout itemGap="none">
                  {filteredIssues.length === 0 ? (
                    <ContainerLayout
                      border
                      padding="40px"
                      style={{ textAlign: 'center' }}
                    >
                      <TextLabel type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}>
                        No security issues found matching your filters.
                      </TextLabel>
                    </ContainerLayout>
                  ) : (
                    filteredIssues.map((issue) => (
                      <SecurityIssueCard
                        key={issue.id}
                        issue={issue}
                        onAcknowledge={handleAcknowledge}
                      />
                    ))
                  )}
                </StackingLayout>

                {/* Summary Footer */}
                <FlexLayout
                  justifyContent="space-between"
                  alignItems="center"
                  style={{ marginTop: '20px' }}
                >
                  {/* Acknowledged Count Card */}
                  <ContainerLayout
                    border
                    padding="15px"
                    style={{
                      background: 'var(--color-background-base)',
                      display: 'inline-block',
                    }}
                  >
                    <FlexLayout alignItems="center" itemGap="M">
                      <TextLabel type={TextLabel.TEXT_LABEL_TYPE.PRIMARY}>
                        Acknowledged Issues
                      </TextLabel>
                      <Title size={Title.TitleSizes.H3}>
                        {stats.acknowledgedCount} of {stats.totalIssues}
                      </Title>
                    </FlexLayout>
                  </ContainerLayout>

                  {/* Review & Deploy Button */}
                  <Button
                    type={Button.ButtonTypes.PRIMARY}
                    onClick={handleNext}
                  >
                    <FlexLayout alignItems="center" itemGap="XS" padding="0px-10px">
                      Review & Deploy
                      <ChevronRightIcon />
                    </FlexLayout>
                  </Button>
                </FlexLayout>
              </StackingLayout>
            </StackingLayout>
          </ContainerLayout>
        </StackingLayout>
      </ContainerLayout>

      {/* Need Help Box - fixed at bottom right */}
      <NeedHelpBox />

      {/* Step Footer */}
      <StepFooter
        currentStep={currentStep}
        totalSteps={CONNECTION_STEPS.length}
        nextLabel="Review & Deploy"
        onNext={handleNext}
        onBack={handleBack}
      />
    </FlexLayout>
  );
}
