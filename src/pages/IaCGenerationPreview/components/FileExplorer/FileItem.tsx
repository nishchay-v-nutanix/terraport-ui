import React from 'react';
import { TextLabel, CodeIcon } from '@nutanix-ui/prism-reactjs';
import { TerraformFile } from '../../types';
import { FILE_ICON_COLORS } from '../../constants';
import { FileItemContainer } from '../../styles';

interface FileItemProps {
  file: TerraformFile;
  isActive: boolean;
  onClick: () => void;
}

export default function FileItem({
  file,
  isActive,
  onClick,
}: FileItemProps): React.ReactElement {
  const iconColor = FILE_ICON_COLORS[file.type] || 'var(--color-text-primary)';

  return (
    <FileItemContainer
      $isActive={isActive}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-pressed={isActive}
    >
      <CodeIcon
        style={{
          width: '16px',
          height: '16px',
          color: iconColor,
          flexShrink: 0,
        }}
      />
      <TextLabel
        type={TextLabel.TEXT_LABEL_TYPE.PRIMARY}
        style={{ color: 'var(--color-text-inverse)' }}
      >
        {file.name}
      </TextLabel>
    </FileItemContainer>
  );
}
