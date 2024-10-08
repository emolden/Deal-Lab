import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { useState } from 'react';



function ModalUpfrontCosts() {

  const dispatch = useDispatch();

  const propertyOfInterest = useSelector((store) => store.propertyOfInterest);
  const [repairName, setRepairName] = useState("");
  const [repairItemCost, setRepairItemCost] = useState("");

  const addRepairItem = () => {
      dispatch ({
          type: 'ADD_PROPERTY_REPAIR_ITEM',
          payload: {propertyId: propertyOfInterest.property[0].id, repairName: repairName, repairCost: repairItemCost }
      })
      setRepairName("");
      setRepairItemCost("");
  }

  const deleteRepairItem = (itemId) => {
    dispatch ({
        type: 'DELETE_PROPERTY_REPAIR_ITEM',
        payload: {itemId: itemId, propertyId: propertyOfInterest.property[0].id}
    })
}

  const formattedCurrency = (value) => {
    const number = parseFloat(value);
    return `$${number.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="container">
      {Object.keys(propertyOfInterest).length && 
      <>
      <p> Purchase Price:</p> 
      <input
        value= {formattedCurrency(Number(propertyOfInterest.property[0].purchase_price))}
        onChange={e => {e.preventDefault; dispatch({type: 'UPDATE_PROPERTY_PURCHASE_PRICE', payload: e.target.value})}}
      />
      <p>Repair Items:</p>
      <input className='repiarItemInput'
        name='repairItemInput'
        type='text'
        placeholder='Repair Name'
        value={repairName}
        onChange={e => setRepairName(e.target.value)}
      />
      <input className='repiarCostInput'
        name='repairCostInput'
        type='text'
        placeholder='Repair Cost'
        value={repairItemCost}
        onChange={e => setRepairItemCost(e.target.value)}
      />
      <button onClick={addRepairItem}>Add</button>
      <ul>
        {propertyOfInterest.repairItems.map((item) => {
          return (
            <div key = {item.id}>
              <li >{item.repair_name}: {formattedCurrency(item.repair_cost)} </li>
              <button onClick={() => {deleteRepairItem(item.id)}}>X</button>
            </div>
          )
        })}
      </ul>
      <p>Total Repair Cost: {formattedCurrency(propertyOfInterest.property[0].total_repair_cost)}</p>
      
        <p>
          <span className="bold-text">Total Upfront Cost: {formattedCurrency(propertyOfInterest.property[0].total_upfront_cost)}</span>
        </p>
      </>
      }

    </div>
  );
}

export default ModalUpfrontCosts;