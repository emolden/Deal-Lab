import React from 'react';
import DefaultHoldingCost from './DefaultHoldingCost/DefaultHoldingCost';
import DefaultRepairItems from './DefaultRepairItems/DefaultRepairItems';

function DefaultSettings() {
  return (
    <div className="container">
      <h2>Default Settings</h2>
      <DefaultHoldingCost />
      <DefaultRepairItems />
    </div>
  );
}

export default DefaultSettings;
