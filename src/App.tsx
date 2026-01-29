import React from 'react';
import { ThemeManager, ThemeWrapper } from '@nutanix-core/prism-ui-themes-common';
import '@nutanix-core/prism-ui-themes-common/lib/definitions.css';
import './App.css';

import Landing from './pages/Landing';
import { FlexLayout } from '@nutanix-ui/prism-reactjs';

export default function App(): React.ReactElement {
  const themeManager = ThemeManager.instance;
  const newTheme = themeManager.getThemeById('dark');
  themeManager.theme = newTheme;

  return (
    <ThemeWrapper
      onThemeChange={() => {
        return {
          theme: newTheme,
        };
      }}
    >
      <FlexLayout background='alt' style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
        <Landing />
      </FlexLayout>
    </ThemeWrapper>
  );
}
