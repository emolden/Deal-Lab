import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { useState } from 'react';
import upfrontCost from '../../../../helpers/upfrontCost';
import repairCost from '../../../../helpers/repairCost';


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

  // const totalUpfrontCost = propertyOfInterest.property[0].purchase_price + 20000;

  const formattedCurrency = (value) => {
    const number = parseFloat(value);
    return `$${number.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="container">
      {Object.keys(propertyOfInterest).length && 
      <>
      {/* <p>Upfront Costs:</p> */}
      <p> Purchase Price: {formattedCurrency(propertyOfInterest.property[0].purchase_price)}</p>
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
            <>
            <li key = {item.repair_items_id}>{item.repair_name}: ${item.repair_cost} </li>
            <button onClick={() => {deleteRepairItem(item.repair_items_id)}}>❌</button>
            </>
          )
        })}
      </ul>
      <p>Total Repair Cost: {formattedCurrency(repairCost(propertyOfInterest.repairItems))}</p>
      
        <p>
          <span className="bold-text">Total Upfront Cost: {formattedCurrency(upfrontCost(repairCost(propertyOfInterest.repairItems), propertyOfInterest.property[0].purchase_price))}</span>
        </p>
      </>
      }

    </div>
  );
}

export default ModalUpfrontCosts;