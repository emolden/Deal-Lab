import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function DefaultRepairItems({defaultSettings}) {
  const dispatch = useDispatch();
  const [repairName, setRepairName] = useState('');
  const [repairCost, setRepairCost] = useState('');

  const addDefaultRepairItem = () => {
    dispatch({
      type: 'ADD_DEFAULT_REPAIR_ITEM',
      payload: {
        repairName: repairName,
        repairCost: repairCost
      }
    })

    setRepairCost('');
    setRepairName('');
  }

  return (
    <div className='defaultRepair'>
      <form className='defaultRepairForm'>
        <label className='defaultSettingsText'>Repair Items:</label>
        <input className='defaultRepairNameInput'
                type='text'
                placeholder='Repair Name'
                value={repairName}
                onChange={e => setRepairName(e.target.value)}/>
        <input className='defaultRepairCostInput'
                type='number'
                placeholder='Repair Cost'
                value={repairCost}
                onChange={e => setRepairCost(e.target.value)}/>
        <span className='addDefaultRepairBtn'
              onClick={addDefaultRepairItem}>Add</span>
      </form>

      <div className='defaultRepairItems'>
      {!defaultSettings ? '' : defaultSettings.map((item) => {
          return (
            <div className='defaultRepairItem'
                  key={item.default_repair_id}>
              <span className='defaultRepairItemName'>{item.repair_name}:</span>
              <span className='defaultRepairItemCost'>{item.repair_cost}</span>
              <span className='deleteDefaultRepairBtn'
                    onClick={e => {
                      e.preventDefault();
                      dispatch({
                        type: 'DELETE_DEFAULT_REPAIR_ITEM',
                        payload: item.default_repair_id
                      })
                    }}>❌</span>
            </div>
          )
        })}
      </div>
    </div>

  );
}

export default DefaultRepairItems;