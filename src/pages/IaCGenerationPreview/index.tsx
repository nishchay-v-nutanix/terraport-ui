import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  ContainerLayout,
  FlexLayout,
  StackingLayout,
  Title,
  Paragraph,
  Button,
  CloudIcon,
  Alert,
} from '@nutanix-ui/prism-reactjs';

import {
  EditorTab,
  IaCPreviewState,
  RouteParams,
} from './types';
import { MOCK_TERRAFORM_FILES, DEFAULT_EDITOR_STATUS } from './constants';
import { MainContentArea } from './styles';

// Components
import FileExplorer from './components/FileExplorer';
import EditorPanel from './components/EditorPanel';

export default function IaCGenerationPreview(): React.ReactElement {
  const { sessionId } = useParams<RouteParams>();

  // State
  const [state, setState] = useState<IaCPreviewState>(() => {
    const files = MOCK_TERRAFORM_FILES;
    const firstFile = files[0];

    return {
      files,
      openTabs: firstFile
        ? [
            {
              fileId: firstFile.id,
              fileName: firstFile.name,
              isActive: true,
            },
          ]
        : [],
      activeFileId: firstFile?.id || null,
      editorStatus: DEFAULT_EDITOR_STATUS,
      isExporting: false,
      isFullscreen: false,
    };
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Get active file
  const activeFile = useMemo(
    () => state.files.find((f) => f.id === state.activeFileId) || null,
    [state.files, state.activeFileId]
  );

  // Handle file selection
  const handleFileSelect = useCallback((fileId: string) => {
    setState((prev) => {
      const file = prev.files.find((f) => f.id === fileId);
      if (!file) return prev;

      // Check if tab already exists
      const existingTab = prev.openTabs.find((t) => t.fileId === fileId);

      let newTabs: EditorTab[];
      if (existingTab) {
        // Just activate the existing tab
        newTabs = prev.openTabs.map((t) => ({
          ...t,
          isActive: t.fileId === fileId,
        }));
      } else {
        // Add new tab and deactivate others
        newTabs = [
          ...prev.openTabs.map((t) => ({ ...t, isActive: false })),
          {
            fileId: file.id,
            fileName: file.name,
            isActive: true,
          },
        ];
      }

      return {
        ...prev,
        openTabs: newTabs,
        activeFileId: fileId,
        editorStatus: {
          ...prev.editorStatus,
          line: 1,
          column: 1,
        },
      };
    });
  }, []);

  // Handle tab click
  const handleTabClick = useCallback((fileId: string) => {
    setState((prev) => ({
      ...prev,
      openTabs: prev.openTabs.map((t) => ({
        ...t,
        isActive: t.fileId === fileId,
      })),
      activeFileId: fileId,
    }));
  }, []);

  // Handle close tab
  const handleCloseTab = useCallback((fileId: string) => {
    setState((prev) => {
      // Don't close the last tab
      if (prev.openTabs.length <= 1) return prev;

      const tabIndex = prev.openTabs.findIndex((t) => t.fileId === fileId);
      const closingActiveTab = prev.openTabs[tabIndex]?.isActive;

      const newTabs = prev.openTabs.filter((t) => t.fileId !== fileId);

      // If closing active tab, activate the previous or next tab
      if (closingActiveTab && newTabs.length > 0) {
        const newActiveIndex = Math.min(tabIndex, newTabs.length - 1);
        newTabs[newActiveIndex].isActive = true;
        return {
          ...prev,
          openTabs: newTabs,
          activeFileId: newTabs[newActiveIndex].fileId,
        };
      }

      return {
        ...prev,
        openTabs: newTabs,
      };
    });
  }, []);

  // Handle copy to clipboard
  const handleCopy = useCallback(async () => {
    if (!activeFile) return;

    try {
      await navigator.clipboard.writeText(activeFile.content);
      setSuccessMessage(`Copied ${activeFile.name} to clipboard`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [activeFile]);

  // Handle download file
  const handleDownload = useCallback(() => {
    if (!activeFile) return;

    const blob = new Blob([activeFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setSuccessMessage(`Downloaded ${activeFile.name}`);
    setTimeout(() => setSuccessMessage(null), 3000);
  }, [activeFile]);

  // Handle fullscreen toggle
  const handleFullscreenToggle = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isFullscreen: !prev.isFullscreen,
    }));
  }, []);

  // Handle cursor position change
  const handleCursorPositionChange = useCallback(
    (line: number, column: number) => {
      setState((prev) => ({
        ...prev,
        editorStatus: {
          ...prev.editorStatus,
          line,
          column,
        },
      }));
    },
    []
  );

  // Handle export to NCM
  const handleExport = useCallback(() => {
    setState((prev) => ({ ...prev, isExporting: true }));

    // Simulate export process
    setTimeout(() => {
      setState((prev) => ({ ...prev, isExporting: false }));
      setSuccessMessage(
        'Successfully exported to Nutanix Cloud Manager! You can now apply this configuration in NCM.'
      );
      setTimeout(() => setSuccessMessage(null), 5000);
    }, 2000);
  }, []);

  // Handle escape key for fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.isFullscreen) {
        setState((prev) => ({ ...prev, isFullscreen: false }));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state.isFullscreen]);

  return (
    <ContainerLayout padding="40px">
      <StackingLayout itemGap="L">
        {/* Success Message */}
        {successMessage && (
          <Alert
            type={Alert.AlertTypes.SUCCESS}
            message={successMessage}
            showCloseIcon
            onClose={() => setSuccessMessage(null)}
          />
        )}

        {/* Header */}
        <FlexLayout justifyContent="space-between" alignItems="flex-start">
          <StackingLayout itemGap="XS">
            <Title size={Title.TitleSizes.H1}>IaC Generation Preview</Title>
            <Paragraph type="secondary" forceMultiLineHeight>
              Review the translated Terraform configuration before pushing to
              Nutanix Cloud Manager. Session: {sessionId}
            </Paragraph>
          </StackingLayout>
          <Button
            type={Button.ButtonTypes.PRIMARY}
            onClick={handleExport}
            disabled={state.isExporting}
          >
            <FlexLayout alignItems="center" itemGap="XS" padding="0px-10px">
              <CloudIcon style={{ width: '16px', height: '16px' }} />
              {state.isExporting ? 'Exporting...' : 'Export to Nutanix Cloud Manager'}
            </FlexLayout>
          </Button>
        </FlexLayout>

        {/* Main Content: Explorer + Editor */}
        {!state.isFullscreen && (
          <MainContentArea>
            <FileExplorer
              files={state.files}
              activeFileId={state.activeFileId}
              onFileSelect={handleFileSelect}
            />
            <EditorPanel
              activeFile={activeFile}
              tabs={state.openTabs}
              status={state.editorStatus}
              isFullscreen={state.isFullscreen}
              onTabClick={handleTabClick}
              onCloseTab={handleCloseTab}
              onCopy={handleCopy}
              onDownload={handleDownload}
              onFullscreenToggle={handleFullscreenToggle}
              onCursorPositionChange={handleCursorPositionChange}
            />
          </MainContentArea>
        )}

        {/* Fullscreen mode renders editor outside of normal flow */}
        {state.isFullscreen && (
          <EditorPanel
            activeFile={activeFile}
            tabs={state.openTabs}
            status={state.editorStatus}
            isFullscreen={state.isFullscreen}
            onTabClick={handleTabClick}
            onCloseTab={handleCloseTab}
            onCopy={handleCopy}
            onDownload={handleDownload}
            onFullscreenToggle={handleFullscreenToggle}
            onCursorPositionChange={handleCursorPositionChange}
          />
        )}
      </StackingLayout>
    </ContainerLayout>
  );
}
