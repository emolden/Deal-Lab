import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function DefaultHoldingCost({defaultSettings}) {
  const dispatch = useDispatch();
  const [holdingName, setHoldingName] = useState('');
  const [holdingCost, setHoldingCost] = useState('');

  const addDefaultHoldingItem = () => {
    dispatch({
      type: 'ADD_DEFAULT_HOLDING_ITEM',
      payload: {
        holdingName: holdingName,
        holdingCost: holdingCost
      }
    })

    setHoldingName('');
    setHoldingCost('');
  }


// Getting error for not having an unique key prop.
// Might not recognize 'default_holding_id' as an id.
  return (
    <div className='defaultHolding'>
      <form className='defaultHoldingForm'>
        <label className='defaultSettingsText'> Holding Period Costs (per month):</label>
        <input className='defaultHoldingNameInput'
                type='text'
                placeholder='Expense Name'
                value={holdingName}
                onChange={e => setHoldingName(e.target.value)} />
        <input className='defaultHoldingCostInput'
                type='number'
                placeholder='Expense Cost'
                value={holdingCost}
                onChange={e => setHoldingCost(e.target.value)} />
        <span className='addDefaultHoldingBtn'
                onClick={addDefaultHoldingItem}>Add</span>
      </form>

      <div className='defaultHoldingItems'>
        {!defaultSettings ? '' : defaultSettings.map((item) => {
          return (
            <div className='defaultHoldingItem'
                  key={item.default_holding_id}>
              <span className='defaultHoldingItemName'>{item.holding_name}:</span>
              <span className='defaultHoldingItemCost'>{item.holding_cost}</span>
              <span className='deleteDefaultHoldingBtn'
                    onClick={e => {
                      e.preventDefault();
                      dispatch({
                        type: 'DELETE_DEFAULT_HOLDING_ITEM',
                        payload: item.default_holding_id
                      })
                    }}>❌</span>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default DefaultHoldingCost;