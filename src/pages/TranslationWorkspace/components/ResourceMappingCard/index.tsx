import React from 'react';
import {
  FlexLayout,
  ContainerLayout,
  Button,
  ChevronRightIcon,
  CrossCircleIcon,
  TickCircleIcon,
  CloseIcon,
  EditIcon,
} from '@nutanix-ui/prism-reactjs';
import { TranslationStatus } from '../../types';
import ConfidenceIndicator from './ConfidenceIndicator';
import { ConfidenceLevel } from '../../types';

interface ResourceMappingCardProps {
  id: string;
  hasMatch: boolean;
  confidence: ConfidenceLevel;
  status: TranslationStatus;
  sourcePanel: React.ReactNode;
  targetPanel: React.ReactNode;
  onApprove?: () => void;
  onReject?: () => void;
  onEdit?: () => void;
}

const getStatusBackground = (status: TranslationStatus): string | undefined => {
  switch (status) {
    case 'approved':
      return 'var(--color-background-success-light)';
    case 'rejected':
      return 'var(--color-background-error-light)';
    case 'modified':
      return 'var(--color-background-warning-light)';
    default:
      return undefined;
  }
};

export default function ResourceMappingCard({
  id,
  hasMatch,
  confidence,
  status,
  sourcePanel,
  targetPanel,
  onApprove,
  onReject,
  onEdit,
}: ResourceMappingCardProps): React.ReactElement {
  return (
    <ContainerLayout
      border
      padding="20px"
      style={{
        marginBottom: '12px',
        backgroundColor: getStatusBackground(status),
      }}
      data-mapping-id={id}
      role="article"
      aria-label={`Resource mapping ${id}`}
    >
      <FlexLayout alignItems="stretch" itemGap="L">
        {/* Source Panel (AWS) */}
        {sourcePanel}

        {/* Translation Arrow */}
        <FlexLayout
          alignItems="center"
          justifyContent="center"
          style={{ width: '60px', flexShrink: 0 }}
        >
          {hasMatch ? (
            <ChevronRightIcon
              style={{
                width: '24px',
                height: '24px',
                color: 'var(--color-text-link)',
              }}
            />
          ) : (
            <CrossCircleIcon
              style={{
                width: '24px',
                height: '24px',
                color: 'var(--color-text-error)',
              }}
            />
          )}
        </FlexLayout>

        {/* Target Panel (Nutanix) */}
        {targetPanel}

        {/* Confidence + Actions */}
        <FlexLayout
          alignItems="center"
          justifyContent="flex-end"
          itemGap="S"
          style={{ width: '160px', flexShrink: 0 }}
        >
          <ConfidenceIndicator confidence={confidence} />

          <FlexLayout itemGap="XS">
            {status !== 'approved' && onApprove && (
              <Button
                type={Button.ButtonTypes.PRIMARY}
                aria-label={`Approve mapping ${id}`}
                onClick={onApprove}
                style={{ padding: '6px 10px', minWidth: 'auto' }}
              >
                <TickCircleIcon style={{ width: '16px', height: '16px' }} />
              </Button>
            )}
            {status !== 'rejected' && onReject && (
              <Button
                type={Button.ButtonTypes.SECONDARY}
                aria-label={`Reject mapping ${id}`}
                onClick={onReject}
                style={{ padding: '6px 10px', minWidth: 'auto' }}
              >
                <CloseIcon style={{ width: '16px', height: '16px' }} />
              </Button>
            )}
            {onEdit && (
              <Button
                type={Button.ButtonTypes.SECONDARY}
                aria-label={`Edit mapping ${id}`}
                onClick={onEdit}
                style={{ padding: '6px 10px', minWidth: 'auto' }}
              >
                <EditIcon style={{ width: '16px', height: '16px' }} />
              </Button>
            )}
          </FlexLayout>
        </FlexLayout>
      </FlexLayout>
    </ContainerLayout>
  );
}
