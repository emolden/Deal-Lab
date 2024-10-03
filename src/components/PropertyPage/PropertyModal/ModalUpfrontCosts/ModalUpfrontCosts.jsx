import React from 'react';
import {useSelector} from 'react-redux';
import { useState } from 'react';

function ModalUpfrontCosts() {
  const propertyOfInterest = useSelector((store) => store.propertyOfInterest);
  const [repairName, setRepairName] = useState("");
  const [repairCost, setRepairCost] = useState("");

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
      <button>Add</button>
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