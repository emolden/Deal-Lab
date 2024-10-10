import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { geocodeByPlaceId } from "react-google-places-autocomplete";


function PropertySearchForm({userId}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchBarAddress, setSearchBarAddress] = useState("");
  const [formattedAddress, setFormattedAddress] = useState("");
  const [addressId, setAddressId] = useState("");
  const dispatch = useDispatch();

  //forces GooglePlacesAutocomplete dom render to wait till Google script is loaded
  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC9pViRyFvm5jpR2ezl9PISh66E3ChmqME&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsLoaded(true);
      document.body.appendChild(script);
    };

    loadScript();
  }, []);
  
  
  //sends the formattedAddress to the properties.saga
  const addAddress = (e) => {
    e.preventDefault();
    // ************* THIS GOES IN PAYLOAD.ADDRESS: formattedAddress
    console.log('searchBar address:', searchBarAddress);
    console.log('formattedAddress:', formattedAddress);
    
    
    dispatch ({
        type: 'ADD_PROPERTY',
        payload: {address: formattedAddress , userId: userId, addressId: addressId}
    })
    setSearchBarAddress("");
  } 

    // Runs when search menu is opened, emptying the menu of text
    const menuOpened = () => {
      if (searchBarAddress !== "") {
        setSearchBarAddress("");
      }
    };
    
    //runs when the user clicks on an address from the dropdown menu
    const handleChange = (address) => {
      setSearchBarAddress(address);
      setAddressId(address.value.place_id);
      geocodeByPlaceId(address.value.place_id)
        .then(results => setFormattedAddress(results[0].formatted_address))
        .catch(error => console.error('error getting geocodeByPlaceId', error));
    }


  return (
    <div className="container">
      <p>Property Search Form:</p>

{/* **************UNCOMMENT FROM HERE TO 123**************************** */}
      {isLoaded ? (  
      <GooglePlacesAutocomplete
        apiOptions={{ language: 'en'}}
        autocompletionRequests={{
          componentRestrictions: {
            country: ['us'],
          }
        }}
          selectProps={{
            styles: {
              control: (provided) => ({
            ...provided,
            width: "500px",
            maxWidth: "100%",
            border: "1px solid (rgba(255, 255, 255, 0.41)",
            borderRadius: "10px",
            backdropFilter: "blur(50px)",
              }),
            },
            className: "searchBar", // Provides the component with a class for styling
            isClearable: true, // Allows the textbox to be emptied with X
            onMenuOpen: () => menuOpened(), // Triggers textbox to clear when clicking on it
            value: searchBarAddress,
            onChange: handleChange, //is triggered by the user clicking on an address from the dropdown menu
            placeholder: "Enter an address", // Sets the placeholder for textbox
            // styles: {
            //   input: (provided) => ({
            //     ...provided,
            //     // text color in searchbar
            //     color: "black",
            //   }),
            //   // Removes highlight on hover
            //   option: (provided) => ({
            //     ...provided,
            //     // text color for dropdown menu items
            //     color: "black",
            //     // background color for dropdown menu items (set to black but it is modified by menu styling below to make it transparent)
            //     background: "#00000000",
            //   }),
            //   // 👇 I don't know what this does TBH. -ES 4.24.24
            //   singleValue: (provided) => ({
            //     ...provided,
            //     // color: "blue",
            //     // background:"black"
            //   }),
            //   // this is the searchbar itself
            //   control: (provided) => ({
            //     ...provided,
            //     width: "100%",
            //     // background: 'rgba(255, 255, 255, 0.25)',
            //     border: "1px solid rgba(255, 255, 255, 0.41)",
            //     backdropFilter: "blur(50px)",
            //     borderRadius: "20px",
            //   }),
            //   // styling for dropdown menu
            //   menu: (provided) => ({
            //     ...provided,
            //     width: "100%",
            //     // transparent rainbow gradient 🤓
            //     background:
            //       "linear-gradient(0deg, rgba(236,212,255,0.25) 0%, rgba(214,200,251,0.25) 14%, rgba(194,214,247,0.25) 23%, rgba(201,241,225,0.25) 35%, rgba(209,244,191,0.25) 48%, rgba(246,237,171,0.25) 60%, rgba(255,230,175,0.25) 73%, rgba(255,208,166,0.25) 87%, rgba(255,166,166,0.25004595588235294) 100%)",
            //     border: "1px solid rgba(255, 255, 255, 0.41)",
            //     backdropFilter: "blur(50px)",
            //     borderRadius: "12px",
            //   }),
            //   container: (provided) => ({
            //     ...provided,
            //   }),
            // },
          }}
        />
      ) : (
        <p>Loading...</p>
      )}

      {/* ************** THIS IS DUMMY DATA TO BE DELETED******************************** */}
      {/* <form>
          <label for='addressInput'>Property Address:</label>
          <input className='rentCastInput'
                  name='addressInput'
                  type='text'
                  placeholder='1234 Penny Ln, Liverpool, BL 196700'
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  />
      </form> */}
      {/* ***************DELETE TO HERE **************************************** */}
          <button className="modal-btn-2" onClick={addAddress}>Add</button>
    </div>
  );
}

export default PropertySearchForm;

// 579 County Road B E, Maplewood, MN 55117
// 2006 Kenwood Dr W, Maplewood, MN 55117
// 2295 Gervais Hills Dr, Little Canada, MN 55117