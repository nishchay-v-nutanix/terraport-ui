import React from 'react';
import { StackingLayout, TextLabel, Select } from '@nutanix-ui/prism-reactjs';
import { SubnetMapping as SubnetMappingType } from '../../types';
import ResourceMappingCard from '../ResourceMappingCard';
import SourcePanel from '../ResourceMappingCard/SourcePanel';
import TargetPanel from '../ResourceMappingCard/TargetPanel';
import { AVAILABLE_VLANS } from '../../constants';

interface SubnetMappingProps {
  mapping: SubnetMappingType;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onEdit?: (id: string) => void;
  onVLANSelect?: (id: string, vlanKey: string) => void;
}

export default function SubnetMapping({
  mapping,
  onApprove,
  onReject,
  onEdit,
  onVLANSelect,
}: SubnetMappingProps): React.ReactElement {
  const { source, target, confidence, status, id } = mapping;

  // Build source config lines
  const sourceConfigLines = [
    `cidr: "${source.cidr}"`,
    `availability_zone: "${source.availabilityZone}"`,
    `type: "${source.isPublic ? 'Public' : 'Private'} Subnet"`,
  ];

  // Build target config lines
  const targetConfigLines = target
    ? [
        `subnet_type: "${target.subnetType}"`,
        `ip_prefix: "${target.ipPrefix}"`,
      ]
    : [];

  // Get selected VLAN for dropdown (for no-match case)
  const selectedVLAN = target
    ? AVAILABLE_VLANS.find((v) => v.label.includes(target.name)) || undefined
    : undefined;

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
          resourceType="subnet"
          resourceId={source.id}
          resourceName={source.name}
          region={source.region}
          configLines={sourceConfigLines}
        />
      }
      targetPanel={
        <TargetPanel
          hasMatch={!!target}
          resourceType="vlan"
          resourceName={target?.name}
          location={target ? `Prism Central: ${target.prismCentral}` : undefined}
          configLines={targetConfigLines}
          noMatchMessage="Please select a target VLAN manually"
        >
          {!target && (
            <StackingLayout itemGap="XS" style={{ marginTop: '10px' }}>
              <TextLabel
                type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}
                size={TextLabel.TEXT_LABEL_SIZE.SMALL}
                style={{ textTransform: 'uppercase' }}
              >
                SELECT TARGET VLAN
              </TextLabel>
              <Select
                rowsData={AVAILABLE_VLANS}
                selectedRow={selectedVLAN}
                onSelectedChange={(selected) => {
                  if (onVLANSelect && selected && selected.key) {
                    onVLANSelect(id, String(selected.key));
                  }
                }}
                placeholder="Select Target VLAN..."
              />
            </StackingLayout>
          )}
        </TargetPanel>
      }
    />
  );
}
