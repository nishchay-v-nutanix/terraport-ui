import React from 'react';
import {
  FlexLayout,
  TextLabel,
  StatusDotMiniIcon,
  ErrorSquareIcon,
  WarningStatusIcon,
} from '@nutanix-ui/prism-reactjs';
import { EditorStatus } from '../../types';
import { StatusBarContainer } from '../../styles';

interface StatusBarProps {
  status: EditorStatus;
}

export default function StatusBar({
  status,
}: StatusBarProps): React.ReactElement {
  return (
    <StatusBarContainer>
      {/* Left side: Status indicators */}
      <FlexLayout alignItems="center" itemGap="M">
        <FlexLayout alignItems="center" itemGap="XS">
          <StatusDotMiniIcon
            style={{
              width: '12px',
              height: '12px',
              color: status.ready
                ? 'var(--color-text-success)'
                : 'var(--color-text-error)',
            }}
          />
          <TextLabel
            size={TextLabel.TEXT_LABEL_SIZE.SMALL}
            style={{ color: 'var(--color-text-inverse)' }}
          >
            {status.ready ? 'Ready' : 'Error'}
          </TextLabel>
        </FlexLayout>

        <FlexLayout alignItems="center" itemGap="XS">
          <ErrorSquareIcon
            style={{
              width: '12px',
              height: '12px',
              color:
                status.errors > 0
                  ? 'var(--color-text-error)'
                  : 'var(--color-text-tertiary-paragraph)',
            }}
          />
          <TextLabel
            size={TextLabel.TEXT_LABEL_SIZE.SMALL}
            style={{ color: 'var(--color-text-inverse)' }}
          >
            {status.errors} Errors
          </TextLabel>
        </FlexLayout>

        <FlexLayout alignItems="center" itemGap="XS">
          <WarningStatusIcon
            style={{
              width: '12px',
              height: '12px',
              color:
                status.warnings > 0
                  ? 'var(--color-text-warning)'
                  : 'var(--color-text-tertiary-paragraph)',
            }}
          />
          <TextLabel
            size={TextLabel.TEXT_LABEL_SIZE.SMALL}
            style={{ color: 'var(--color-text-inverse)' }}
          >
            {status.warnings} Warnings
          </TextLabel>
        </FlexLayout>
      </FlexLayout>

      {/* Right side: Editor info */}
      <FlexLayout alignItems="center" itemGap="M">
        <TextLabel
          size={TextLabel.TEXT_LABEL_SIZE.SMALL}
          style={{ color: 'var(--color-text-inverse)' }}
        >
          Ln {status.line}, Col {status.column}
        </TextLabel>
        <TextLabel
          size={TextLabel.TEXT_LABEL_SIZE.SMALL}
          style={{ color: 'var(--color-text-inverse)' }}
        >
          {status.encoding}
        </TextLabel>
        <TextLabel
          size={TextLabel.TEXT_LABEL_SIZE.SMALL}
          style={{ color: 'var(--color-text-inverse)' }}
        >
          {status.language}
        </TextLabel>
      </FlexLayout>
    </StatusBarContainer>
  );
}
