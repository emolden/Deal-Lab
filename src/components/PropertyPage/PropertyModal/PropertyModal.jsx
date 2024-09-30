import React from 'react';
import ModalHoldingPeriodCosts from './ModalHoldingPeriodCosts/ModalHoldingPeriodCosts';
import ModalUpfrontCosts from './ModalUpfrontCosts/ModalUpfrontCosts';
import ModalProfitEstimation from './ModalProfitEstimation/ModalProfitEstimation';

function PropertyModal() {
  return (
    <div className="container">
      <p>Property Modal:</p>
      <ModalUpfrontCosts />
      <ModalHoldingPeriodCosts />
      <ModalProfitEstimation />
    </div>
  );
}

export default PropertyModal;