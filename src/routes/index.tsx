import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Welcome from '../pages/Welcome';

export default function Routes(): React.ReactElement {
  return (
    <Switch>
      <Route path="/" component={Welcome} />
    </Switch>
  );
}
