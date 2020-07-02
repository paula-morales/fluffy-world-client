import React, { useEffect, useState } from "react";
import { Container, Col, Row, Image, Button, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfiles } from "../../store/profiles/actions";
import { profilesByIdSelector } from "../../store/profiles/selectors";
import { NavLink } from "react-router-dom";
import Review from "../../components/Review";
import { showMessageWithTimeout } from "../../store/appState/actions";
import { selectToken } from "../../store/user/selectors";
import { fetchServices } from "../../store/typeOfServices/actions";
import { typeOfServicesSelector } from "../../store/typeOfServices/selectors";
import moment from "moment";
import { reviewsSelector } from "../../store/reviews/selector";
import { fetchReviews, addReview } from "../../store/reviews/actions";

export default function UserServices() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { iduser } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProfiles);
    dispatch(fetchServices);
    dispatch(fetchReviews);
  }, [dispatch]);

  const profile = useSelector(profilesByIdSelector(parseInt(iduser)));
  const token = useSelector(selectToken);
  const typeOfServices = useSelector(typeOfServicesSelector);
  const reviews = useSelector(reviewsSelector);

  let service;
  let reviewsToDisplay;
  let average;
  if (profile) {
    service = typeOfServices.find((service) => {
      return service.id === profile.serviceId;
    });
    reviewsToDisplay = reviews.filter((review) => {
      return profile.id === review.userServiceId;
    });

    if (reviews.length) {
      reviewsToDisplay.sort(function compare(a, b) {
        var dateA = new Date(a.createdAt);
        var dateB = new Date(b.createdAt);
        return dateB - dateA;
      });

      average = parseInt(
        reviewsToDisplay.reduce((total, next) => total + next.rating, 0) /
          reviewsToDisplay.length
      );
    }
  }

  function changeRating(newRating, name) {
    setRating(newRating);
  }

  function handlerSubmit(e) {
    e.preventDefault();

    if (!comment || !rating) {
      dispatch(
        showMessageWithTimeout("danger", true, "Please fill out all the fields")
      );
    } else if (token === null) {
      dispatch(
        showMessageWithTimeout(
          "danger",
          true,
          "You need to log in to leave a comment"
        )
      );
    } else {
      dispatch(addReview(rating, comment, profile.id));
    }
    setRating(0);
    setComment("");
  }

  return (
    <Container>
      <Container>
        {profile && service ? (
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
                  <Row>Service: {service.name}</Row>
                  <Row>{profile.title}</Row>
                  <Row>{profile.user.firstName}</Row>
                  <Row>
                    {" "}
                    <StarRatings
                      rating={average ? average : 0}
                      starRatedColor="#ebcc34"
                      starDimension="20px"
                      starSpacing="5px"
                    />
                  </Row>
                </Col>

                {profile.user.isOwner ? null : (
                  <Col>
                    <strong>{profile.price}€/h</strong>
                  </Col>
                )}
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
      <Container>
        {reviewsToDisplay ? (
          reviewsToDisplay.length ? (
            <div>
              {" "}
              <h2>Reviews ({reviewsToDisplay.length})</h2>
              {reviewsToDisplay.map((review, i) => (
                <Review
                  key={i}
                  image={review.user.profilePicture}
                  name={review.user.firstName}
                  dateCreated={moment(review.createdAt).format(
                    "DD-MM-YYYY HH:MM"
                  )}
                  rating={review.rating}
                  comment={review.comment}
                />
              ))}
            </div>
          ) : (
            <h2>No reviews yet</h2>
          )
        ) : null}
      </Container>
      <Form>
        <Form.Group>
          <Row>
            <Form.Label>Leave a review</Form.Label>
          </Row>

          <Row>
            {" "}
            <StarRatings
              rating={rating}
              starRatedColor="#ebcc34"
              changeRating={changeRating}
              numberOfStars={5}
              name="rating"
              starDimension="35px"
              starSpacing="5px"
            />
          </Row>
        </Form.Group>
        <Form.Group>
          <Row>
            <Form.Label>Comment</Form.Label>
          </Row>
          <Row>
            <Form.Control
              value={comment}
              type="text"
              onChange={(e) => setComment(e.target.value)}
            />
          </Row>
        </Form.Group>
        <Button variant="danger" onClick={handlerSubmit}>
          Submit
        </Button>
      </Form>
    </Container>
  );
}
