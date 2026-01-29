import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  ContainerLayout,
  FlexLayout,
  StackingLayout,
  Title,
  Paragraph,
  Button,
  CloudIcon,
  Alert,
  TextLabel,
  Progress,
  QuestionIcon,
  ChevronRightIcon,
} from '@nutanix-ui/prism-reactjs';

import {
  EditorTab,
  IaCPreviewState,
  RouteParams,
} from './types';
import { MOCK_TERRAFORM_FILES, DEFAULT_EDITOR_STATUS } from './constants';
import { MainContentArea } from './styles';
import { CONNECTION_STEPS } from '../ConnectAWS/types';
import StepFooter, { STEP_FOOTER_HEIGHT } from '../../components/StepFooter';

// Components
import FileExplorer from './components/FileExplorer';
import EditorPanel from './components/EditorPanel';

// Title Bar Component - persists across all wizard steps
interface TitleBarProps {
  title: string;
}

const TitleBar: React.FC<TitleBarProps> = ({ title }) => (
  <ContainerLayout
    padding="20px"
    style={{
      paddingLeft: '40px',
      paddingRight: '40px',
      borderBottom: '1px solid var(--color-border-separator)',
      background: 'var(--color-background-base)',
    }}
  >
    <Title size={Title.TitleSizes.H2}>{title}</Title>
  </ContainerLayout>
);

// Wizard Progress Component - persists across all wizard steps
interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  description: string;
}

const WizardProgress: React.FC<WizardProgressProps> = ({
  currentStep,
  totalSteps,
  stepTitle,
  description,
}) => {
  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <StackingLayout itemGap="M" padding="0px">
      <FlexLayout alignItems="center" justifyContent="space-between">
        <StackingLayout itemGap="S">
          <TextLabel
            type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}
            size={TextLabel.TEXT_LABEL_SIZE.SMALL}
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: 'var(--color-text-link)',
              fontWeight: 600,
            }}
          >
            STEP {currentStep} OF {totalSteps}
          </TextLabel>
          <Title size={Title.TitleSizes.H3}>{stepTitle}</Title>
        </StackingLayout>
        <TextLabel type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}>
          {progressPercent}% Completed
        </TextLabel>
      </FlexLayout>
      <Progress
        percent={progressPercent}
        status={Progress.ProgressStatus.ACTIVE}
        label={false}
      />
      <Paragraph type="secondary" forceMultiLineHeight>
        {description}
      </Paragraph>
    </StackingLayout>
  );
};

// Need Help Component - positioned above the footer
const NeedHelpBox: React.FC = () => (
  <ContainerLayout
    border
    padding="15px"
    style={{
      cursor: 'pointer',
      position: 'fixed',
      bottom: '84px',
      right: '24px',
      width: '280px',
      background: 'var(--color-background-base)',
      zIndex: 100,
    }}
  >
    <FlexLayout alignItems="center" justifyContent="space-between">
      <FlexLayout alignItems="center" itemGap="S">
        <QuestionIcon color="var(--color-text-secondary-label)" />
        <StackingLayout itemGap="S">
          <TextLabel type={TextLabel.TEXT_LABEL_TYPE.PRIMARY}>
            Need help?
          </TextLabel>
          <TextLabel
            type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}
            size={TextLabel.TEXT_LABEL_SIZE.SMALL}
          >
            Contact Support
          </TextLabel>
        </StackingLayout>
      </FlexLayout>
      <ChevronRightIcon color="var(--color-text-secondary-label)" />
    </FlexLayout>
  </ContainerLayout>
);

export default function IaCGenerationPreview(): React.ReactElement {
  const { sessionId } = useParams<RouteParams>();
  const history = useHistory();

  // Step 5 data
  const currentStep = 5;
  const currentStepData = CONNECTION_STEPS[currentStep - 1];

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
      // Navigate to Landing page with filled state after export
      setTimeout(() => {
        history.push('/?demo=true');
      }, 1500);
    }, 2000);
  }, [history]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    history.push(`/security/${sessionId}`);
  }, [history, sessionId]);

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
    <FlexLayout flexDirection="column" style={{ minHeight: '100vh', width: '100%', paddingBottom: `${STEP_FOOTER_HEIGHT}px` }}>
      {/* Title Bar - persists across all wizard steps */}
      <TitleBar title="Migrate AWS Environment" />

      {/* Main Content Area */}
      <ContainerLayout padding="40px" style={{ flex: 1 }}>
        <StackingLayout style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Wizard Progress - persists across all wizard steps */}
          <WizardProgress
            currentStep={currentStep}
            totalSteps={CONNECTION_STEPS.length}
            stepTitle={currentStepData.title}
            description={currentStepData.description}
          />

          {/* Main Content Container */}
          <ContainerLayout border padding="30px" style={{ marginTop: '20px' }}>
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
                  <Title size={Title.TitleSizes.H3}>Generated Terraform Configuration</Title>
                  <Paragraph type="secondary" forceMultiLineHeight>
                    Review the translated Terraform configuration before pushing to
                    Nutanix Cloud Manager. Session: {sessionId}
                  </Paragraph>
                </StackingLayout>
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

              {/* Inline Actions */}
              <FlexLayout
                justifyContent="flex-start"
                alignItems="center"
                itemGap="S"
                style={{ marginTop: '20px' }}
              >
                <Button
                  type={Button.ButtonTypes.SECONDARY}
                  onClick={handleCopy}
                  disabled={!activeFile}
                >
                  Copy to Clipboard
                </Button>
                <Button
                  type={Button.ButtonTypes.SECONDARY}
                  onClick={handleDownload}
                  disabled={!activeFile}
                >
                  Download File
                </Button>
              </FlexLayout>
            </StackingLayout>
          </ContainerLayout>
        </StackingLayout>
      </ContainerLayout>

      {/* Need Help Box - fixed at bottom right */}
      {/* <NeedHelpBox /> */}

      {/* Step Footer */}
      <StepFooter
        currentStep={currentStep}
        totalSteps={CONNECTION_STEPS.length}
        nextLabel={state.isExporting ? 'Exporting...' : 'Export to NCM'}
        onNext={handleExport}
        onBack={handleBack}
        isNextDisabled={state.isExporting}
        nextIcon={<CloudIcon style={{ width: '16px', height: '16px' }} />}
      />
    </FlexLayout>
  );
}
