import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Button,
  FlexLayout,
  StackingLayout,
  Title,
  TextLabel,
  Progress,
  ContainerLayout,
  Badge,
  PauseIcon,
  CloseIcon,
  PlayIcon,
  SuccessStatusIcon,
  AlertTriangleIcon,
  RefreshIcon,
} from '@nutanix-ui/prism-reactjs';

import StatsCard from './components/StatsCard';
import DiscoveryLog from './components/DiscoveryLog';
import { ScanSession, ScanStats, ScanProgress, LogEntry } from './types';

// Initial mock data
const initialSession: ScanSession = {
  id: 'SCAN-2024-01',
  region: 'us-east-1',
  status: 'active',
  startTime: new Date(),
};

const initialStats: ScanStats = {
  totalResources: 0,
  totalResourcesChange: 0,
  mappableResources: 0,
  mappableResourcesChange: 0,
  unsupportedFlags: 0,
  unsupportedFlagsChange: 0,
};

const initialProgress: ScanProgress = {
  percent: 0,
  currentItem: 'Initializing scan...',
  estimatedRemaining: 'Calculating...',
};

// Mock log messages for simulation
const mockLogMessages = [
  { type: 'INFO' as const, message: 'Initializing AWS SDK connection...' },
  { type: 'SUCCESS' as const, message: 'Successfully authenticated with AWS' },
  { type: 'SCAN' as const, message: 'Starting VPC discovery...' },
  { type: 'MAPPED' as const, message: 'Found VPC: vpc-0a1b2c3d4e (10.0.0.0/16)' },
  { type: 'SCAN' as const, message: 'Scanning subnets in vpc-0a1b2c3d4e...' },
  { type: 'MAPPED' as const, message: 'Found subnet: subnet-0a1b2 (us-east-1a)' },
  { type: 'MAPPED' as const, message: 'Found subnet: subnet-0c3d4 (us-east-1b)' },
  { type: 'SCAN' as const, message: 'Discovering EC2 instances...' },
  { type: 'MAPPED' as const, message: 'Found EC2: i-0abc123def (t3.medium)' },
  { type: 'MAPPED' as const, message: 'Found EC2: i-0def456ghi (t3.large)' },
  { type: 'WARN' as const, message: 'Instance i-0jkl789mno uses unsupported launch template' },
  { type: 'SCAN' as const, message: 'Scanning RDS instances...' },
  { type: 'MAPPED' as const, message: 'Found RDS: mydb-primary (mysql 8.0)' },
  { type: 'SCAN' as const, message: 'Discovering S3 buckets...' },
  { type: 'MAPPED' as const, message: 'Found S3: my-app-assets' },
  { type: 'MAPPED' as const, message: 'Found S3: my-app-logs' },
  { type: 'SCAN' as const, message: 'Scanning Lambda functions...' },
  { type: 'MAPPED' as const, message: 'Found Lambda: process-orders' },
  { type: 'MAPPED' as const, message: 'Found Lambda: send-notifications' },
  { type: 'SCAN' as const, message: 'Discovering IAM roles...' },
  { type: 'WARN' as const, message: 'IAM role admin-access has inline policies (unsupported)' },
  { type: 'MAPPED' as const, message: 'Found IAM Role: lambda-execution-role' },
  { type: 'SCAN' as const, message: 'Scanning security groups...' },
  { type: 'MAPPED' as const, message: 'Found SG: sg-web-tier (allow 80, 443)' },
  { type: 'MAPPED' as const, message: 'Found SG: sg-db-tier (allow 3306)' },
  { type: 'SUCCESS' as const, message: 'Scan completed successfully!' },
];

export default function ScanningEngine(): React.ReactElement {
  const { scanId } = useParams<{ scanId: string }>();
  const history = useHistory();

  const [scanSession, setScanSession] = useState<ScanSession>({
    ...initialSession,
    id: scanId || initialSession.id,
  });
  const [stats, setStats] = useState<ScanStats>(initialStats);
  const [progress, setProgress] = useState<ScanProgress>(initialProgress);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [logIndex, setLogIndex] = useState(0);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Simulation effect
  useEffect(() => {
    if (isPaused || logIndex >= mockLogMessages.length) return;

    const interval = setInterval(() => {
      const currentMessage = mockLogMessages[logIndex];
      const newEntry: LogEntry = {
        id: `log-${logIndex}`,
        timestamp: formatTime(new Date()),
        type: logIndex === mockLogMessages.length - 1 ? 'CURRENT' : currentMessage.type,
        message: currentMessage.message,
      };

      setLogEntries((prev) => [...prev, newEntry]);
      setLogIndex((prev) => prev + 1);

      // Update progress
      const newPercent = Math.min(
        Math.round(((logIndex + 1) / mockLogMessages.length) * 100),
        100
      );
      setProgress({
        percent: newPercent,
        currentItem:
          logIndex < mockLogMessages.length - 1
            ? mockLogMessages[logIndex + 1]?.message || 'Processing...'
            : 'Scan complete',
        estimatedRemaining:
          newPercent >= 100
            ? 'Complete'
            : `~${Math.max(1, Math.round((mockLogMessages.length - logIndex) * 0.8))}s remaining`,
      });

      // Update stats based on log type
      if (currentMessage.type === 'MAPPED') {
        setStats((prev) => ({
          ...prev,
          totalResources: prev.totalResources + 1,
          totalResourcesChange: Math.round(Math.random() * 10) + 5,
          mappableResources: prev.mappableResources + 1,
          mappableResourcesChange: Math.round(Math.random() * 10) + 3,
        }));
      } else if (currentMessage.type === 'WARN') {
        setStats((prev) => ({
          ...prev,
          totalResources: prev.totalResources + 1,
          totalResourcesChange: Math.round(Math.random() * 10) + 5,
          unsupportedFlags: prev.unsupportedFlags + 1,
          unsupportedFlagsChange: Math.round(Math.random() * 5) + 2,
        }));
      }

      // Mark scan as complete
      if (logIndex >= mockLogMessages.length - 1) {
        setScanSession((prev) => ({ ...prev, status: 'completed' }));
      }
    }, 800);

    return () => clearInterval(interval);
  }, [isPaused, logIndex]);

  const handlePause = useCallback(() => {
    setIsPaused(true);
    setScanSession((prev) => ({ ...prev, status: 'paused' }));
  }, []);

  const handleResume = useCallback(() => {
    setIsPaused(false);
    setScanSession((prev) => ({ ...prev, status: 'active' }));
  }, []);

  const handleAbort = useCallback(() => {
    setScanSession((prev) => ({ ...prev, status: 'aborted' }));
    history.push('/connect-aws');
  }, [history]);

  const isActive = scanSession.status === 'active';
  const isCompleted = scanSession.status === 'completed';

  const renderHeader = () => (
    <FlexLayout justifyContent="space-between" alignItems="center">
      <FlexLayout alignItems="center" itemGap="M">
        <StackingLayout itemGap="XS">
          <FlexLayout alignItems="center" itemGap="M">
            <Title size={Title.TitleSizes.H1}>
              Scanning Engine: AWS {scanSession.region}
            </Title>
            <Badge
              color={
                isActive
                  ? Badge.BadgeColorTypes.GREEN
                  : isCompleted
                  ? Badge.BadgeColorTypes.BLUE
                  : Badge.BadgeColorTypes.YELLOW
              }
              count={
                isActive
                  ? 'Active Session'
                  : isCompleted
                  ? 'Completed'
                  : 'Paused'
              }
              type={Badge.BadgeTypes.TAG}
            />
          </FlexLayout>
          <TextLabel type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}>
            ID: #{scanSession.id}
          </TextLabel>
        </StackingLayout>
      </FlexLayout>

      <FlexLayout alignItems="center" itemGap="S">
        {!isCompleted && (
          <>
            <Button
              type={Button.ButtonTypes.SECONDARY}
              onClick={isPaused ? handleResume : handlePause}
            >
              <FlexLayout alignItems="center" itemGap="XS">
                {isPaused ? <PlayIcon /> : <PauseIcon />}
                {isPaused ? 'Resume' : 'Pause'}
              </FlexLayout>
            </Button>
            <Button type={Button.ButtonTypes.DESTRUCTIVE} onClick={handleAbort}>
              <FlexLayout alignItems="center" itemGap="XS">
                <CloseIcon />
                Abort Scan
              </FlexLayout>
            </Button>
          </>
        )}
        {isCompleted && (
          <Button
            type={Button.ButtonTypes.PRIMARY}
            onClick={() => history.push(`/translation/${scanSession.id}`)}
          >
            View Results
          </Button>
        )}
      </FlexLayout>
    </FlexLayout>
  );

  const renderStatsCards = () => (
    <FlexLayout itemGap="L">
      <StatsCard
        title="Total Resources"
        value={stats.totalResources}
        changePercent={stats.totalResourcesChange}
        changeDirection="up"
        description="Resources discovered across all services"
        statusColor="blue"
        icon={<RefreshIcon style={{ width: '24px', height: '24px' }} />}
      />
      <StatsCard
        title="Mappable Resources"
        value={stats.mappableResources}
        changePercent={stats.mappableResourcesChange}
        changeDirection="up"
        description="Ready for Terraform conversion"
        statusColor="green"
        icon={<SuccessStatusIcon style={{ width: '24px', height: '24px' }} />}
      />
      <StatsCard
        title="Unsupported Flags"
        value={stats.unsupportedFlags}
        changePercent={stats.unsupportedFlagsChange}
        changeDirection="up"
        description="Resources requiring manual review"
        statusColor="yellow"
        icon={<AlertTriangleIcon style={{ width: '24px', height: '24px' }} />}
      />
    </FlexLayout>
  );

  const renderProgressSection = () => (
    <ContainerLayout border padding="20px">
      <StackingLayout itemGap="S">
        {/* Header row */}
        <FlexLayout justifyContent="space-between" alignItems="center">
          <StackingLayout itemGap="XS">
            <Title size={Title.TitleSizes.H3}>Scan Progress</Title>
            <TextLabel type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}>
              {progress.currentItem}
            </TextLabel>
          </StackingLayout>
          <StackingLayout itemGap="XS" style={{ textAlign: 'right' }}>
            <Title size={Title.TitleSizes.H3}>{progress.percent}%</Title>
            <TextLabel type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}>
              Est. remaining: {progress.estimatedRemaining}
            </TextLabel>
          </StackingLayout>
        </FlexLayout>

        {/* Progress bar */}
        <Progress
          percent={progress.percent}
          status={
            isCompleted
              ? Progress.ProgressStatus.SUCCESS
              : Progress.ProgressStatus.ACTIVE
          }
          label={false}
        />
      </StackingLayout>
    </ContainerLayout>
  );

  return (
    <ContainerLayout padding="40px">
      <StackingLayout itemGap="L">
        {renderHeader()}
        {renderStatsCards()}
        {renderProgressSection()}
        <DiscoveryLog entries={logEntries} isLive={isActive} />
      </StackingLayout>
    </ContainerLayout>
  );
}
