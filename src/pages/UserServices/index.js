import React, { useEffect, useState } from "react";
import { Container, Col, Row, Image, Button, Form } from "react-bootstrap";
import { useParams, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import StarRatings from "react-star-ratings";
import moment from "moment";
import { fetchProfiles } from "../../store/profiles/actions";
import { profilesByIdSelector } from "../../store/profiles/selectors";
import { showMessageWithTimeout } from "../../store/appState/actions";
import { selectToken } from "../../store/user/selectors";
import { fetchServices } from "../../store/typeOfServices/actions";
import { typeOfServicesSelector } from "../../store/typeOfServices/selectors";
import { reviewsSelector } from "../../store/reviews/selector";
import { fetchReviews, addReview } from "../../store/reviews/actions";
import { selectUser } from "../../store/user/selectors";
import { fetchFavorites, toggleFavorite } from "../../store/favorites/actions";
import { selectFavorites } from "../../store/favorites/selector";
import Review from "../../components/Review";
import "../RegisterYourService/RegisterYourService.css";
import "./userServices.css";

export default function UserServices() {
  const { idUserService } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const profile = useSelector(profilesByIdSelector(parseInt(idUserService)));
  const typeOfServices = useSelector(typeOfServicesSelector);
  const reviews = useSelector(reviewsSelector);
  const user = useSelector(selectUser);
  const favorites = useSelector(selectFavorites);

  useEffect(() => {
    dispatch(fetchProfiles);
    dispatch(fetchServices);
    dispatch(fetchReviews);
    if (token) {
      dispatch(fetchFavorites);
    }
  }, [dispatch, token]);

  let service; //display the name of service offered
  let reviewsToDisplay; //display reviews
  let average; //display average of rating

  //first we need to fetch the profile
  if (profile) {
    //find the service
    service = typeOfServices.find((service) => {
      return service.id === profile.serviceId;
    });

    //filter the reviews to display
    reviewsToDisplay = reviews.filter((review) => {
      return profile.id === review.userServiceId;
    });

    //if there are reviews, order per date and calculate average rating
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

  //new rating
  function changeRating(newRating, name) {
    setRating(newRating);
  }

  //submit a new review
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
    } else if (user.isCandidate) {
      dispatch(
        showMessageWithTimeout(
          "danger",
          true,
          "You can leave a review only if you are register as owner"
        )
      );
    } else {
      dispatch(addReview(rating, comment, profile.id));
    }
    setRating(0);
    setComment("");
  }

  //to check if the profile is part of your favorites
  let isFavorite;
  if (favorites) {
    isFavorite = favorites.find((fav) => {
      return fav.userServiceId === parseInt(idUserService);
    });
  }
  const toggle = () => {
    dispatch(toggleFavorite(parseInt(idUserService), isFavorite));
  };

  const formReviews = () => (
    <Form
      className="mb-5"
      style={{
        backgroundColor: "#dfeef3",
        padding: "0 40px 50px 40px",
      }}
    >
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
          <textarea
            name="Comment"
            rows="5"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </Row>
      </Form.Group>
      <Button variant="danger" onClick={handlerSubmit}>
        Submit
      </Button>
    </Form>
  );

  return (
    <Container>
      <Container>
        {profile && service ? (
          <Row className="mt-5 details-candidate">
            <Col>
              <Row>
                <Col className="col-4">
                  <Image
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "100%",
                    }}
                    src={profile.user.profilePicture}
                  />
                </Col>
                <Col>
                  <Row>
                    <Col
                      style={{
                        paddingLeft: "0",
                      }}
                    >
                      {" "}
                      Service: {service.name}
                    </Col>
                    {profile.user.isOwner ? null : (
                      <Col className="col-3">
                        <strong>{profile.price}€/h</strong>
                      </Col>
                    )}
                  </Row>
                  <Row>
                    <Col
                      style={{
                        paddingLeft: "0",
                      }}
                    >
                      <h2>{profile.title}</h2>
                    </Col>
                    <Col className="col-3">
                      {token ? (
                        isFavorite ? (
                          <div>
                            <img
                              src={require("../../images/heart.png")}
                              alt="heart"
                              style={{
                                width: "50px",
                                height: "40px",
                                cursor: "pointer",
                              }}
                              onClick={toggle}
                            />
                          </div>
                        ) : (
                          <div
                            style={{
                              marginLeft: "8px",
                            }}
                          >
                            <img
                              src={require("../../images/empty-heart.png")}
                              alt="heart"
                              style={{
                                width: "35px",
                                height: "40px",
                                cursor: "pointer",
                              }}
                              onClick={toggle}
                            />
                          </div>
                        )
                      ) : null}
                    </Col>
                  </Row>
                  <Row>
                    <NavLink to={`/user/${profile.user.id}`}>
                      {profile.user.firstName}
                    </NavLink>
                  </Row>
                  <Row>
                    {" "}
                    <StarRatings
                      rating={average ? average : 0}
                      starRatedColor="#ebcc34"
                      starDimension="20px"
                      starSpacing="5px"
                    />
                  </Row>
                  <Row>
                    {profile.user.languages.length
                      ? profile.user.languages.map((lang) => (
                          <span
                            className="tag"
                            style={{
                              backgroundColor: "#dfeef3",
                              color: "black",
                              fontSize: "15px",
                            }}
                            key={lang.name}
                          >
                            {lang.name}
                          </span>
                        ))
                      : null}
                  </Row>
                  <Row>
                    Available from {profile.availableFrom}h until{" "}
                    {profile.availableUntil}h
                  </Row>
                </Col>
              </Row>
              <Row style={{ padding: "2rem 0", fontSize: "22px" }}>
                "{profile.description}"
              </Row>
              <Row>
                <Col className="justify-content-center text-center">
                  <NavLink to={`/contact/${profile.id}`}>
                    <Button
                      variant="dark"
                      style={{ textTransform: "uppercase" }}
                    >
                      Contact {profile.user.firstName}
                    </Button>
                  </NavLink>
                </Col>
              </Row>
            </Col>
            <Col>
              <Image
                style={{ height: "350px", width: "100%", borderRadius: "3px" }}
                src={profile.picture}
              />
            </Col>
          </Row>
        ) : null}
      </Container>
      <Container
        style={{
          marginTop: "50px",

          backgroundColor: "#dfeef3",
          padding: "40px",
        }}
      >
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
            <h2>No reviews</h2>
          )
        ) : null}
      </Container>
      {user.isOwner ? formReviews() : null}
    </Container>
  );
}
