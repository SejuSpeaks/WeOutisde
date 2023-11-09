import React, { useEffect, useState } from 'react';
import { Route, Switch } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { restoreUser } from './store/session';

//component imports
import Navigation from './components/Navigation';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Groups from './components/Groups';
import GroupDetails from './components/GroupDetails';

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
        <Route exact path='/groups'> <Groups /></Route>
        <Route path='/groups/:groupId'><GroupDetails /></Route>
      </Switch>}
    </>
  )

}

export default App;
