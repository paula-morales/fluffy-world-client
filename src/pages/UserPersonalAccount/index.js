import React, { useEffect } from "react";
import { Jumbotron, Container } from "react-bootstrap";
import { selectUser } from "../../store/user/selectors";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavorites } from "../../store/favorites/actions";
import { selectFavorites } from "../../store/favorites/selector";
import { selectToken } from "../../store/user/selectors";
import { fetchProfiles } from "../../store/profiles/actions";
import { useHistory, NavLink } from "react-router-dom";
import { profilesSelector } from "../../store/profiles/selectors";

export default function UserPersonalAccount() {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const history = useHistory();

  useEffect(() => {
    if (token) {
      dispatch(fetchProfiles);
      dispatch(fetchFavorites);
    } else if (token === null) {
      history.push("/");
    }
  }, [dispatch, token, history]);

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

  let favProfilesToDisplay = [];
  const displayFavorites = () => {
    favorites.forEach((fav) => {
      const filtered = profiles.filter((prof) => prof.id === fav.userServiceId);
      favProfilesToDisplay.push(filtered[0]);
    });

    return favProfilesToDisplay.map((profile) => (
      <p key={profile.title}>
        <NavLink to={`/userservice/${profile.id}`}>{profile.title}</NavLink>
      </p>
    ));
  };

  let profilesToDisplay = [];
  const displayProfiles = () => {
    const filtered = profiles.filter((prof) => prof.userId === user.id);

    return filtered.map((profile) => (
      <p key={profile.title}>
        <NavLink to={`/userservice/${profile.id}`}>{profile.title}</NavLink>
      </p>
    ));
  };
  return (
    <>
      <Jumbotron>
        <Container>Your account</Container>
      </Jumbotron>
      <Container>
        <img src={profilePicture} alt={email} />
        <p>
          Full Name: {firstName} {lastName}
        </p>
        <p>Email: {email}</p>
        <p>Phone number: {phoneNumber}</p>
        <p>
          You are registered as
          {isOwner ? <strong> Owner</strong> : <strong> Candidate</strong>}
        </p>
      </Container>
      <Jumbotron>
        <Container>Your favorites</Container>
      </Jumbotron>
      <Container>
        {!favorites ? (
          <p>You don't have any favorites at the moment</p>
        ) : (
          displayFavorites()
        )}
      </Container>

      <Jumbotron>
        <Container>Your {isOwner ? "pet" : "services"} </Container>
      </Jumbotron>
      <Container>
        {!profilesToDisplay ? (
          <p>You don't have any {isOwner ? "pet" : "services"}</p>
        ) : (
          displayProfiles()
        )}
      </Container>
    </>
  );
}
