import React from 'react';
import LogOutButton from '../App/LogOutButton/LogOutButton';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import PropertyList from './PropertyList/PropertyList';
import PropertySearchForm from './PropertySeachForm/PropertySearchForm';
import PropertyModal from './PropertyModal/PropertyModal';
import './PropertyModal/PropertyModal.css';

function PropertyPage({ userId }) {
  
  const user = useSelector((store) => store.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const handleOpenModal = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };
  
  return (
    <div className="container">
      <h2>Welcome, {user.username}!</h2>
      <PropertySearchForm userId={userId}/>
      <PropertyList userId={userId} onOpenModal={handleOpenModal}/>
      <PropertyModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        propertyCard={selectedProperty}/>
    </div>
  );
}

// this allows us to use <App /> in index.js
export default PropertyPage;
