import React, { useEffect, useState } from "react";
import "./Homepage.css";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { typeOfServicesSelector } from "../../store/typeOfServices/selectors";
import { fetchServices } from "../../store/typeOfServices/actions";
import Geocode from "react-geocode";
import { apiKeyGoogle } from "../../config/constants";
import ProfilesByServiceId from "../ProfilesByServiceId/ProfilesByServiceId";
import { fetchProfilesByDistance } from "../../store/profiles/actions";
import { showMessageWithTimeout } from "../../store/appState/actions";
import Loading from "../../components/Loading";
import DogWalking from "../../components/svg/DogWalking";
import { selectUser } from "../../store/user/selectors";

export default function Homepage() {
  const [serviceChosen, setServiceChosen] = useState(1);
  const [address, setAddress] = useState();
  const [toggle, setToggle] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [km, setKm] = useState(2);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    dispatch(fetchServices);
  }, [dispatch]);

  const services = useSelector(typeOfServicesSelector);

  // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
  Geocode.setApiKey(apiKeyGoogle);
  Geocode.setRegion("nl");

  // Get latidude & longitude from address.
  function getCoordinates() {
    if (!address) {
      dispatch(
        showMessageWithTimeout("danger", true, "Please enter your address")
      );
    } else {
      Geocode.fromAddress(address).then(
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
              {!user.token ? (
                <>
                  <h2>Sign up and find pet friends around you!</h2>
                  <a href="/signup">
                    {" "}
                    <button className="button sign-up">Sign up</button>
                  </a>
                </>
              ) : null}
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

      <div className="container-homepage homepage-2">
        <div className="dog-walking-container">
          <DogWalking />
        </div>

        <Container>
          <Form>
            {" "}
            <Row className="search-box">
              <Col>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label className="label-text">
                    I am looking for
                  </Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(event) =>
                      setServiceChosen(parseInt(event.target.value))
                    }
                  >
                    {services
                      ? services.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.name}
                          </option>
                        ))
                      : null}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label className="label-text">Near</Form.Label>
                  {/* <SearchLocationInput onChange={() => null} /> */}
                  <Form.Control
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    type="text"
                    placeholder="Enter your address"
                    required
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
                  onClick={getCoordinates}
                  className="button-search"
                >
                  Search
                </Button>
              </Col>{" "}
            </Row>
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
