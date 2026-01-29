import React from 'react';
import {
  FlexLayout,
  TextLabel,
  Button,
  CodeIcon,
  CloseIcon,
} from '@nutanix-ui/prism-reactjs';
import { EditorTab } from '../../types';
import { TabContainer } from '../../styles';

interface TabBarProps {
  tabs: EditorTab[];
  onTabClick: (_fileId: string) => void;
  onCloseTab: (_fileId: string) => void;
}

export default function TabBar({
  tabs,
  onTabClick,
  onCloseTab,
}: TabBarProps): React.ReactElement {
  return (
    <FlexLayout
      alignItems="center"
      role="tablist"
      aria-label="Open files"
      style={{
        borderBottom: '1px solid var(--color-border-separator)',
        backgroundColor: 'var(--color-background-base)',
        minHeight: '40px',
      }}
    >
      {tabs.map((tab) => (
        <TabContainer
          key={tab.fileId}
          $isActive={tab.isActive}
          onClick={() => onTabClick(tab.fileId)}
          role="tab"
          aria-selected={tab.isActive}
          tabIndex={tab.isActive ? 0 : -1}
        >
          <CodeIcon style={{ width: '14px', height: '14px', flexShrink: 0 }} />
          <TextLabel type={TextLabel.TEXT_LABEL_TYPE.PRIMARY}>
            {tab.fileName}
          </TextLabel>
          {tabs.length > 1 && (
            <Button
              type={Button.ButtonTypes.ICON_DEFAULT}
              aria-label={`Close ${tab.fileName}`}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onCloseTab(tab.fileId);
              }}
              style={{
                padding: '2px',
                minWidth: 'auto',
                minHeight: 'auto',
              }}
            >
              <CloseIcon style={{ width: '12px', height: '12px' }} />
            </Button>
          )}
        </TabContainer>
      ))}
    </FlexLayout>
  );
}
