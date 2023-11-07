import React, { useEffect, useState } from 'react';
import { Route, Switch } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { restoreUser } from './store/session';

//component imports
import Navigation from './components/Navigation';
import Header from './components/Header';
import LandingPage from './components/LandingPage';

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false)


  useEffect(() => {
    dispatch(restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch])

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Switch>
        <Route exact path='/'> <LandingPage /> </Route>
      </Switch>}
    </>
  )

}

export default App;
