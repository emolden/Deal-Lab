import React from 'react';
import {useSelector} from 'react-redux';


function ModalHoldingPeriodCosts() {
  const propertyOfInterest = useSelector((store) => store.propertyOfInterest);

  const monthlyTax = propertyOfInterest.property[0].taxes_yearly / 12;
  const holdingCost = monthlyTax + 100; // Include other holding costs as needed
  const totalHoldingCost = holdingCost * propertyOfInterest.property[0].holding_period;

  const formattedCurrency = (value) => {
    const number = parseFloat(value);
    return `$${number.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="container">
      {Object.keys(propertyOfInterest).length && 
        <>
          {/* <p>Holding Costs:</p> */}
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
        <p>
          <span className="bold-text">Total Holding Cost: {formattedCurrency(totalHoldingCost)}</span>
          </p>
        </>
      }
    </div>
  );
}

export default ModalHoldingPeriodCosts;