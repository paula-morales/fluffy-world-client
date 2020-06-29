import React, { useEffect, useState } from "react";
import "./Homepage.css";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { typeOfServicesSelector } from "../../store/typeOfServices/selectors";
import { fetchServices } from "../../store/typeOfServices/actions";
import { NavLink } from "react-router-dom";
import Geocode from "react-geocode";
import { apiKeyGoogle } from "../../config/constants";
import ProfilesByServiceId from "../ProfilesByServiceId/ProfilesByServiceId";
import { fetchProfiles } from "../../store/profiles/actions";

export default function Homepage() {
  const [serviceChosen, setServiceChosen] = useState(1);
  const [address, setAddress] = useState();
  const [toggle, setToggle] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchServices);
  }, [dispatch]);

  const services = useSelector(typeOfServicesSelector);

  console.log("looking for", serviceChosen, "in", address);
  // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
  Geocode.setApiKey(apiKeyGoogle);

  // set response language. Defaults to english.
  Geocode.setLanguage("en");

  // set response region. Its optional.
  // A Geocoding request with region=es (Spain) will return the Spanish city.
  Geocode.setRegion("nl");
  function getLatLong() {
    // Get latidude & longitude from address.

    Geocode.fromAddress(address).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        console.log(lat, lng);
        setToggle(true);
        dispatch(fetchProfiles);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  return (
    <div>
      <div className="header">
        <Container>
          <Row>
            <Col className="text-pets">Pets deserve the best care</Col>
          </Row>
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
                {/* <NavLink to={`/service/${serviceChosen}`}> */}
                <Button
                  onClick={getLatLong}
                  variant="danger"
                  className="button-search"
                >
                  Search
                </Button>
                {/* </NavLink> */}
              </Col>{" "}
            </Row>
          </Form>
        </Container>
      </div>
      {toggle ? <ProfilesByServiceId /> : null}
    </div>
  );
}
