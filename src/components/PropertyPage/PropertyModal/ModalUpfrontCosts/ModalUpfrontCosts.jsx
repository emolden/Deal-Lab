import React from 'react';
import {useSelector} from 'react-redux';

function ModalUpfrontCosts() {
  const propertyOfInterest = useSelector((store) => store.propertyOfInterest);

  return (
    <div className="container">
      {Object.keys(propertyOfInterest).length && 
      <>
      <p>Upfront Costs:</p>
      <p> Purchase Price: {propertyOfInterest.property[0].purchase_price}</p>
      <p>Repair Items:</p>
      <ul>
        {propertyOfInterest.repairItems.map((item) => {
          return (
            <li key = {item.repair_items_id}>{item.repair_name}: ${item.repair_cost} </li>
          )
        })}
      </ul>
      
      </>
      }

    </div>
  );
}

export default ModalUpfrontCosts;