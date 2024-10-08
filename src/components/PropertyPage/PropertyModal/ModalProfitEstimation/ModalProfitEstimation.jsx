import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
// import totalCost from '../../../../helpers/totalCost';
// import profit from '../../../../helpers/profit';
// import annualizedProfit from '../../../../helpers/annualizedProfit';



function ModalProfitEstimation() {

  const dispatch = useDispatch();

  const propertyOfInterest = useSelector((store) => store.propertyOfInterest);

  const formattedCurrency = (value) => {
    const number = parseFloat(value);
    return `$${number.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="container">
      {/* <p>Profit Estimation:</p> */}
      {Object.keys(propertyOfInterest).length && 
        <>
          <p>
            <span className='bold-text'>After Repair Value: </span>
            <input
              value= {formattedCurrency(Number(propertyOfInterest.property[0].after_repair_value))}
              onChange={e => {e.preventDefault; dispatch({type: 'UPDATE_PROPERTY_AFTER_REPAIR_VALUE', payload: e.target.value})}}
            />
          </p>
          {/* ***********NEED TO LOOK AT THESE FUNCTIONS LATER************************* */}
          {/* <p>Total Cost: {formattedCurrency(totalCost(propertyOfInterest.repairItems, propertyOfInterest.property[0].purchase_price, propertyOfInterest.property[0].holding_period, propertyOfInterest.property[0].taxes_yearly/12, propertyOfInterest.holdingItems))}</p>
          <p>Profit: {formattedCurrency(profit(propertyOfInterest.property[0].after_repair_value, propertyOfInterest.repairItems, propertyOfInterest.property[0].purchase_price, propertyOfInterest.property[0].holding_period, propertyOfInterest.property[0].taxes_yearly/12, propertyOfInterest.holdingItems))}</p>
          <p>Annualized Profit: {formattedCurrency(annualizedProfit(propertyOfInterest.property[0].after_repair_value, propertyOfInterest.repairItems, propertyOfInterest.property[0].purchase_price, propertyOfInterest.property[0].holding_period, propertyOfInterest.property[0].taxes_yearly/12, propertyOfInterest.holdingItems))}</p> */}
        </>
      }
    </div>
  );
}

export default ModalProfitEstimation;