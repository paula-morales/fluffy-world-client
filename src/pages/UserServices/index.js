import React, { useEffect } from "react";
import { Container, Col, Row, Image, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfiles } from "../../store/profiles/actions";
import { profilesByIdSelector } from "../../store/profiles/selectors";
import { NavLink } from "react-router-dom";

export default function UserServices() {
  const { iduser } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProfiles);
  }, [dispatch]);
  const profile = useSelector(profilesByIdSelector(parseInt(iduser)));

  return (
    <Container>
      {profile ? (
        <Row className="mt-5">
          <Col>
            <Row>
              <Col>
                <Image
                  style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "100%",
                  }}
                  src={profile.user.profilePicture}
                />
              </Col>
              <Col>
                <Row>Service: Dog walking</Row>
                <Row>{profile.title}</Row>
                <Row>{profile.user.firstName}</Row>
                <Row>
                  {" "}
                  <StarRatings
                    rating={profile.rating}
                    starRatedColor="#ebcc34"
                    starEmptyColor="grey"
                    starDimension="20px"
                    starSpacing="5px"
                  />
                </Row>
              </Col>
              <Col>
                <strong>{profile.price}€/h</strong>
              </Col>
            </Row>
            <Row style={{ padding: "2rem" }}>{profile.description}</Row>
            <Row>
              <NavLink to={`/contact/${profile.user.id}`}>
                <Button>Contact {profile.user.firstName}</Button>
              </NavLink>
            </Row>
          </Col>
          <Col>
            <Image src={profile.picture} />
          </Col>
        </Row>
      ) : null}
    </Container>
  );
}
