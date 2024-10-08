import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function DefaultRepairItems({defaultRepairs}) {
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

  const formattedCurrency = (value) => {
    const number = parseFloat(value);
    const truncated = Math.floor(number * 100) / 100;
    return `$${truncated.toFixed(2)}`;
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
        {!defaultRepairs ? '' : defaultRepairs.map((item) => {
            return (
              <table className='defaultRepairItemsTable'>
                <tr className='defaultRepairItem' key={item.id}>
                  <td className='defaultRepairItemName'>{item.repair_name}:</td>
                  <td className='defaultRepairItemCost'>{formattedCurrency(item.repair_cost)}</td>
                  <td className='deleteDefaultRepairBtn'
                      onClick={e => {
                        e.preventDefault();
                        dispatch({
                          type: 'DELETE_DEFAULT_REPAIR_ITEM',
                          payload: item.id
                        })
                      }}>❌</td>
                </tr>
            </table>

              // <div className='defaultRepairItem'
              //       key={item.id}>
              //   <span className='defaultRepairItemName'>{item.repair_name}:</span>
              //   <span className='defaultRepairItemCost'>{formattedCurrency(item.repair_cost)}</span>
              //   <span className='deleteDefaultRepairBtn'
              //         onClick={e => {
              //           e.preventDefault();
              //           dispatch({
              //             type: 'DELETE_DEFAULT_REPAIR_ITEM',
              //             payload: item.id
              //           })
              //         }}>❌</span>
              // </div>
            )
          })}
      </div>


      <h4>Total: $
        <span>
          {!defaultRepairs ? '' : defaultRepairs.reduce((total, item) => {
            total = total + Number(item.repair_cost)
            return total
          }, 0)}
        </span>
      </h4>
    </div>

  );
}

export default DefaultRepairItems;