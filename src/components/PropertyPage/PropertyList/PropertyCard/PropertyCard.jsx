import React from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2'

function PropertyCard({property, userId}) {
  const dispatch = useDispatch();
  // 20000 is the repair number.
  const upfrontCost = Number(property.purchase_price) + 20000; 
  const holdingCost = ((Number(property.taxes_yearly) / 12) + 100) * Number(property.holding_period);
  const totalCost = upfrontCost + holdingCost;
  const profit = Number(property.after_repair_value) - totalCost;
  const annualProfit = (profit / Number(property.holding_period)) * 12;
  
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

  //deleteProperty function runs when the user clicks "delete". 

  const deleteProperty = (propertyId) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    //This is the pop-up that appears when the user clicks "delete"
    swalWithBootstrapButtons.fire({
      title: "Are you sure you want to delete this property?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it.",
      cancelButtonText: "No, cancel.",
      reverseButtons: true
    }).then((result) => {
      //If the user confirms they wish to delete the property
      if (result.isConfirmed) {
        //sends a a dispatch to the properties.saga.js
        //with the property id as the payload.
        dispatch({
          type: 'DELETE_PROPERTY',
          payload: {propertyId, userId}
        });
        swalWithBootstrapButtons.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      } 
      //if the user cancels the delete
      else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your property has NOT been deleted.",
          icon: "error"
        });
      }
    });
  }

  return (
    <div className="container">
      <p>Property Card:</p>

      <table className='rentCastTable'>
          <thead className='rentCastHeader'>
              <tr className='rentCastHeaderRow'>
                  <th className='rentCastHeadTitle'>Address</th>
                  <th className='rentCastHeadTitle'>Purchase Price</th>
                  <th className='rentCastHeadTitle'>Upfront Cost</th>
                  <th className='rentCastHeadTitle'>Holding Period Cost</th>
                  <th className='rentCastHeadTitle'>Total Cost</th>
                  <th className='rentCastHeadTitle'>Profit</th>
                  <th className='rentCastHeadTitle'>Annualized Profit</th>
                  <th></th>
              </tr>
          </thead>

          <tbody className='rentCastBody'>
            <tr>
                <td onClick={()=>{getPropertyOfInterest(property.id)}}>{property.address}</td>
                <td>${property.purchase_price}</td>
                <td>${upfrontCost}</td>
                <td>${holdingCost}</td>
                <td>${totalCost}</td>
                <td>${profit}</td>
                <td>${annualProfit}</td>
                <td><button onClick={() => {deleteProperty(property.id)}}>Delete</button></td>
            </tr>
          </tbody>
      </table>

    </div>
  );
}

export default PropertyCard;