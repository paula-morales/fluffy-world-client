import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import Geocode from "react-geocode";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { signUp } from "../../store/user/actions";
import { selectUser } from "../../store/user/selectors";
import { showMessageWithTimeout } from "../../store/appState/actions";
import { apiKeyGoogle } from "../../config/constants";
import { languageList } from "../../config/languagesList";
import SignupSVG from "../../components/svg/SignupSVG";
import "./Signup.css";

//autocomplete address with Google Places API
let autoComplete;

const loadScript = (url, callback) => {
  let script = document.createElement("script");
  script.type = "text/javascript";

  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
};

function handleScriptLoad(updateQuery, autoCompleteRef) {
  autoComplete = new window.google.maps.places.Autocomplete(
    autoCompleteRef.current,
    { types: ["geocode"], componentRestrictions: { country: "nl" } }
  );
  autoComplete.setFields(["address_components", "formatted_address"]);
  autoComplete.addListener("place_changed", () =>
    handlePlaceSelect(updateQuery)
  );
}

async function handlePlaceSelect(updateQuery) {
  const addressObject = autoComplete.getPlace();
  const query = addressObject.formatted_address;
  updateQuery(query);
}

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [query, setQuery] = useState("");
  const [radioValue, setRadioValue] = useState("");
  const [lang, setLang] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const autoCompleteRef = useRef(null);
  const user = useSelector(selectUser);

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

  useEffect(() => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${apiKeyGoogle}&libraries=places&language=en`,
      () => handleScriptLoad(setQuery, autoCompleteRef)
    );
  }, []);

  Geocode.setApiKey(apiKeyGoogle);
  Geocode.setRegion("nl");

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
      !query ||
      !lang ||
      (!isOwner && !isCandidate) ||
      (isOwner && isCandidate)
    ) {
      dispatch(
        showMessageWithTimeout("danger", true, "Please fill out all the fields")
      );
    } else {
      let language = [];
      lang.map((v) => language.push(v.title));

      Geocode.fromAddress(query).then(
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
    setQuery("");
    setRadioValue("");
    setProfilePicture("");
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
              type="address"
              ref={autoCompleteRef}
              onChange={(event) => setQuery(event.target.value)}
              value={query}
              placeholder="Enter address"
              className="form-item"
            />
          </div>
        </div>
        <div className="items-container">
          <div className="inputs-container language">
            <label>Language</label>
            <Autocomplete
              multiple
              id="inputLanguage"
              size="small"
              style={{ maxWidth: 500, backgroundColor: "#fff" }}
              options={languageList}
              getOptionLabel={(option) => option.title}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" />
              )}
              onChange={(event, newValue) => {
                setLang([...newValue]);
              }}
              value={lang}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                  <Chip label={option.title} {...getTagProps({ index })} />
                ))
              }
            />
          </div>
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
        <SignupSVG className="sign-up-svg" />
      </div>
    </div>
  );
}
