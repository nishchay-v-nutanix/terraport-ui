import React from 'react';
import { Badge, FlexLayout } from '@nutanix-ui/prism-reactjs';
import { ConfidenceLevel } from '../../types';

interface ConfidenceIndicatorProps {
  confidence: ConfidenceLevel;
}

const getConfidenceConfig = (
  confidence: ConfidenceLevel
): { color: typeof Badge.BadgeColorTypes[keyof typeof Badge.BadgeColorTypes]; label: string } => {
  switch (confidence) {
    case 'high':
      return { color: Badge.BadgeColorTypes.GREEN, label: 'High' };
    case 'medium':
      return { color: Badge.BadgeColorTypes.YELLOW, label: 'Medium' };
    case 'low':
      return { color: Badge.BadgeColorTypes.RED, label: 'Low' };
    case 'manual':
      return { color: Badge.BadgeColorTypes.GRAY, label: 'Manual' };
    default:
      return { color: Badge.BadgeColorTypes.GRAY, label: 'Unknown' };
  }
};

export default function ConfidenceIndicator({
  confidence,
}: ConfidenceIndicatorProps): React.ReactElement {
  const config = getConfidenceConfig(confidence);

  return (
    <FlexLayout alignItems="center" justifyContent="flex-end">
      <Badge
        color={config.color}
        count={config.label}
        type={Badge.BadgeTypes.TAG}
      />
    </FlexLayout>
  );
}
