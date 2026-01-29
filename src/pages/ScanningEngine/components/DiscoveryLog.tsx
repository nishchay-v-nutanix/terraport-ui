import React, { useEffect, useRef } from 'react';
import {
  FlexLayout,
  StackingLayout,
  Title,
  TextLabel,
  ContainerLayout,
  PlayIcon,
} from '@nutanix-ui/prism-reactjs';
import { LogEntry as LogEntryType } from '../types';

interface DiscoveryLogProps {
  entries: LogEntryType[];
  isLive: boolean;
}

const getTypeColor = (type: LogEntryType['type']): string => {
  switch (type) {
    case 'INFO':
      return 'var(--color-text-secondary-label)';
    case 'SUCCESS':
      return 'var(--color-text-success)';
    case 'WARN':
      return 'var(--color-text-warning)';
    case 'SCAN':
      return 'var(--color-text-link)';
    case 'MAPPED':
      return 'var(--color-text-success)';
    case 'CURRENT':
      return 'var(--color-text-link)';
    default:
      return 'var(--color-text-primary-label)';
  }
};

interface LogEntryRowProps {
  entry: LogEntryType;
}

function LogEntryRow({ entry }: LogEntryRowProps): React.ReactElement {
  const { timestamp, type, message } = entry;
  const isCurrent = type === 'CURRENT';

  return (
    <FlexLayout
      alignItems="flex-start"
      itemGap="S"
      style={
        isCurrent
          ? {
              borderLeft: '2px solid var(--color-text-link)',
              paddingLeft: '8px',
            }
          : undefined
      }
    >
      <TextLabel
        type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}
        size={TextLabel.TEXT_LABEL_SIZE.SMALL}
        style={{
          fontFamily: 'var(--font-family-monospace)',
          whiteSpace: 'nowrap',
        }}
      >
        [{timestamp}]
      </TextLabel>
      <TextLabel
        size={TextLabel.TEXT_LABEL_SIZE.SMALL}
        style={{
          color: getTypeColor(type),
          fontFamily: 'var(--font-family-monospace)',
          fontWeight: 600,
          minWidth: '60px',
        }}
      >
        {type === 'CURRENT' ? 'Current' : type}
      </TextLabel>
      <TextLabel
        type={TextLabel.TEXT_LABEL_TYPE.PRIMARY}
        size={TextLabel.TEXT_LABEL_SIZE.SMALL}
        style={{ fontFamily: 'var(--font-family-monospace)' }}
      >
        {message}
      </TextLabel>
    </FlexLayout>
  );
}

export default function DiscoveryLog({
  entries,
  isLive,
}: DiscoveryLogProps): React.ReactElement {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new entries are added
  useEffect(() => {
    if (scrollContainerRef.current && isLive) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [entries, isLive]);

  return (
    <ContainerLayout
      border
      padding="20px"
      style={{
        backgroundColor: 'var(--color-background-secondary)',
        maxHeight: '400px',
        overflow: 'hidden',
      }}
    >
      <StackingLayout itemGap="M">
        {/* Header */}
        <FlexLayout justifyContent="space-between" alignItems="center">
          <FlexLayout alignItems="center" itemGap="S">
            <PlayIcon color="var(--color-text-secondary-label)" />
            <Title size={Title.TitleSizes.H3}>Discovery Log</Title>
          </FlexLayout>
          <FlexLayout alignItems="center" itemGap="XS">
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: isLive
                  ? 'var(--color-text-success)'
                  : 'var(--color-text-secondary-label)',
                animation: isLive ? 'pulse 1.5s infinite' : 'none',
              }}
            />
            <TextLabel
              type={
                isLive
                  ? TextLabel.TEXT_LABEL_TYPE.SUCCESS
                  : TextLabel.TEXT_LABEL_TYPE.SECONDARY
              }
            >
              {isLive ? 'Live' : 'Paused'}
            </TextLabel>
          </FlexLayout>
        </FlexLayout>

        {/* Scrollable Log Container */}
        <div
          ref={scrollContainerRef}
          style={{
            maxHeight: '320px',
            overflowY: 'auto',
            fontFamily: 'var(--font-family-monospace)',
          }}
        >
          <StackingLayout itemGap="S">
            {entries.map((entry) => (
              <LogEntryRow key={entry.id} entry={entry} />
            ))}
          </StackingLayout>
        </div>

        {/* Terminal prompt */}
        {isLive && (
          <FlexLayout alignItems="center" itemGap="XS">
            <TextLabel type={TextLabel.TEXT_LABEL_TYPE.PRIMARY}>&gt;</TextLabel>
            <div
              style={{
                width: '8px',
                height: '16px',
                backgroundColor: 'var(--color-text-link)',
                animation: 'blink 1s step-end infinite',
              }}
            />
          </FlexLayout>
        )}
      </StackingLayout>

      {/* Keyframe animations for pulse and blink */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}
      </style>
    </ContainerLayout>
  );
}
