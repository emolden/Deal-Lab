import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { useState } from 'react';
import upfrontCost from '../../../../helpers/upfrontCost';
import repairCost from '../../../../helpers/repairCost';
// import '../PropertyPage/PropertyModal/PropertyModal.css';

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
      <input 
        type='text'
        placeholder='Repair Name'
        value={repairName}
        onChange={e => setRepairName(e.target.value)}
      />
      <input
        type='text'
        placeholder='Repair Cost'
        value={repairItemCost}
        onChange={e => setRepairItemCost(e.target.value)}
      />
      <button className="modal-btn-2"onClick={addRepairItem}>Add</button>
      <ul>
        {propertyOfInterest.repairItems.map((item) => {
          return (
            <div className="unordered-list">
            <ul key = {item.repair_items_id}>{item.repair_name}: {formattedCurrency(item.repair_cost)} </ul>
            <img className="deleteBtn" onClick={() => {deleteRepairItem(item.repair_items_id)}} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgy6cH4pk8uBtQ-_MBHx5MtDO8ms62KxR0UQ&s" />
            </div>
          )
        })}
      </ul>
      <p>Total Repair Cost: {formattedCurrency(repairCost(propertyOfInterest.repairItems))}</p>
      
        <p>
          <span className="bold-text">Total Upfront Cost: {formattedCurrency(upfrontCost(propertyOfInterest.repairItems, propertyOfInterest.property[0].purchase_price))}</span>
        </p>
      </>
      }

    </div>
  );
}

export default ModalUpfrontCosts;