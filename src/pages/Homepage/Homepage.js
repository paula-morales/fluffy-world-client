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

export default function Homepage() {
  const [serviceChosen, setServiceChosen] = useState(1);
  const [address, setAddress] = useState();
  const [toggle, setToggle] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [km, setKm] = useState(2);
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
      ) : (
        <Loading />
      )}
    </div>
  );
}
