import React from 'react';
import {useSelector} from 'react-redux';


function ModalProfitEstimation() {
  const propertyOfInterest = useSelector((store) => store.propertyOfInterest);

  const formattedCurrency = (value) => {
    const number = parseFloat(value);
    const truncated = Math.floor(number * 100) / 100;
    return `$${truncated.toFixed(2)}`;
  }

  return (
    <div className="container">
      <p>Profit Estimation:</p>
      {Object.keys(propertyOfInterest).length && 
        <>
          <p>After Repair Value: ${formattedCurrency(propertyOfInterest.property[0].after_repair_value)}</p>
        </>
      }
    </div>
  );
}

export default ModalProfitEstimation;