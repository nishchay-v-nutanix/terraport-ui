import React from 'react';
import {
  FlexLayout,
  Button,
  CloneIcon,
  DownloadIcon,
  ExpandPanelIcon,
  ShrinkPanelIcon,
} from '@nutanix-ui/prism-reactjs';

interface EditorToolbarProps {
  isFullscreen: boolean;
  onCopy: () => void;
  onDownload: () => void;
  onFullscreenToggle: () => void;
}

export default function EditorToolbar({
  isFullscreen,
  onCopy,
  onDownload,
  onFullscreenToggle,
}: EditorToolbarProps): React.ReactElement {
  return (
    <FlexLayout alignItems="center" itemGap="S" style={{ marginLeft: 'auto' }}>
      <Button
        type={Button.ButtonTypes.ICON_DEFAULT}
        aria-label="Copy to clipboard"
        onClick={onCopy}
      >
        <CloneIcon style={{ width: '16px', height: '16px' }} />
      </Button>
      <Button
        type={Button.ButtonTypes.ICON_DEFAULT}
        aria-label="Download file"
        onClick={onDownload}
      >
        <DownloadIcon style={{ width: '16px', height: '16px' }} />
      </Button>
      <Button
        type={Button.ButtonTypes.ICON_DEFAULT}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        onClick={onFullscreenToggle}
      >
        {isFullscreen ? (
          <ShrinkPanelIcon style={{ width: '16px', height: '16px' }} />
        ) : (
          <ExpandPanelIcon style={{ width: '16px', height: '16px' }} />
        )}
      </Button>
    </FlexLayout>
  );
}
