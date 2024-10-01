import React from 'react';
import LogOutButton from '../App/LogOutButton/LogOutButton';
import {useSelector} from 'react-redux';
import PropertyList from './PropertyList/PropertyList';
import PropertySearchForm from './PropertySeachForm/PropertySearchForm';
import PropertyModal from './PropertyModal/PropertyModal';

function PropertyPage() {
  
  const user = useSelector((store) => store.user);
  return (
    <div className="container">
      <h2>Welcome, {user.username}!</h2>
      <p>Your ID is: {user.id}</p>
      <LogOutButton className="btn" />
      <PropertySearchForm />
      <PropertyList />
      <PropertyModal />
    </div>
  );
}

// this allows us to use <App /> in index.js
export default PropertyPage;
