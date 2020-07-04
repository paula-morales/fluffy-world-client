import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserById } from "../../store/userById/action";
import { fetchProfiles } from "../../store/profiles/actions";
import { userByIdSelector } from "../../store/userById/selectors";
import { profilesSelector } from "../../store/profiles/selectors";
import { Jumbotron, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export default function UserById() {
  const { userId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProfiles);
    dispatch(getUserById(parseInt(userId)));
  }, [dispatch, userId]);

  const profiles = useSelector(profilesSelector);
  const user = useSelector(userByIdSelector);

  let profilesToDisplay = [];
  const displayProfiles = () => {
    if (user) {
      const filtered = profiles.filter((prof) => prof.userId === user.id);

      return filtered.map((profile) => (
        <p key={profile.title}>
          <NavLink to={`/userservice/${profile.id}`}>{profile.title}</NavLink>
        </p>
      ));
    }
  };
  const { firstName, lastName, profilePicture, isOwner } = user;
  return (
    <>
      <Jumbotron>
        <Container>Account</Container>
      </Jumbotron>
      {user ? (
        <>
          <Container>
            <img src={profilePicture} alt={firstName} />
            <p>
              Full Name: {firstName} {lastName}
            </p>
            <p>
              {firstName} registered as
              {isOwner ? <strong> owner</strong> : <strong> candidate</strong>}
            </p>
          </Container>

          <Jumbotron>
            <Container>Registered {isOwner ? "pet" : "services"} </Container>
          </Jumbotron>
          <Container>
            {!profilesToDisplay ? <p>None</p> : displayProfiles()}
          </Container>
        </>
      ) : null}
    </>
  );
}
