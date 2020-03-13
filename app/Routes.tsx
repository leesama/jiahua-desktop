import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App/App';
import EquipmentAdd from './components/equipment-add/equipment-add';
import EquipmentMannage from './components/equipment-mannage/equipment-mannage';
import TagMannage from './components/tag-mannage';
import TagAdd from './components/tag-add/tag-add';

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path="/equipmentadd" component={EquipmentAdd} />
        <Route path="/equipmentmannage" component={EquipmentMannage} />
        <Route path="/tagmannage" component={TagMannage} />
        <Route path="/tagadd" component={TagAdd} />
      </Switch>
    </App>
  );
}
