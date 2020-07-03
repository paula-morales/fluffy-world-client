import React from "react";
import { Jumbotron, Container } from "react-bootstrap";
import Info from "../../components/UserDetails/Info";
import { selectUser } from "../../store/user/selectors";
import { useSelector } from "react-redux";

export default function UserDetails() {
  const user = useSelector(selectUser);
  const {
    email,
    firstName,
    lastName,
    phoneNumber,
    profilePicture,
    isOwner,
    isCandidate,
  } = user;
  return (
    <>
      <Jumbotron>
        <Container>User </Container>
      </Jumbotron>
      <Info
        email={email}
        firstName={firstName}
        lastName={lastName}
        phoneNumber={phoneNumber}
        profilePicture={profilePicture}
        isOwner={isOwner}
        isCandidate={isCandidate}
      />
    </>
  );
}
