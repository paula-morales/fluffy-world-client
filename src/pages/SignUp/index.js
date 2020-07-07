import React, { useState, useEffect } from "react";
import { signUp } from "../../store/user/actions";
import { selectUser } from "../../store/user/selectors";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import Geocode from "react-geocode";
import { apiKeyGoogle } from "../../config/constants";
import { showMessageWithTimeout } from "../../store/appState/actions";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { languageList } from "../../config/languagesList";
import "./Signup.css";
import SignupSVG from "../../components/svg/SignupSVG";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [language, setLanguage] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const history = useHistory();
  const [radioValue, setRadioValue] = useState("");

  const radios = [
    { name: "I am a pet owner", value: "1" },
    { name: "I want to offer pet services", value: "2" },
  ];

  useEffect(() => {
    if (user.isOwner) {
      history.push("/registerpet");
    } else if (user.isCandidate) {
      history.push("/registerservice");
    }
  }, [user, history]);

  Geocode.setApiKey(apiKeyGoogle);
  Geocode.setRegion("nl");

  //to set languages chosen

  function addLanguage() {
    var input = document.getElementById("inputLanguage");
    setLanguage([...language, input.value]);
    input.value = "";
  }

  let isOwner = false;
  let isCandidate = false;

  function submitForm(event) {
    event.preventDefault();
    if (radioValue === "1") {
      isOwner = true;
      isCandidate = false;
    } else if (radioValue === "2") {
      isOwner = false;
      isCandidate = true;
    }
    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !email ||
      !password ||
      !address ||
      !language.length ||
      (!isOwner && !isCandidate) ||
      (isOwner && isCandidate)
    ) {
      dispatch(
        showMessageWithTimeout("danger", true, "Please fill out all the fields")
      );
    } else {
      Geocode.fromAddress(address).then(
        (response) => {
          const { lat, lng } = response.results[0].geometry.location;

          dispatch(
            signUp(
              firstName,
              lastName,
              profilePicture,
              phoneNumber,
              lat,
              lng,
              language,
              email,
              password,
              isOwner,
              isCandidate
            )
          );
        },
        (error) => {
          dispatch(
            showMessageWithTimeout(
              "danger",
              true,
              "Sorry, we did not find the address"
            )
          );
        }
      );
    }

    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setPhoneNumber("");
    setAddress("");
    setRadioValue("");
    setProfilePicture("");
    setLanguage([]);
  }

  return (
    <div className="form-container">
      <div className="form-container-2">
        {" "}
        <div className="sign-up">
          <strong>Sign up</strong>
        </div>
        <div className="items-container">
          <div className="inputs-container first-name">
            <label>First Name</label>
            <input
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              placeholder="Enter first name"
              className="form-item"
            />
          </div>
          <div className="inputs-container last-name">
            <label>Last Name</label>
            <input
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              placeholder="Enter last name"
              className="form-item"
            />
          </div>
        </div>
        <div className="items-container">
          <div className="inputs-container phone-number">
            <label>Phone number</label>
            <input
              type="number"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder="Enter phone number"
              className="form-item"
            />
          </div>
          <div className="inputs-container profile-picture">
            <label>Profile picture url</label>
            <input
              value={profilePicture}
              onChange={(event) => setProfilePicture(event.target.value)}
              placeholder="Enter picture url"
              className="form-item"
            />
          </div>
        </div>
        <div className="items-container">
          <div className="inputs-container address">
            <label>Address</label>
            <input
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Enter address"
              className="form-item"
            />
          </div>
        </div>
        <div className="items-container">
          <Autocomplete
            id="inputLanguage"
            options={languageList}
            getOptionLabel={(option) => option.title}
            style={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Language" variant="outlined" />
            )}
          />
          <button
            className="button-add"
            type="button"
            id="add"
            onClick={addLanguage}
          >
            Add{" "}
          </button>{" "}
          {language
            ? language.length
              ? language.map((lang) => (
                  <div className="tag" key={lang}>
                    {lang}
                  </div>
                ))
              : null
            : null}
        </div>
        <div className="items-container">
          <div className="inputs-container email">
            <label>Email</label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter email"
              className="form-item"
              type="email"
            />
          </div>
        </div>
        <div className="items-container">
          <div className="inputs-container password">
            <label>Password</label>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              className="form-item"
              type="password"
            />
          </div>
        </div>
        <div className="items-container">
          <fieldset>
            {radios.map((radio, idx) => (
              <div key={idx}>
                <input
                  type="radio"
                  value={radio.value}
                  checked={radioValue === radio.value}
                  onChange={(e) => {
                    setRadioValue(e.currentTarget.value);
                  }}
                  name="formHorizontalRadios"
                  id={`formHorizontalRadios${radio.value}`}
                />
                <label
                  className="label-radio"
                  htmlFor={`formHorizontalRadios${radio.value}`}
                >
                  {radio.name}
                </label>
              </div>
            ))}
          </fieldset>
        </div>
        <div className="button-container">
          <button className="button-signup" onClick={submitForm}>
            Sign up
          </button>
          <br />
          <label>Already have an account?</label>
          <Link
            to="/login"
            style={{ paddingBottom: "5rem", marginLeft: "0.5rem" }}
          >
            Log in
          </Link>
        </div>
      </div>

      <div className="sign-up-svg">
        <SignupSVG />
      </div>
    </div>
  );
}
