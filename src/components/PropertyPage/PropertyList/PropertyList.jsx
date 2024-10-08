import React from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropertyCard from './PropertyCard/PropertyCard';
// import { useEffect } from 'react';

function PropertyList({ userId, onOpenModal }) {
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
      <div className='property-cards-container'>
      {Array.isArray(allProperties.properties) && allProperties.properties.length > 0 ? (
        allProperties.properties.map((property) => (
          // <div >
            // <PropertyCard 
            //   key={property.id}
            //   property={property} 
            //   userId={userId} 
            //   onOpenModal={onOpenModal}
            //   allRepairItems={allProperties.repairItems}
            //   allHoldingItems = {allProperties.holdingItems} 
            // />
          // </div>
          <div>props go here</div>
        ))
      ) : (
        <p>No properties found.</p> // Optionally show a message if no properties are found
      )}
    </div>
    </div>
  );
}

  // return (
  //   <div className="container">
  //     <p>Property List:</p>

  //     {Object.keys(allProperties).length && allProperties.map((property) => {
  //       return (
  //         <div key={property.id}>
  //           <PropertyCard property={property} userId={userId} onOpenModal={onOpenModal} />
  //         </div>
  //       )
  //     })}
      
  //   </div>
  // );


export default PropertyList;