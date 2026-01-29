import React from 'react';
import { EC2Mapping as EC2MappingType } from '../../types';
import ResourceMappingCard from '../ResourceMappingCard';
import SourcePanel from '../ResourceMappingCard/SourcePanel';
import TargetPanel from '../ResourceMappingCard/TargetPanel';

interface EC2MappingProps {
  mapping: EC2MappingType;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onEdit?: (id: string) => void;
}

export default function EC2Mapping({
  mapping,
  onApprove,
  onReject,
  onEdit,
}: EC2MappingProps): React.ReactElement {
  const { source, target, confidence, status, id } = mapping;

  // Build source config lines
  const sourceConfigLines = [
    `instance_type: "${source.instanceType}"`,
    `vCPU: ${source.vCPU}, RAM: ${source.memory}`,
    `EBS: "${source.ebsVolumes.join(', ')}"`,
  ];

  // Build target config lines
  const targetConfigLines = target
    ? [
        `sockets: ${target.sockets}, cores: ${target.coresPerSocket}`,
        `RAM: ${target.memory}`,
      ]
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
          resourceType="ec2"
          resourceId={source.id}
          resourceName={source.tags.Name || source.name}
          region={source.region}
          configLines={sourceConfigLines}
        />
      }
      targetPanel={
        <TargetPanel
          hasMatch={!!target}
          resourceType="vm"
          resourceName={target?.name}
          location={target ? `Cluster: ${target.cluster}` : undefined}
          configLines={targetConfigLines}
        />
      }
    />
  );
}
