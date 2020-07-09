import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getUserById } from "../../store/userById/action";
import { fetchProfiles } from "../../store/profiles/actions";
import { userByIdSelector } from "../../store/userById/selectors";
import { profilesSelector } from "../../store/profiles/selectors";
import "./userById.css";

export default function UserById() {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const profiles = useSelector(profilesSelector);
  const user = useSelector(userByIdSelector);
  const { firstName, lastName, profilePicture, isOwner } = user;

  useEffect(() => {
    dispatch(fetchProfiles);
    dispatch(getUserById(parseInt(userId)));
  }, [dispatch, userId]);

  let profilesToDisplay = [];
  const displayProfiles = () => {
    const filtered = profiles.filter((prof) => prof.userId === user.id);

    return filtered.map((profile) => (
      <div className="profile-link" key={profile.title}>
        <a href={`/userservice/${profile.id}`}>
          <button className="btn4">{profile.title}</button>
        </a>
      </div>
    ));
  };

  return (
    <>
      <div className="contact">
        <Container>
          {" "}
          <h1>Account</h1>
        </Container>{" "}
      </div>
      {user ? (
        <>
          <Container className="mt-5 mb-5">
            <Row>
              <Col className="col-3">
                <img
                  src={profilePicture}
                  alt={firstName}
                  style={{ width: "200px", height: "200px" }}
                />
              </Col>
              <Col className="mt-3">
                <Row>
                  <h4>
                    {firstName} {lastName}
                  </h4>
                </Row>
              </Col>
            </Row>
          </Container>
          <div className="contact">
            <Container>
              {" "}
              <h1>Registered {isOwner ? "pet" : "services"}</h1>
            </Container>{" "}
          </div>

          <Container className="mt-5 mb-5">
            <div>
              {!profilesToDisplay ? (
                <p style={{ fontSize: "20px" }}>None</p>
              ) : (
                displayProfiles()
              )}
            </div>
          </Container>
        </>
      ) : null}
    </>
  );
}
