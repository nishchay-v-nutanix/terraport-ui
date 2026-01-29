import React from 'react';
import { FlexLayout } from '@nutanix-ui/prism-reactjs';
import { TerraformFile, EditorTab, EditorStatus } from '../../types';
import { EditorContainer } from '../../styles';
import TabBar from './TabBar';
import EditorToolbar from './EditorToolbar';
import StatusBar from './StatusBar';
import MonacoEditorWrapper from '../MonacoEditor';

interface EditorPanelProps {
  activeFile: TerraformFile | null;
  tabs: EditorTab[];
  status: EditorStatus;
  isFullscreen: boolean;
  onTabClick: (_fileId: string) => void;
  onCloseTab: (_fileId: string) => void;
  onCopy: () => void;
  onDownload: () => void;
  onFullscreenToggle: () => void;
  onCursorPositionChange: (_line: number, _column: number) => void;
}

export default function EditorPanel({
  activeFile,
  tabs,
  status,
  isFullscreen,
  onTabClick,
  onCloseTab,
  onCopy,
  onDownload,
  onFullscreenToggle,
  onCursorPositionChange,
}: EditorPanelProps): React.ReactElement {
  return (
    <EditorContainer $isFullscreen={isFullscreen}>
      {/* Tab Bar + Toolbar Row */}
      <FlexLayout
        alignItems="center"
        style={{
          borderBottom: '1px solid var(--color-border-separator)',
          backgroundColor: 'var(--color-background-base)',
        }}
      >
        <TabBar tabs={tabs} onTabClick={onTabClick} onCloseTab={onCloseTab} />
        <EditorToolbar
          isFullscreen={isFullscreen}
          onCopy={onCopy}
          onDownload={onDownload}
          onFullscreenToggle={onFullscreenToggle}
        />
      </FlexLayout>

      {/* Monaco Editor */}
      {activeFile ? (
        <MonacoEditorWrapper
          content={activeFile.content}
          onCursorPositionChange={onCursorPositionChange}
        />
      ) : (
        <FlexLayout
          alignItems="center"
          justifyContent="center"
          style={{ flex: 1, backgroundColor: '#1e1e1e' }}
        >
          <span style={{ color: 'var(--color-text-tertiary-paragraph)' }}>
            Select a file from the explorer to view
          </span>
        </FlexLayout>
      )}

      {/* Status Bar */}
      <StatusBar status={status} />
    </EditorContainer>
  );
}
