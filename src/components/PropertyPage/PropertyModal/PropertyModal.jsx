
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
        <button onClick={onClose} className="modal-close">X</button>
        
        <div className="modalRight">
          <p>Property Address: {propertyCard.address}</p>
          <p>Purchase Price: {formattedCurrency(propertyCard.purchase_price)}</p>
          <p>Upfront Cost: {formattedCurrency(upfrontCost)}</p>
          <p>Holding Period Cost: {formattedCurrency(holdingCost)}</p>
          <p>Total Cost: {formattedCurrency(totalCost)}</p>
          <p>Profit: {formattedCurrency(profit)}</p>
          <p>Annualized Profit: {formattedCurrency(annualProfit)}</p>
          
          {/* Include your specific modal components here */}
          <ModalUpfrontCosts />
          <ModalHoldingPeriodCosts />
          <ModalProfitEstimation />
        </div>
      </div>
    </div>
  );
};

export default PropertyModal;


// import React from 'react';
// import {useSelector} from 'react-redux';
// import ModalHoldingPeriodCosts from './ModalHoldingPeriodCosts/ModalHoldingPeriodCosts';
// import ModalUpfrontCosts from './ModalUpfrontCosts/ModalUpfrontCosts';
// import ModalProfitEstimation from './ModalProfitEstimation/ModalProfitEstimation';
// import PropertyCard from '../PropertyList/PropertyCard/PropertyCard';
// import './PropertyModal.css';


// const PropertyModal = ({ isOpen, onClose, propertyCard }) => {
//   if (!isOpen) return null;

//   const propertyOfInterest = useSelector((store) => store.propertyOfInterest);

//   return (
//     <div className="container">
//       <div onClick={onClose} className="modal-overlay">
//         <div onClick={(e) => e.stopPropagation()} className="modal-content">
//           <button onClick={onClose} className="overlay">X</button>
//       {/* THIS IS RENDERING A "0" ON THE DOM!!! WHY????????????????????????????*/}
//       {Object.keys(propertyOfInterest).length && 
//         <div className="modalRight">
//           <p>Property Modal: {propertyOfInterest.property[0].address}</p>
          
//           <ModalUpfrontCosts />
//           <ModalHoldingPeriodCosts />
//           <ModalProfitEstimation />
//           <PropertyCard />
//         </div>
//       } 
//       </div>  
//       </div>
//     </div>
//   );
// }

// export default PropertyModal;