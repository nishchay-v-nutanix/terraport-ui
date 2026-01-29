import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Welcome from '../pages/Welcome';
import ConnectAWS from '../pages/ConnectAWS';
import ScanningEngine from '../pages/ScanningEngine';

export default function Routes(): React.ReactElement {
  return (
    <Switch>
      <Route path="/scan/:scanId" component={ScanningEngine} />
      <Route path="/connect-aws" component={ConnectAWS} />
      <Route path="/" component={Welcome} />
    </Switch>
  );
}
