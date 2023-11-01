import React, { useEffect, useState } from 'react';
import { Route, Switch } from "react-router-dom";
import { useDispatch } from 'react-redux';
import LoginFormPage from "./components/LoginFormPage";
import { restoreUser } from './store/session';

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    dispatch(restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch])

  return (

    isLoaded && (
      <Switch>
        <Route exact path='/'><h1>App</h1></Route>
        <Route exact path={`/login`} component={LoginFormPage} />
      </Switch>
    )

  );
}

export default App;
