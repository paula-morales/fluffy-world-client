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
import { fetchReviews } from "../../store/reviews/actions";
import { reviewsSelector } from "../../store/reviews/selector";

function ProfilesByServiceId({ google, latitude, longitude }) {
  const profiles = useSelector(profilesSelector);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const dispatch = useDispatch();
  const reviews = useSelector(reviewsSelector);
  console.log("selected", selectedProfile);
  useEffect(() => {
    dispatch(fetchServices);
    dispatch(fetchReviews);
  }, [dispatch, selectedProfile]);

  const markerClickHandler = (event, profile) => {
    // Remember which place was clicked
    setSelectedProfile(profile);
  };

  let average; //display average of rating
  let reviewsToDisplay; //display reviews

  if (selectedProfile) {
    // filter the reviews to display
    reviewsToDisplay = reviews.filter((review) => {
      return selectedProfile.id === review.userServiceId;
    });
    if (reviewsToDisplay.length) {
      average = parseInt(
        reviewsToDisplay.reduce((total, next) => total + next.rating, 0) /
          reviewsToDisplay.length
      );
    }
  }
  return (
    <div>
      <Container>
        <Map
          google={google}
          style={{ height: "500px", width: "1000px", position: "relative" }}
          zoom={13}
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
                        rating={average ? average : 0}
                        starRatedColor="#ebcc34"
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
                      <a href={`/userservice/${selectedProfile.id}`}>
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
