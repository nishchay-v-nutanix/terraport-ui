import React from 'react';
import {
  FlexLayout,
  StackingLayout,
  TextLabel,
  Select,
  Badge,
} from '@nutanix-ui/prism-reactjs';
import { SecurityGroupMapping as SGMappingType } from '../../types';
import ResourceMappingCard from '../ResourceMappingCard';
import SourcePanel from '../ResourceMappingCard/SourcePanel';
import TargetPanel from '../ResourceMappingCard/TargetPanel';
import { CATEGORY_OPTIONS, ACTION_OPTIONS } from '../../constants';

interface SecurityGroupMappingProps {
  mapping: SGMappingType;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onEdit?: (id: string) => void;
  onCategoryChange?: (id: string, category: string) => void;
  onActionChange?: (id: string, action: string) => void;
}

export default function SecurityGroupMapping({
  mapping,
  onApprove,
  onReject,
  onEdit,
  onCategoryChange,
  onActionChange,
}: SecurityGroupMappingProps): React.ReactElement {
  const { source, target, confidence, status, id } = mapping;

  // Build source config lines from rules
  const sourceConfigLines = [
    `description: "${source.description}"`,
    ...source.inboundRules.slice(0, 2).map(
      (rule) =>
        `inbound: ${rule.protocol}:${rule.port} from ${rule.source}`
    ),
    source.inboundRules.length > 2
      ? `... +${source.inboundRules.length - 2} more rules`
      : null,
  ].filter(Boolean) as string[];

  // Get selected category and action for dropdowns
  const selectedCategory = target?.appCategory
    ? CATEGORY_OPTIONS.find(
        (opt) =>
          opt.label.includes(target.appCategory.value)
      ) || CATEGORY_OPTIONS[0]
    : CATEGORY_OPTIONS[0];

  const selectedAction = target?.action
    ? ACTION_OPTIONS.find(
        (opt) => opt.label === target.action
      ) || ACTION_OPTIONS[0]
    : ACTION_OPTIONS[0];

  return (
    <ResourceMappingCard
      id={id}
      hasMatch={!!target}
      confidence={confidence}
      status={status}
      onApprove={() => onApprove(id)}
      onReject={() => onReject(id)}
      onEdit={onEdit ? () => onEdit(id) : undefined}
      sourcePanel={
        <SourcePanel
          resourceType="security_group"
          resourceId={source.id}
          resourceName={source.name}
          region={source.region}
          configLines={sourceConfigLines}
        />
      }
      targetPanel={
        <TargetPanel
          hasMatch={!!target}
          resourceType="security_policy"
          resourceName={target?.name}
          location={
            target?.verificationRequired ? (
              <FlexLayout alignItems="center" itemGap="XS">
                <Badge
                  color={Badge.BadgeColorTypes.YELLOW}
                  count="Verify"
                  type={Badge.BadgeTypes.TAG}
                />
                <TextLabel type={TextLabel.TEXT_LABEL_TYPE.WARNING}>
                  Verify Application Category
                </TextLabel>
              </FlexLayout>
            ) : undefined
          }
        >
          {target && (
            <FlexLayout itemGap="L" style={{ marginTop: '10px' }}>
              <StackingLayout itemGap="XS" style={{ flex: 1 }}>
                <TextLabel
                  type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}
                  size={TextLabel.TEXT_LABEL_SIZE.SMALL}
                  style={{ textTransform: 'uppercase' }}
                >
                  CATEGORY
                </TextLabel>
                <Select
                  rowsData={CATEGORY_OPTIONS}
                  selectedRow={selectedCategory}
                  onSelectedChange={(selected) => {
                    if (onCategoryChange && selected && selected.key) {
                      onCategoryChange(id, String(selected.key));
                    }
                  }}
                  placeholder="Select category"
                />
              </StackingLayout>
              <StackingLayout itemGap="XS" style={{ flex: 1 }}>
                <TextLabel
                  type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}
                  size={TextLabel.TEXT_LABEL_SIZE.SMALL}
                  style={{ textTransform: 'uppercase' }}
                >
                  ACTION
                </TextLabel>
                <Select
                  rowsData={ACTION_OPTIONS}
                  selectedRow={selectedAction}
                  onSelectedChange={(selected) => {
                    if (onActionChange && selected && selected.key) {
                      onActionChange(id, String(selected.key));
                    }
                  }}
                  placeholder="Select action"
                />
              </StackingLayout>
            </FlexLayout>
          )}
        </TargetPanel>
      }
    />
  );
}
