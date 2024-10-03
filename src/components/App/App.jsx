import React, { useEffect } from 'react';
import {
  HashRouter as Router, Redirect, Route, Switch,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Footer from '../Footer/Footer';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import PropertyPage from '../PropertyPage/PropertyPage';
import DefaultSettings from '../DefaultSettings/DefaultSettings';
import LandingPage from '../LandingPage/LandingPage';
import LoginPage from '../LoginPage/LoginPage';
import RegisterPage from '../RegisterPage/RegisterPage';
import Header from '../Header/Header';
import './App.css';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';


function App() {

  console.log('app comp is rendering');
  const dispatch = useDispatch();
  const user = useSelector(store => store.user);

  useEffect(() => {  
    dispatch({ type: 'FETCH_USER' });
  }, [dispatch]);


  return (

    <ThemeProvider theme={theme}>
      <>
    <Router>
      <div>
        <Header />
        <Switch>
          <Redirect exact from="/" to="/home" />

          <ProtectedRoute
            exact
            path="/property-page"
          >
            <PropertyPage userId = {user.id}/>
          </ProtectedRoute>

          <ProtectedRoute
            exact
            path="/default-settings"
          >
            <DefaultSettings />
          </ProtectedRoute>

          <Route
            exact
            path="/login"
          >
            {user.id ?
              <Redirect to="/property-page" />
              :
              <LoginPage />
            }
          </Route>

          <Route
            exact
            path="/registration"
          >
            {user.id ?
              <Redirect to="/property-page" />
              :
              <RegisterPage />
            }
          </Route>

          <Route
            exact
            path="/home"
          >
            {user.id ?
              <Redirect to="/property-page" />
              :
              <LandingPage />
            }
          </Route>

          <Route>
            <h1>404</h1>
          </Route>
        </Switch>
        <Footer />
      </div>
    </Router>
    </>
    </ThemeProvider>
  );
}


export default App;