import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { profilesSelector } from "../../store/profiles/selectors";
import { Container, Button, Row, Col } from "react-bootstrap";
import { Map, Marker, GoogleApiWrapper, InfoWindow } from "google-maps-react";
import { apiKeyGoogle } from "../../config/constants";
import calculateDistance from "../../calculateDistance";
import { fetchServices } from "../../store/typeOfServices/actions";
import StarRatings from "react-star-ratings";
import "./ProfilesByServiceId.css";

function ProfilesByServiceId({ google, latitude, longitude }) {
  const profiles = useSelector(profilesSelector);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const dispatch = useDispatch();

  const markerClickHandler = (event, profile) => {
    // Remember which place was clicked
    setSelectedProfile(profile);
  };
  useEffect(() => {
    dispatch(fetchServices);
  }, [dispatch, selectedProfile]);

  return (
    <div>
      <Container>
        <Map
          google={google}
          style={{ height: "70vh", width: "80%", position: "relative" }}
          zoom={15}
          initialCenter={{
            lat: latitude,
            lng: longitude,
          }}
          gestureHandling="cooperative"
        >
          <Marker
            name="owner"
            options={{
              icon: {
                url: require("../../images/icon-house.ico"),
                scaledSize: { width: 64, height: 64 },
              },
            }}
            position={{
              lat: latitude,
              lng: longitude,
            }}
          />
          {profiles
            ? profiles.map((profile) => {
                return (
                  <Marker
                    key={profile.id}
                    name={profile.title}
                    options={{
                      icon: {
                        url: require("../../images/icon.ico"),
                        scaledSize: { width: 64, height: 64 },
                      },
                    }}
                    position={{
                      lat: profile.user.latitude,
                      lng: profile.user.longitude,
                    }}
                    onClick={(event) => markerClickHandler(event, profile)}
                  ></Marker>
                );
              })
            : null}
          {selectedProfile && (
            <InfoWindow
              position={{
                lat: selectedProfile.user.latitude * 1,
                lng: selectedProfile.user.longitude * 1,
              }}
              visible={true}
            >
              <div className="storemapper-iw-container">
                <Container>
                  <Row>
                    <Col>
                      <image
                        style={{ width: "160px", height: "100px" }}
                        src={selectedProfile.user.profilePicture}
                        alt={selectedProfile.title}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      {" "}
                      <h5>{selectedProfile.title} </h5>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <h6>
                        {" "}
                        {calculateDistance(
                          latitude,
                          longitude,
                          selectedProfile.user.latitude,
                          selectedProfile.user.longitude
                        ).toFixed(2)}{" "}
                        km far from you
                      </h6>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <StarRatings
                        rating={selectedProfile.user.rating}
                        starRatedColor="#ebcc34"
                        starEmptyColor="grey"
                        starDimension="20px"
                        starSpacing="5px"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <h6>Price: {selectedProfile.price}€/hour</h6>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      {" "}
                      <h6>{selectedProfile.description}</h6>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <a href={`/userservice/${selectedProfile.user.id}`}>
                        <Button variant="danger">See details</Button>
                      </a>
                    </Col>
                  </Row>
                </Container>
              </div>
            </InfoWindow>
          )}
        </Map>{" "}
      </Container>
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: apiKeyGoogle,
})(ProfilesByServiceId);
