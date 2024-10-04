
import React from 'react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
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

  const upfrontCost = Number(propertyCard.purchase_price) + 20000; 
  const holdingCost = ((Number(propertyCard.taxes_yearly) / 12) + 100) * Number(propertyCard.holding_period);
  const totalCost = upfrontCost + holdingCost;
  const profit = Number(propertyCard.after_repair_value) - totalCost;
  const annualProfit = (profit / Number(propertyCard.holding_period)) * 12;


  const formattedCurrency = (value) => {
    const number = parseFloat(value);
    const truncated = Math.floor(number * 100) / 100;
    return `$${truncated.toFixed(2)}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div>
        <button onClick={onClose} className="modal-close">X</button>
          <h2 className="modal-header">{propertyCard.address}</h2>
        </div>
          {/* <p>Purchase Price: {formattedCurrency(propertyCard.purchase_price)}</p>
          <p>Upfront Cost: {formattedCurrency(upfrontCost)}</p>
          <p>Holding Period Cost: {formattedCurrency(holdingCost)}</p>
          <p>Total Cost: {formattedCurrency(totalCost)}</p>
          <p>Profit: {formattedCurrency(profit)}</p>
          <p>Annualized Profit: {formattedCurrency(annualProfit)}</p> */}
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
            <h3 className='section-header'>Profit Estimation</h3>
              <ModalProfitEstimation />
            </div>
          </div>
          <button className='modal-btn'>Edit</button>
      </div>
    </div>
  );
};

export default PropertyModal;