import React from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2'
import './PropertyCard.css';

function PropertyCard({ property, userId, onOpenModal }) {
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
        cancelButton: "btn btn-danger mr-2"
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

  // ------------ NUMBERS RENDER AS DOLLARS ------------ //
  const formattedCurrency = (value) => {
    const number = parseFloat(value);
    return `$${number.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="property-card">
      <h3 className='address' onClick={() => {getPropertyOfInterest(property.id); onOpenModal(property); }}>{property.address}</h3>

      {/* <div className="more-details">More details</div> */}

      <table className='detailsTable'>
        <thead>
          <tr>
            <th>Cost Type</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Upfront Cost</td>
            <td>{formattedCurrency(upfrontCost)}</td>
          </tr>
          <tr>
            <td>Holding Cost</td>
            <td>{formattedCurrency(holdingCost)}</td>
          </tr>
          <tr>
            <td>Total Cost</td>
            <td>{formattedCurrency(totalCost)}</td>
          </tr>
          <tr>
            <td>Profit</td>
            <td>{formattedCurrency(profit)}</td>
          </tr>
          <tr>
            <td>Annualized Profit</td>
            <td>{formattedCurrency(annualProfit)}</td>
          </tr>
          <td colSpan="2">
            <div className="button-container">
            <button className='delete-button' onClick={() => {deleteProperty(property.id)}}>
              Delete
            </button>
            </div>
          </td>
        </tbody>
      </table>
    </div>
  );
}

export default PropertyCard;