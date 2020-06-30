import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { profilesSelector } from "../../store/profiles/selectors";
import { Container, Button } from "react-bootstrap";
import { Map, Marker, GoogleApiWrapper, InfoWindow } from "google-maps-react";
import { apiKeyGoogle } from "../../config/constants";
import calculateDistance from "../../calculateDistance";
import { fetchServices } from "../../store/typeOfServices/actions";
import StarRatings from "react-star-ratings";

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
  console.log("selected", selectedProfile);
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
              <div>
                <p>
                  {calculateDistance(
                    latitude,
                    longitude,
                    selectedProfile.user.latitude,
                    selectedProfile.user.longitude
                  ).toFixed(2)}{" "}
                  km far
                </p>
                <h5>{selectedProfile.title}</h5>
                <image
                  style={{ width: "20px", height: "20px" }}
                  src={selectedProfile.picture}
                  alt={selectedProfile.title}
                />
                <p>Price: {selectedProfile.price}€/h</p>
                <image
                  style={{ width: "20px", height: "20px" }}
                  src={selectedProfile.user.profilePicture}
                  alt={selectedProfile.title}
                />
                {/* <p>Rating: {selectedProfile.rating}</p> */}
                <StarRatings
                  rating={4}
                  starRatedColor="#ebcc34"
                  starEmptyColor="grey"
                  starDimension="20px"
                  starSpacing="5px"
                />
                <p>{selectedProfile.description}</p>
                <a href={`/userservice/${selectedProfile.user.id}`}>
                  <Button variant="danger">See details</Button>
                </a>
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
