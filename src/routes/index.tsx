import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Landing from '../pages/Landing';

export default function Routes(): React.ReactElement {
  return (
    <Switch>
      <Route path="/" component={Landing} />
    </Switch>
  );
}
