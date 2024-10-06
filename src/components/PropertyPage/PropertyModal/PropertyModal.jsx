
import React from 'react';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import ModalUpfrontCosts from './ModalUpfrontCosts/ModalUpfrontCosts'; // Import your specific components
import ModalHoldingPeriodCosts from './ModalHoldingPeriodCosts/ModalHoldingPeriodCosts';
import ModalProfitEstimation from './ModalProfitEstimation/ModalProfitEstimation';


const PropertyModal = ({ isOpen, onClose, propertyCard }) => {
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
          {/* <button className='modal-btn'>Edit</button> */}
          {/* <button onClick={saveUpdatedPropertyInfo}>Save</button> */}
      </div>
    </div>
  );
};

export default PropertyModal;