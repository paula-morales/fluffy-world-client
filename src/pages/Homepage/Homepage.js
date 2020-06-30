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

export default function Homepage() {
  const [serviceChosen, setServiceChosen] = useState(1);
  const [address, setAddress] = useState();
  const [toggle, setToggle] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchServices);
  }, [dispatch]);

  const services = useSelector(typeOfServicesSelector);

  // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
  Geocode.setApiKey(apiKeyGoogle);
  Geocode.setRegion("nl");

  // Get latidude & longitude from address.
  function getCoordinates() {
    Geocode.fromAddress(address).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setLatitude(lat);
        setLongitude(lng);
        setToggle(true);
        dispatch(fetchProfilesByDistance(serviceChosen, lat, lng));
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
                <Button
                  onClick={getCoordinates}
                  variant="danger"
                  className="button-search"
                >
                  Search
                </Button>
              </Col>{" "}
            </Row>
          </Form>
        </Container>
      </div>
      {toggle ? (
        <ProfilesByServiceId latitude={latitude} longitude={longitude} />
      ) : null}
    </div>
  );
}
