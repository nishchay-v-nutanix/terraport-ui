import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Landing from '../pages/Landing';
import ConnectAWS from '../pages/ConnectAWS';
import ScanningEngine from '../pages/ScanningEngine';
import TranslationWorkspace from '../pages/TranslationWorkspace';
import SecurityIssues from '../pages/SecurityIssues';
import IaCGenerationPreview from '../pages/IaCGenerationPreview';

export default function Routes(): React.ReactElement {
  return (
    <Switch>
      <Route path="/preview/:sessionId" component={IaCGenerationPreview} />
      <Route path="/security/:sessionId" component={SecurityIssues} />
      <Route path="/translation/:sessionId" component={TranslationWorkspace} />
      <Route path="/scan/:scanId" component={ScanningEngine} />
      <Route path="/connect-aws" component={ConnectAWS} />
      <Route path="/" component={Landing} />
    </Switch>
  );
}
