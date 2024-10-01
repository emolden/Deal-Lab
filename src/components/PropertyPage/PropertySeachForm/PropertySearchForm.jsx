import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

function PropertySearchForm() {
  const dispatch = useDispatch();
  const [address, setAddress] = useState('');

  const addAddress = (e) => {
    e.preventDefault();
    dispatch ({
        type: 'ADD_PROPERTY',
        payload: {address}
    })
  } 

  return (
    <div className="container">
      <p>Property Search Form:</p>

      <form>
          <label for='addressInput'>Property Address:</label>
          <input className='rentCastInput'
                  name='addressInput'
                  type='text'
                  placeholder='1234 Penny Ln, Liverpool, BL 196700'
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  />
          <button onClick={addAddress}>Add</button>
      </form>

    </div>
  );
}

export default PropertySearchForm;

// 579 County Road B E, Maplewood, MN 55117
// 2006 Kenwood Dr W, Maplewood, MN 55117
// 2295 Gervais Hills Dr, Little Canada, MN 55117