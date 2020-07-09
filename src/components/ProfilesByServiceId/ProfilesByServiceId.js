import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import StarRatings from "react-star-ratings";
import { Map, Marker, GoogleApiWrapper, InfoWindow } from "google-maps-react";
import { profilesSelector } from "../../store/profiles/selectors";
import { fetchServices } from "../../store/typeOfServices/actions";
import { fetchReviews } from "../../store/reviews/actions";
import { reviewsSelector } from "../../store/reviews/selector";
import calculateDistance from "../../calculateDistance";
import { apiKeyGoogle } from "../../config/constants";
import "./ProfilesByServiceId.css";

function ProfilesByServiceId({ google, latitude, longitude }) {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const dispatch = useDispatch();
  const profiles = useSelector(profilesSelector);
  const reviews = useSelector(reviewsSelector);

  useEffect(() => {
    dispatch(fetchServices);
    dispatch(fetchReviews);
  }, [dispatch, selectedProfile]);

  let average; //display average of rating
  let reviewsToConsider; //By userServiceId

  if (selectedProfile) {
    reviewsToConsider = reviews.filter(
      (review) => selectedProfile.id === review.userServiceId
    );
    if (reviewsToConsider.length) {
      average = parseInt(
        reviewsToConsider.reduce((total, next) => total + next.rating, 0) /
          reviewsToConsider.length
      );
    }
  }
  return (
    <div className="map-container-1">
      <div className="map-container">
        <Map
          className="google-map"
          google={google}
          zoom={14}
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
                    onClick={(event) => setSelectedProfile(profile)}
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
                <div className="container-info">
                  <div className="info-item 1">
                    <img
                      src={selectedProfile.picture}
                      alt={selectedProfile.title}
                    />
                  </div>
                  <div className="info-item 2">
                    <h3>{selectedProfile.title}</h3>
                  </div>
                  <div className="info-item 3">
                    <i>
                      {calculateDistance(
                        latitude,
                        longitude,
                        selectedProfile.user.latitude,
                        selectedProfile.user.longitude
                      ).toFixed(2)}{" "}
                      km far from you
                    </i>
                  </div>
                  <div className="info-item 4">
                    {" "}
                    <StarRatings
                      rating={average ? average : 0}
                      starRatedColor="#ebcc34"
                      starDimension="20px"
                      starSpacing="5px"
                    />
                  </div>
                  {selectedProfile.user.isCandidate ? (
                    <div className="info-item 5">
                      <strong>{selectedProfile.price}€/hour</strong>
                    </div>
                  ) : null}
                  <div className="info-item 6">
                    <a href={`/userservice/${selectedProfile.id}`}>
                      <button className="btn-see-details">See details</button>
                    </a>
                  </div>
                </div>
              </div>
            </InfoWindow>
          )}
        </Map>{" "}
      </div>
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: apiKeyGoogle,
})(ProfilesByServiceId);
