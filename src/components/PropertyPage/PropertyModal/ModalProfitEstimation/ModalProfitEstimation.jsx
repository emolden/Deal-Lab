import React from 'react';
import {useSelector} from 'react-redux';


function ModalProfitEstimation() {
  const propertyOfInterest = useSelector((store) => store.propertyOfInterest);

  const formattedCurrency = (value) => {
    const number = parseFloat(value);
    return `$${number.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="container">
      {/* <p>Profit Estimation:</p> */}
      {Object.keys(propertyOfInterest).length && 
        <>
          <p>
            <span className='bold-text'>After Repair Value: ${formattedCurrency(propertyOfInterest.property[0].after_repair_value)}</span>
          </p>
        </>
      }
    </div>
  );
}

export default ModalProfitEstimation;