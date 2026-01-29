import React from 'react';
import { VPCMapping as VPCMappingType } from '../../types';
import ResourceMappingCard from '../ResourceMappingCard';
import SourcePanel from '../ResourceMappingCard/SourcePanel';
import TargetPanel from '../ResourceMappingCard/TargetPanel';

interface VPCMappingProps {
  mapping: VPCMappingType;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onEdit?: (id: string) => void;
}

export default function VPCMapping({
  mapping,
  onApprove,
  onReject,
  onEdit,
}: VPCMappingProps): React.ReactElement {
  const { source, target, confidence, status, id } = mapping;

  // Build source config lines
  const sourceConfigLines = [
    `cidr_block: "${source.cidrBlock}"`,
    `tags: { ${Object.entries(source.tags)
      .map(([k, v]) => `${k}: "${v}"`)
      .join(', ')} }`,
  ];

  // Build target config lines
  const targetConfigLines = target
    ? [
        `subnet_type: "${target.subnetType}"`,
        `ip_prefix: "${target.ipPrefix}"`,
        target.vlanId ? `vlan_id: ${target.vlanId}` : null,
      ].filter(Boolean) as string[]
    : [];

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
          resourceType="vpc"
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
        />
      }
    />
  );
}
