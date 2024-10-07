
import React from 'react';
<<<<<<< HEAD
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
=======
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
>>>>>>> main
import ModalUpfrontCosts from './ModalUpfrontCosts/ModalUpfrontCosts'; // Import your specific components
import ModalHoldingPeriodCosts from './ModalHoldingPeriodCosts/ModalHoldingPeriodCosts';
import ModalProfitEstimation from './ModalProfitEstimation/ModalProfitEstimation';


const PropertyModal = ({ isOpen, onClose, propertyCard }) => {
  const propertyOfInterest = useSelector((store) => store.propertyOfInterest);
  const dispatch = useDispatch();

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

  



  const handleBackToDefault = () => {
    dispatch({
      type: 'UPDATE_BACK_TO_DEFAULT',
      payload: propertyOfInterest.property[0].id
    })
  }

  console.log('propertyOfInterest data is:', propertyOfInterest);
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div>
        <button onClick={onClose} className="modal-close">X</button>
          <h2 className="modal-header">{propertyCard.address}</h2>
        </div>
          <div className="modalRight grid-container">
            <div className='section upfront-costs'>
              <h3 className='section-header'>Upfront Costs:</h3>
              <ModalUpfrontCosts />
            </div>
            <div className='section holding-period-costs'>
            <h3 className='section-header'>Holding Period Costs:</h3>
              <ModalHoldingPeriodCosts />
            </div>
            <div className='section profit-estimation'>
            <h3 className='section-header'>Profit Estimation:</h3>
              <ModalProfitEstimation />
            </div>
          </div>
          {/* <button onClick={saveUpdatedPropertyInfo}>Save</button> */}
          <button onClick={handleBackToDefault}>Back To Default</button>

      </div>
    </div>
  );
};

export default PropertyModal;