import React from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropertyCard from './PropertyCard/PropertyCard';

function PropertyList() {
  const dispatch = useDispatch();
  const user = useSelector(store => store.user)
  const allProperties = useSelector(store => store.allProperties)

  useEffect(() => {
    dispatch({ 
      type: 'GET_PROPERTIES', 
      payload: user.id 
    })
  }, [])

  console.log('allProperties data:', allProperties);
  
  return (
    <div className="container">
      <p>Property List:</p>

      {!allProperties ? '' : allProperties.map((property) => {
        return (
          <div>
            <PropertyCard property={property} />
          </div>
        )
      })}
      
    </div>
  );
}

export default PropertyList;