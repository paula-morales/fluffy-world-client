import React, { useEffect } from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Loading from "./components/Loading";
import MessageBox from "./components/MessageBox";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import { useDispatch, useSelector } from "react-redux";
import { selectAppLoading } from "./store/appState/selectors";
import { getUserWithStoredToken } from "./store/user/actions";
import Homepage from "./pages/Homepage/Homepage";
import UserServices from "./pages/UserServices";
import Contact from "./pages/Contact";
import RegisterYourPet from "./pages/RegisterYourPet/RegisterYourPet";
import RegisterYourService from "./pages/RegisterYourService/RegisterYourService";
import UserPersonalAccount from "./pages/UserPersonalAccount";
import UserById from "./pages/UserById";

const Home = () => <Homepage />;

function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectAppLoading);

  useEffect(() => {
    dispatch(getUserWithStoredToken());
  }, [dispatch]);

  return (
    <div className="App">
      <Navigation />
      <MessageBox />
      {isLoading ? <Loading /> : null}
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/signup" component={SignUp} />
        <Route path="/login" component={Login} />
        <Route path="/userservice/:idUserService" component={UserServices} />
        <Route path="/contact/:iduser" component={Contact} />
        <Route path="/registerpet" component={RegisterYourPet} />
        <Route path="/registerservice" component={RegisterYourService} />
        <Route exact path="/user" component={UserPersonalAccount} />
        <Route path="/user/:userId" component={UserById} />
      </Switch>
    </div>
  );
}

export default App;
