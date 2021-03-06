import React, { useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { selectUser } from "../../store/user/selectors";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavorites } from "../../store/favorites/actions";
import { selectFavorites } from "../../store/favorites/selector";
import { selectToken } from "../../store/user/selectors";
import { fetchProfiles } from "../../store/profiles/actions";
import { useHistory } from "react-router-dom";
import { profilesSelector } from "../../store/profiles/selectors";
import "../UserById/userById.css";

export default function UserPersonalAccount() {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const history = useHistory();
  const favorites = useSelector(selectFavorites);
  const profiles = useSelector(profilesSelector);
  const user = useSelector(selectUser);
  const {
    email,
    firstName,
    lastName,
    phoneNumber,
    profilePicture,
    isOwner,
  } = user;

  useEffect(() => {
    if (token) {
      dispatch(fetchProfiles);
      dispatch(fetchFavorites);
    } else if (token === null) {
      history.push("/");
    }
  }, [dispatch, token, history]);

  let favProfilesToDisplay = [];
  const displayFavorites = () => {
    favorites.forEach((fav) => {
      const filtered = profiles.filter((prof) => prof.id === fav.userServiceId);
      favProfilesToDisplay.push(filtered[0]);
    });

    return (
      <div className="profile-link">
        {favProfilesToDisplay.length ? (
          favProfilesToDisplay.map((profile) => (
            <a href={`/userservice/${profile.id}`} key={profile.title}>
              <button className="btn4">{profile.title}</button>
            </a>
          ))
        ) : (
          <p style={{ fontSize: "20px" }}>You don't have any favorites yet.</p>
        )}
      </div>
    );
  };

  let profilesToDisplay = [];
  const displayProfiles = () => {
    const filtered = profiles.filter((prof) => prof.userId === user.id);

    return (
      <div className="profile-link">
        {filtered.map((profile) => (
          <a href={`/userservice/${profile.id}`} key={profile.title}>
            <button className="btn4">{profile.title}</button>
          </a>
        ))}
      </div>
    );
  };
  return (
    <>
      <div className="contact">
        <Container>
          {" "}
          <h1>Your account</h1>
        </Container>{" "}
      </div>
      <Container className="mt-5 mb-5">
        <Row>
          <Col className="col-3">
            <img
              src={profilePicture}
              alt={email}
              style={{ width: "200px", height: "200px" }}
            />
          </Col>
          <Col className="mt-3">
            <Row>
              <h4>
                {firstName} {lastName}
              </h4>
            </Row>
            <Row className="mt-2">
              <p>Email: {email}</p>
            </Row>

            <Row>
              <p>Phone number: {phoneNumber}</p>
            </Row>
            <Row>
              {" "}
              <p>
                You are registered as
                {isOwner ? (
                  <strong> owner</strong>
                ) : (
                  <strong> candidate</strong>
                )}
              </p>
            </Row>
          </Col>
        </Row>
      </Container>
      <div className="contact">
        <Container>
          {" "}
          <h1>Your favorites</h1>
        </Container>{" "}
      </div>
      <Container className="mt-5 mb-5">
        {!favorites ? (
          <p>You don't have any favorites at the moment</p>
        ) : (
          displayFavorites()
        )}
      </Container>
      <div className="contact">
        <Container>
          {" "}
          <h1>Your {isOwner ? "pet" : "services"}</h1>
        </Container>{" "}
      </div>

      <Container className="mt-4 mb-5">
        {!profilesToDisplay ? (
          <p>You don't have any {isOwner ? "pet" : "services"}</p>
        ) : (
          displayProfiles()
        )}
      </Container>
    </>
  );
}
