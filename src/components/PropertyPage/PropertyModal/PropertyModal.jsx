
import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ModalUpfrontCosts from './ModalUpfrontCosts/ModalUpfrontCosts'; // Import your specific components
import ModalHoldingPeriodCosts from './ModalHoldingPeriodCosts/ModalHoldingPeriodCosts';
import ModalProfitEstimation from './ModalProfitEstimation/ModalProfitEstimation';
import ModalMortgageCalculator from './ModalMortgageCalculator/ModalMortgageCalculator';
import Swal from 'sweetalert2';


const PropertyModal = ({ isOpen, onClose, propertyCard, userId }) => {

  const dispatch = useDispatch();

  const propertyOfInterest = useSelector((store) => store.propertyOfInterest);
  

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackToDefault = () => {
    dispatch({
      type: 'UPDATE_BACK_TO_DEFAULT',
      payload: propertyOfInterest.property[0].id
    })
  }

  //sends a dispatch to the properties saga
  const saveUpdatedPropertyInfo = () => {
    dispatch({
      type: 'UPDATE_PROPERTY',
      payload: {
        propertyId: propertyOfInterest.property[0].id,
        holdingPeriod: propertyOfInterest.property[0].holding_period,
        purchasePrice: propertyOfInterest.property[0].purchase_price,
        afterRepairValue: propertyOfInterest.property[0].after_repair_value,
        userId: userId
    }
  })
  Swal.fire({
    icon: "success",
    title: "Your work has been saved",
    showConfirmButton: false,
    timer: 1500
  });
}
  


  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        <div>
          <button onClick={onClose} className="modal-close">X</button>
          <h2 className="modal-header">{propertyCard.address}</h2>
        </div>
        <div className="modal-body">
        <div className="modalRight grid-container">
          <div className='section upfront-costs'>
            <h3 className='section-header'>Upfront Costs:</h3>
            <ModalUpfrontCosts />
          </div>

          <div className='section holding-period-costs'>
            <h3 className='section-header'>Holding Period Costs:</h3>
            <ModalHoldingPeriodCosts />
          </div>

          <div className='section mortgage-calculator'>
            <h3 className='section-header'>Mortgage Calculator:</h3>
            <ModalMortgageCalculator />
          </div>

          <div className='section profit-estimation'>
            <h3 className='section-header'>Profit Estimation:</h3>
            <ModalProfitEstimation />
          </div>

          
          {/* <div className="grid-container"> */}
          <button className="modal-default-btn" onClick={handleBackToDefault}>Back To Default</button>
          <button className="modal-save-btn" onClick={saveUpdatedPropertyInfo}>Save</button>
          </div>
      </div>
    </div>
    </div>
  );
};

export default PropertyModal;