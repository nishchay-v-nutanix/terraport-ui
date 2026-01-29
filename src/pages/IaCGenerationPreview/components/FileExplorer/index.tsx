import React from 'react';
import { StackingLayout, TextLabel } from '@nutanix-ui/prism-reactjs';
import { TerraformFile } from '../../types';
import { ExplorerContainer } from '../../styles';
import FileItem from './FileItem';

interface FileExplorerProps {
  files: TerraformFile[];
  activeFileId: string | null;
  onFileSelect: (_fileId: string) => void;
}

export default function FileExplorer({
  files,
  activeFileId,
  onFileSelect,
}: FileExplorerProps): React.ReactElement {
  return (
    <ExplorerContainer>
      <StackingLayout padding="15px" itemGap="M">
        <TextLabel
          type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}
          size={TextLabel.TEXT_LABEL_SIZE.SMALL}
          style={{
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: 'var(--color-text-tertiary-paragraph)',
          }}
        >
          EXPLORER
        </TextLabel>

        <StackingLayout itemGap="S" role="listbox" aria-label="File explorer">
          {files.map((file) => (
            <FileItem
              key={file.id}
              file={file}
              isActive={file.id === activeFileId}
              onClick={() => onFileSelect(file.id)}
            />
          ))}
        </StackingLayout>
      </StackingLayout>
    </ExplorerContainer>
  );
}
