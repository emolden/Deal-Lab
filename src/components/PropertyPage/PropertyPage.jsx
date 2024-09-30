import React from 'react';
import LogOutButton from '../App/LogOutButton/LogOutButton';
import {useSelector} from 'react-redux';
import PropertyList from './PropertyList/PropertyList';
import PropertySearchForm from './PropertySeachForm/PropertySearchForm';

function PropertyPage() {
  // this component doesn't do much to start, just renders some user reducer info to the DOM
  const user = useSelector((store) => store.user);
  return (
    <div className="container">
      <h2>Welcome, {user.username}!</h2>
      <p>Your ID is: {user.id}</p>
      <LogOutButton className="btn" />
      <PropertySearchForm />
      <PropertyList />
    </div>
  );
}

// this allows us to use <App /> in index.js
export default PropertyPage;
