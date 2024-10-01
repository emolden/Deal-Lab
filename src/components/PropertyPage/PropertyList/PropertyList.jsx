import React from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropertyCard from './PropertyCard/PropertyCard';

function PropertyList({userId}) {
  const dispatch = useDispatch();
  // const user = useSelector(store => store.user)
  const allProperties = useSelector(store => store.allProperties)

  useEffect(() => {
    dispatch({ 
      type: 'GET_PROPERTIES', 
      payload: userId 
    })
  }, [])

  console.log('allProperties data:', allProperties);
  
  return (
    <div className="container">
      <p>Property List:</p>

      {Object.keys(allProperties).length && allProperties.map((property) => {
        return (
          <div key={property.id}>
            <PropertyCard property={property} />
          </div>
        )
      })}
      
    </div>
  );
}

export default PropertyList;