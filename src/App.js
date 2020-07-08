import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectAppLoading } from "./store/appState/selectors";
import { getUserWithStoredToken } from "./store/user/actions";
import Homepage from "./pages/Homepage/Homepage";
import UserServices from "./pages/UserServices";
import Contact from "./pages/Contact";
import RegisterYourPet from "./pages/RegisterYourPet/RegisterYourPet";
import RegisterYourService from "./pages/RegisterYourService/RegisterYourService";
import UserPersonalAccount from "./pages/UserPersonalAccount";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import UserById from "./pages/UserById";
import Navigation from "./components/Navigation";
import Loading from "./components/Loading";
import MessageBox from "./components/MessageBox";
import "./App.css";

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
        <Route path="/contact/:idprofile" component={Contact} />
        <Route path="/registerpet" component={RegisterYourPet} />
        <Route path="/registerservice" component={RegisterYourService} />
        <Route exact path="/user" component={UserPersonalAccount} />
        <Route path="/user/:userId" component={UserById} />
      </Switch>
    </div>
  );
}

export default App;
