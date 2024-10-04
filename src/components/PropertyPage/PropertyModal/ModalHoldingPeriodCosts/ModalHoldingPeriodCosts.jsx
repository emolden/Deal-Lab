import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { useState } from 'react';


function ModalHoldingPeriodCosts() {

  const dispatch = useDispatch();

  const propertyOfInterest = useSelector((store) => store.propertyOfInterest);
  const [holdingName, setHoldingName] = useState("");
  const [holdingItemCost, setHoldingItemCost] = useState("");

  const addHoldingItem = () => {
    dispatch ({
        type: 'ADD_PROPERTY_HOLDING_ITEM',
        payload: {propertyId: propertyOfInterest.property[0].id, holdingName: holdingName, holdingCost: holdingCost }
    })
    setHoldingName("");
    setHoldingItemCost("");
}

const deleteHoldingItem = (itemId) => {
  dispatch ({
      type: 'DELETE_PROPERTY_HOLDING_ITEM',
      payload: {itemId: itemId, propertyId: propertyOfInterest.property[0].id}
  })
}

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
          <input className='holdingItemInput'
            name='holdingItemInput'
            type='text'
            placeholder='holding Name'
            value={holdingName}
            onChange={e => setHoldingName(e.target.value)}
          />
          <input className='holdingCostInput'
            name='holdingCostInput'
            type='text'
            placeholder='holding Cost'
            value={holdingItemCost}
            onChange={e => setHoldingItemCost(e.target.value)}
          />
          <button onClick={addHoldingItem}>Add</button>
          <ul>
            <li> Taxes: {formattedCurrency(propertyOfInterest.property[0].taxes_yearly/12)}</li>
            {propertyOfInterest.holdingItems.map((item) => {
              return (
                <>
                <li key = {item.holding_items_id}>{item.holding_name}: {formattedCurrency(item.holding_cost)} </li>
                <button onClick={() => {deleteHoldingItem(item.holding_items_id)}}>X</button>
                </>
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