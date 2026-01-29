import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { ThemeManager, ThemeWrapper } from '@nutanix-core/prism-ui-themes-common';
import '@nutanix-core/prism-ui-themes-common/lib/definitions.css';
import './App.css';

import Landing from './pages/Landing';
import ConnectAWS from './pages/ConnectAWS';
import history from './routes/history';
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
            <FlexLayout background='alt'>
      <Router history={history}>
        <div style={{
          height: '100vh',
          width: '100vw',
          overflow: 'auto',
        }}>
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route path="/connect-aws" component={ConnectAWS} />
          </Switch>
        </div>
      </Router>
      </FlexLayout>
    </ThemeWrapper>
  );
}
