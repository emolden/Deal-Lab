import React from 'react';
import {useSelector} from 'react-redux';


function ModalHoldingPeriodCosts() {
  const propertyOfInterest = useSelector((store) => store.propertyOfInterest);

  const formattedCurrency = (value) => {
    const number = parseFloat(value);
    const truncated = Math.floor(number * 100) / 100;
    return `$${truncated.toFixed(2)}`;
  }

  return (
    <div className="container">
      {Object.keys(propertyOfInterest).length && 
        <>
          <p>Holding Costs:</p>
          <p>Holding Items:</p>
          <ul>
            <li> Taxes: {formattedCurrency(propertyOfInterest.property[0].taxes_yearly/12)}</li>
            {propertyOfInterest.holdingItems.map((item) => {
              return (
                <li key = {item.holding_items_id}>{item.holding_name}: ${item.holding_cost} </li>
              )
            })}
          </ul>
          <p>Holding Period: {propertyOfInterest.property[0].holding_period} Months</p>
        
        </>
      }
    </div>
  );
}

export default ModalHoldingPeriodCosts;