import React, { useEffect, useState } from 'react';
import { Route, Switch } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { restoreUser } from './store/session';

//component imports
import LoginFormPage from "./components/LoginFormPage";
import SignUp from './components/SignupFormPage';
import Navigation from './components/Navigation';

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false)


  useEffect(() => {
    dispatch(restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch])

  return (
    isLoaded && (
      <div>
        <Navigation isLoaded={isLoaded} /> //profile dropdown not loading on first render after being loged in
        <Switch>
          <Route exact path='/'><h1>App</h1></Route>
          <Route exact path={`/login`} component={LoginFormPage} />
          <Route path='/signup' component={SignUp} />
        </Switch>
      </div>
    )

  );
}

export default App;
