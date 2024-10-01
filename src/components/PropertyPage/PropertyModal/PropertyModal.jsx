import React from 'react';
import {useSelector} from 'react-redux';
import ModalHoldingPeriodCosts from './ModalHoldingPeriodCosts/ModalHoldingPeriodCosts';
import ModalUpfrontCosts from './ModalUpfrontCosts/ModalUpfrontCosts';
import ModalProfitEstimation from './ModalProfitEstimation/ModalProfitEstimation';

function PropertyModal() {
  const propertyOfInterest = useSelector((store) => store.propertyOfInterest);
  return (
    <div className="container">
      {Object.keys(propertyOfInterest).length && 
      <>
      <p>Property Modal: {propertyOfInterest.property[0].address}</p>
      
      <ModalUpfrontCosts />
      <ModalHoldingPeriodCosts />
      <ModalProfitEstimation />
      </>
      }   
    </div>
  );
}

export default PropertyModal;