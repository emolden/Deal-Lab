import React from 'react';
import { useDispatch } from 'react-redux';

function PropertyCard() {
  const dispatch = useDispatch();

  //getPropertyOfInterest function runs when the user clicks "edit" or
  //on the address card. This function sends a a dispatch to the properties.saga.js
  //with the property id as the payload.
  const getPropertyOfInterest = (propId) => {
    // console.log("in getPropertyOfInterest function in PropertyCard component", propId)
    dispatch({
      type: 'GET_PROPERTY_OF_INTEREST',
      payload: propId
    });
  }


  return (
    <div className="container">
      <p>Property Card:</p>
      <button onClick={()=>{getPropertyOfInterest(1)}}>Edit</button>
    </div>
  );
}

export default PropertyCard;