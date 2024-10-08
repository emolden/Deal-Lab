import React from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropertyCard from './PropertyCard/PropertyCard';


function PropertyList({ userId, onOpenModal }) {
  const dispatch = useDispatch();
  
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
      <div className='property-cards-container'>
      {Array.isArray(allProperties.properties) && allProperties.properties.length > 0 ? (
        allProperties.properties.map((property) => (
          <div >
            <PropertyCard 
              key={property.id}
              property={property} 
              userId={userId} 
              onOpenModal={onOpenModal}
              allRepairItems={allProperties.repairItems}
              allHoldingItems = {allProperties.holdingItems} 
            />
          </div>
        ))
      ) : (
        <p>No properties found.</p> // Optionally show a message if no properties are found
      )}
    </div>
    </div>
  );
}


export default PropertyList;