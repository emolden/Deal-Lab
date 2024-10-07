import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { useState } from 'react';
import totalHoldingCost from '../../../../helpers/totalHoldingCost';
import monthlyHoldingCost from '../../../../helpers/monthlyHoldingCost'


function ModalHoldingPeriodCosts() {

  const dispatch = useDispatch();

  const propertyOfInterest = useSelector((store) => store.propertyOfInterest);
  const [holdingName, setHoldingName] = useState("");
  const [holdingItemCost, setHoldingItemCost] = useState("");

  const addHoldingItem = () => {
    dispatch ({
        type: 'ADD_PROPERTY_HOLDING_ITEM',
        payload: {propertyId: propertyOfInterest.property[0].id, holdingName: holdingName, holdingCost: holdingItemCost }
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

const updateTaxes = (propertyId) => {
  dispatch ({
      type: 'UPDATE_PROPERTY_TAXES',
      payload: propertyId
  })
}

  const formattedCurrency = (value) => {
    const number = parseFloat(value);
    return `$${number.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="container">
      {Object.keys(propertyOfInterest).length && 
        <>
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
            {propertyOfInterest.property[0].taxes_yearly && propertyOfInterest.property[0].taxes_yearly > 0 ? 
            <>
              <li> Taxes: {formattedCurrency(propertyOfInterest.property[0].taxes_yearly/12)}</li>
              <button onClick={() => {updateTaxes(propertyOfInterest.property[0].id)}}>X</button>
            </> : ''}
            {propertyOfInterest.holdingItems.map((item) => {
              return (
                <>
                <li key = {item.holding_items_id}>{item.holding_name}: {formattedCurrency(item.holding_cost)} </li>
                <button onClick={() => {deleteHoldingItem(item.holding_items_id)}}>X</button>
                </>
              )
            })}
          </ul>
          <p>Monthly Total: {formattedCurrency(monthlyHoldingCost(propertyOfInterest.property[0].taxes_yearly/12, propertyOfInterest.holdingItems))}</p>
          <p>Holding Period: {propertyOfInterest.property[0].holding_period} Months</p>
        <p>
          <span className="bold-text">Total Holding Cost: {formattedCurrency(totalHoldingCost(propertyOfInterest.property[0].holding_period, propertyOfInterest.property[0].taxes_yearly/12, propertyOfInterest.holdingItems))}</span>
          </p>
        </>
      }
    </div>
  );
}

export default ModalHoldingPeriodCosts;