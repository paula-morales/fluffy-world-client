import React, { useState } from "react";
import { useSelector } from "react-redux";
import { profilesSelector } from "../../store/profiles/selectors";
import { Container, Button } from "react-bootstrap";
import { Map, Marker, GoogleApiWrapper, InfoWindow } from "google-maps-react";
import { apiKeyGoogle } from "../../config/constants";
import { Link } from "react-router-dom";

function ProfilesByServiceId(props) {
  const profiles = useSelector(profilesSelector);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const { google, latitude, longitude } = props;

  const markerClickHandler = (event, profile) => {
    // Remember which place was clicked
    setSelectedProfile(profile);
  };
  console.log("selected", selectedProfile);
  return (
    <div>
      <Container>
        <Map
          google={google}
          style={{ height: "70vh", width: "80%", position: "relative" }}
          zoom={13}
          initialCenter={{
            lat: latitude,
            lng: longitude,
          }}
        >
          {profiles
            ? profiles.map((profile) => {
                return (
                  <Marker
                    key={profile.id}
                    name={profile.title}
                    options={{ icon: "https://i.imgur.com/9G5JOp8.png" }}
                    position={{
                      lat: profile.user.latitude,
                      lng: profile.user.longitude,
                    }}
                    onClick={(event) => markerClickHandler(event, profile)}
                  />
                );
              })
            : null}
          {selectedProfile ? (
            <InfoWindow
              position={{
                lat: selectedProfile.user.latitude * 1,
                lng: selectedProfile.user.longitude * 1,
              }}
              visible={true}
            >
              <div>
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
                <p>Rating: {selectedProfile.rating}</p>
                <p>{selectedProfile.description}</p>

                <Button>
                  details
                  {/* <link to={`/profile/:${selectedProfile.userId}`}> */}
                  See {/* </link> */}
                </Button>
              </div>
            </InfoWindow>
          ) : null}
        </Map>{" "}
      </Container>
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: apiKeyGoogle,
})(ProfilesByServiceId);
