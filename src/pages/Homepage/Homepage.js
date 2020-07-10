import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import Geocode from "react-geocode";
import { fetchServices } from "../../store/typeOfServices/actions";
import { typeOfServicesSelector } from "../../store/typeOfServices/selectors";
import { fetchProfilesByDistance } from "../../store/profiles/actions";
import { showMessageWithTimeout } from "../../store/appState/actions";
import { selectUser } from "../../store/user/selectors";
import Loading from "../../components/Loading";
import DogWalking from "../../components/svg/DogWalking";
import ProfilesByServiceId from "../../components/ProfilesByServiceId/ProfilesByServiceId";
import Aboutus from "../../components/Aboutus";
import { apiKeyGoogle } from "../../config/constants";
import "./Homepage.css";

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

export default function Homepage() {
  const [serviceChosen, setServiceChosen] = useState(1);
  const [toggle, setToggle] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [km, setKm] = useState(2);
  const [query, setQuery] = useState("");
  const autoCompleteRef = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const services = useSelector(typeOfServicesSelector);

  useEffect(() => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${apiKeyGoogle}&libraries=places&language=en`,
      () => handleScriptLoad(setQuery, autoCompleteRef)
    );
  }, []);

  useEffect(() => {
    dispatch(fetchServices);
  }, [dispatch]);

  Geocode.setApiKey(apiKeyGoogle);
  Geocode.setRegion("nl");

  // Get latidude & longitude from address. After, dispatch action
  function handlerClick() {
    if (!query) {
      dispatch(
        showMessageWithTimeout("danger", true, "Please enter your address")
      );
    } else {
      Geocode.fromAddress(query).then(
        (response) => {
          const { lat, lng } = response.results[0].geometry.location;
          setLatitude(lat);
          setLongitude(lng);
          setToggle(true);
          dispatch(fetchProfilesByDistance(serviceChosen, lat, lng, km));
        },
        (error) => {
          console.error(error);
          dispatch(
            showMessageWithTimeout(
              "danger",
              true,
              "Sorry, we could not find the address"
            )
          );
        }
      );
    }
  }

  const displayServices = () =>
    services.map((service) => {
      return (
        <option key={service.id} value={service.id}>
          {service.name}
        </option>
      );
    });

  return (
    <div>
      <div className="container-homepage homepage-1">
        <div className="curved-div upper">
          <svg viewBox="0 0 1440 319">
            <path
              fill="#fff"
              fillOpacity="1"
              d="M0,32L48,48C96,64,192,96,288,96C384,96,480,64,576,48C672,32,768,32,864,42.7C960,53,1056,75,1152,90.7C1248,107,1344,117,1392,122.7L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            ></path>
          </svg>
        </div>
        <div className="curved-div down">
          <div className="text-welcome">
            <div className="text-welcome-container">
              <h1>
                Welcolme{" "}
                {user.firstName ? <span>back, {user.firstName}</span> : null}
              </h1>
              {!user.token ? <h2>Find the best candidate</h2> : null}
              <a href="#middle">
                {" "}
                <button className="button homepage-singup">
                  How does it work?
                </button>
              </a>
            </div>
          </div>

          <div className="image-wrapper">
            <img
              className="image-dog-cat"
              src={require("../../images/background.png")}
              alt="cat-dog"
            />
          </div>
        </div>
      </div>
      <div className="container-homepage homepage-aboutus" id="middle">
        {" "}
        <div className="dog-walking-container">
          <DogWalking />
        </div>
        <Aboutus />
      </div>
      <div className="container-homepage homepage-2" id="look-for">
        <Container className="mt-5">
          <Form>
            {" "}
            <Row className="search-box">
              <Col>
                <Form.Group controlId="looking-for">
                  <Form.Label className="label-text">
                    I am looking for
                  </Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(event) =>
                      setServiceChosen(parseInt(event.target.value))
                    }
                  >
                    {services ? displayServices() : <option>Loading...</option>}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="near">
                  <Form.Label className="label-text">Near</Form.Label>
                  <Form.Control
                    type="address"
                    ref={autoCompleteRef}
                    onChange={(event) => setQuery(event.target.value)}
                    value={query}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="filter-radio">
                  <Form.Label className="label-text">Km</Form.Label>
                  <Form.Control
                    value={km}
                    onChange={(e) => setKm(e.target.value)}
                    as="select"
                  >
                    <option value={2}>2</option>
                    <option value={4}>4</option>
                    <option value={10}>10</option>
                    <option value={1000}>All</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Button
                  variant="dark"
                  onClick={handlerClick}
                  className="button-search"
                >
                  <i
                    className="fa fa-search"
                    aria-hidden="true"
                    style={{ marginRight: "15px" }}
                  ></i>
                  SEARCH
                </Button>
              </Col>{" "}
            </Row>
            {!toggle ? (
              <Row>
                <img
                  className="many-dogs"
                  src={require("../../images/many-dogs.png")}
                  alt="dogs"
                />
              </Row>
            ) : null}
          </Form>
        </Container>
        {toggle ? (
          <ProfilesByServiceId latitude={latitude} longitude={longitude} />
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
}
