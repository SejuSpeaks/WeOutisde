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
import DetailsOfEvent from './components/EventDetails/DetailsOfEvent/DetailsOfEvent';
import AllEvents from './components/AllEvents/AllEvents/AllEvents';
import CreateGroupForm from './components/CreateGroupForm/CreateGroupForm/CreateGroupForm';

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
        <Route exact path='/groups/new'> <CreateGroupForm /> </Route>
        <Route path='/groups/:groupId'><GroupDetails /></Route>
        <Route path='/events/:eventId'> <DetailsOfEvent /> </Route>
        <Route exact path='/events'> <AllEvents /> </Route>
      </Switch>}
    </>
  )

}

export default App;
