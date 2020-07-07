import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserById } from "../../store/userById/action";
import { fetchProfiles } from "../../store/profiles/actions";
import { userByIdSelector } from "../../store/userById/selectors";
import { profilesSelector } from "../../store/profiles/selectors";
import { Container, Col, Row } from "react-bootstrap";
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

                <Row>
                  {" "}
                  <p>
                    {firstName} is registered as
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
              <h1>Registered {isOwner ? "pet" : "services"}</h1>
            </Container>{" "}
          </div>

          <Container className="mt-5 mb-5">
            {!profilesToDisplay ? <p>None</p> : displayProfiles()}
          </Container>
        </>
      ) : null}
    </>
  );
}
