import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
// import { StandaloneSearchBox, LoadScript } from "@react-google-maps/api"

import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";

function PropertySearchForm({userId}) {
  

  const dispatch = useDispatch();
  const [address, setAddress] = useState('');
  const [searchBarAddress, setSearchBarAddress] = useState("");

  const addAddress = (e) => {
    e.preventDefault();
    dispatch ({
        type: 'ADD_PROPERTY',
        payload: {address: address, userId: userId}
    })
  } 


  useEffect(() => {
    //if (searchBarAddress !== '') {
    menuClosed();
  }, [searchBarAddress]);

  // Runs when search menu is closed, allowing whatever has been selected to be sent to sendLocation()
  const menuClosed = () => {
    if (searchBarAddress === "") {
      console.log("Search bar is empty");
    } else {
      // sendLocation();
    }
  };
  // Runs when search menu is opened, emptying the menu of text
  const menuOpened = () => {
    if (searchBarAddress !== "") {
      setSearchBarAddress("");
    }
  };

  const handleChange = (address) => {
    setSearchBarAddress(address);
  }

  return (
    <div className="container">
      <p>Property Search Form:</p>
      {/* <LoadScript
        googelMapsApiKey = {process.env.GOOGLE_API_KEY}
        libraryies={["places"]}
      >
        <StandaloneSearchBox
          onLoad= {searchBarAddress}
          onPlacesChanged = {handleChange}
        >
          <input
            type="text"
            placeholder="Enter Address"
          />
        </StandaloneSearchBox>
      </LoadScript> */}
      <GooglePlacesAutocomplete
          selectProps={{
            // className: "searchBar", // Provides the component with a class for styling
            isClearable: true, // Allows the textbox to be emptied with X
            onBlur: () => menuClosed(), // Triggers menuClosed() when clicking off of the textbox
            onMenuOpen: () => menuOpened(), // Triggers textbox to clear when clicking on it
            value: searchBarAddress,
            onChange: handleChange,
            placeholder: "Enter an address", // Sets the placeholder for textbox
            styles: {
              input: (provided) => ({
                ...provided,
                // text color in searchbar
                color: "black",
              }),
              // Removes highlight on hover
              option: (provided) => ({
                ...provided,
                // text color for dropdown menu items
                color: "black",
                // background color for dropdown menu items (set to black but it is modified by menu styling below to make it transparent)
                background: "#00000000",
              }),
              // 👇 I don't know what this does TBH. -ES 4.24.24
              singleValue: (provided) => ({
                ...provided,
                // color: "blue",
                // background:"black"
              }),
              // this is the searchbar itself
              control: (provided) => ({
                ...provided,
                width: "100%",
                // background: 'rgba(255, 255, 255, 0.25)',
                border: "1px solid rgba(255, 255, 255, 0.41)",
                backdropFilter: "blur(50px)",
                borderRadius: "20px",
              }),
              // styling for dropdown menu
              menu: (provided) => ({
                ...provided,
                width: "100%",
                // transparent rainbow gradient 🤓
                background:
                  "linear-gradient(0deg, rgba(236,212,255,0.25) 0%, rgba(214,200,251,0.25) 14%, rgba(194,214,247,0.25) 23%, rgba(201,241,225,0.25) 35%, rgba(209,244,191,0.25) 48%, rgba(246,237,171,0.25) 60%, rgba(255,230,175,0.25) 73%, rgba(255,208,166,0.25) 87%, rgba(255,166,166,0.25004595588235294) 100%)",
                border: "1px solid rgba(255, 255, 255, 0.41)",
                backdropFilter: "blur(50px)",
                borderRadius: "12px",
              }),
              container: (provided) => ({
                ...provided,
              }),
            },
          }}
          // 👇 biases autocomplete search results to locations near IP address
          // ipbias
        />
      <form>
          <label for='addressInput'>Property Address:</label>
          <input className='rentCastInput'
                  name='addressInput'
                  type='text'
                  placeholder='1234 Penny Ln, Liverpool, BL 196700'
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  />
          <button onClick={addAddress}>Add</button>
      </form>

    </div>
  );
}

export default PropertySearchForm;

// 579 County Road B E, Maplewood, MN 55117
// 2006 Kenwood Dr W, Maplewood, MN 55117
// 2295 Gervais Hills Dr, Little Canada, MN 55117