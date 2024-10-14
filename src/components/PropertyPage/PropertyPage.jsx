import React from 'react';
import LogOutButton from '../App/LogOutButton/LogOutButton';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import PropertyList from './PropertyList/PropertyList';
import PropertySearchForm from './PropertySeachForm/PropertySearchForm';
import PropertyModal from './PropertyModal/PropertyModal';
import './PropertyModal/PropertyModal.css';
import Swal from 'sweetalert2';

function PropertyPage({ userId }) {
  
  const user = useSelector((store) => store.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  // const [dataFromDatabase, setDataFromDatabase] = useState({})

  const handleOpenModal = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleCloseModal = (propertyOfInterest, dataFromDatabase) => {
   console.log('properyofinterest: ', propertyOfInterest)
    console.log('datafromdatabase: ', dataFromDatabase)
    const purchasePriceFromDatabase = dataFromDatabase.purchase_price
    const purchasePrice = propertyOfInterest.property[0].purchase_price
    let formattedPurchasePriceFromDatabase = '';
    let formattedPurchasePrice = '';
    for(let char of purchasePriceFromDatabase) {
      let breakCondition = false
      if(char === ".") {
        breakCondition = true
      }
      else if (!breakCondition) {
        formattedPurchasePriceFromDatabase += char;
      }
    }
    for(let char of purchasePrice) {
      let breakCondition = false
      if(char === ".") {
        breakCondition = true
      }
      else if (!breakCondition) {
        formattedPurchasePrice += char;
      }
    }
    console.log('formattedpurchasepricefromdatabase: ', formattedPurchasePriceFromDatabase)
    if(formattedPurchasePrice != formattedPurchasePriceFromDatabase) {
      Swal.fire({
        icon: "error",
        title: "Default Settings have NOT been applied.",
        showConfirmButton: false,
        timer: 1500
      });
    }
    else {
      setIsModalOpen(false);
      setSelectedProperty(null);
    }
  };
  
  return (
    <div className="container">
      {/* <h2>Welcome, {user.username}!</h2> */}
      <PropertySearchForm userId={userId}/>
      <PropertyList userId={userId} onOpenModal={handleOpenModal} />
      <PropertyModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        propertyCard={selectedProperty}/>
    </div>
  );
}

// this allows us to use <App /> in index.js
export default PropertyPage;
