import React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2'
import './PropertyCard.css';
// import upfrontCost from '../../../../helpers/upfrontCost';
// import totalHoldingCost from '../../../../helpers/totalHoldingCost'
// import totalCost from '../../../../helpers/totalCost';
// import profit from '../../../../helpers/profit';
// import annualizedProfit from '../../../../helpers/annualizedProfit';

function PropertyCard({ property, userId, onOpenModal, allRepairItems, allHoldingItems }) {
  const dispatch = useDispatch();

  const getRepairItems = (propId, allRepairItems) => {
    let repairItems = []
    for(let item of allRepairItems) {
      if(item.id === propId) {
        repairItems.push({repairName: item.repair_name, repair_cost: item.repair_cost})
      } 
    }
    // console.log('repair items: ', propId, repairItems)
    return repairItems;
  }

  const getHoldingItems = (propId, allHoldingItems) => {
    let holdingItems = []
    for(let item of allHoldingItems) {
      
      if(item.id === propId) {
      holdingItems.push({holdingName: item.holding_name, holding_cost: item.holding_cost})
      }
    }
    // console.log('holding items: ', propId, holdingItems)
    return holdingItems;
  }

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
        Swal.fire({
          icon: "success",
          title: "Your file has been deleted.",
          showConfirmButton: false,
          timer: 1500
        });
      } 
      //if the user cancels the delete
      else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          icon: "error",
          title: "Your property has NOT been deleted.",
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }

  // ------------ NUMBERS RENDER AS DOLLARS ------------ //
  const formattedCurrency = (value) => {
    const number = parseFloat(value);
    return `$${number.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
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
            <td>{formattedCurrency(property.total_upfront_cost)}</td>
          </tr>
          <tr>
            <td>Holding Cost</td>
            <td>{formattedCurrency(property.total_holding_cost)}</td>
          </tr>
          <tr>
            <td>Total Cost</td>
            <td>{formattedCurrency(property.total_cost)}</td>
          </tr>
          <tr>
            <td>Profit</td>
            <td>{formattedCurrency(property.profit)}</td>
          </tr>
          <tr>
            <td>Monthly Profit</td>
            <td>{formattedCurrency(property.monthly_profit)}</td>
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