import React from 'react';
import {useSelector} from 'react-redux';


function ModalProfitEstimation() {
  const propertyOfInterest = useSelector((store) => store.propertyOfInterest);

  return (
    <div className="container">
      <p>Profit Estimation:</p>
      {Object.keys(propertyOfInterest).length && 
      <>
      <p>After Repair Value: ${propertyOfInterest.property[0].after_repair_value}</p>
        
      </>
      }
    </div>
  );
}

export default ModalProfitEstimation;