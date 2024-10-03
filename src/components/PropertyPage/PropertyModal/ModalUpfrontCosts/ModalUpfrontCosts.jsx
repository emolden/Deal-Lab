import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { useState } from 'react';

function ModalUpfrontCosts() {

  const dispatch = useDispatch();

  const propertyOfInterest = useSelector((store) => store.propertyOfInterest);
  const [repairName, setRepairName] = useState("");
  const [repairCost, setRepairCost] = useState("");

  const addRepairItem = () => {
      dispatch ({
          type: 'ADD_PROPERTY_REPAIR_ITEM',
          payload: {propertyId: propertyOfInterest.property[0].id, repairName: repairName, repairCost: repairCost }
      })
      setRepairName("");
      setRepairCost("");
  }

  const deleteRepairItem = (itemId) => {
    dispatch ({
        type: 'DELETE_PROPERTY_REPAIR_ITEM',
        payload: {itemId: itemId, propertyId: propertyOfInterest.property[0].id}
    })
}

  return (
    <div className="container">
      {Object.keys(propertyOfInterest).length && 
      <>
      <p>Upfront Costs:</p>
      <p> Purchase Price: {propertyOfInterest.property[0].purchase_price}</p>
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
        value={repairCost}
        onChange={e => setRepairCost(e.target.value)}
      />
      <button onClick={addRepairItem}>Add</button>
      <ul>
        {propertyOfInterest.repairItems.map((item) => {
          return (
            <>
            <li key = {item.repair_items_id}>{item.repair_name}: ${item.repair_cost} </li>
            <button onClick={() => {deleteRepairItem(item.repair_items.id)}}>❌</button>
            </>
          )
        })}
      </ul>
      
      </>
      }

    </div>
  );
}

export default ModalUpfrontCosts;