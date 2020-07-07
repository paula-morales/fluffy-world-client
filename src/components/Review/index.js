import React from "react";
import { Container, Col, Row, Image } from "react-bootstrap";
import StarRatings from "react-star-ratings";

export default function Review({ image, name, dateCreated, rating, comment }) {
  return (
    <Container className="mt-4">
      <Row className="row justify-content-md-center">
        <Col className="col-1">
          <Image
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "100%",
            }}
            src={image}
            alt={image}
          />
        </Col>
        <Col>
          {" "}
          <Row className="mb-2">
            <h5>{name}</h5>
          </Row>
          <Row style={{ lineHeight: 0 }}>
            <p>{dateCreated}</p>
          </Row>
        </Col>
      </Row>{" "}
      <StarRatings
        rating={rating}
        starRatedColor="#403d50"
        starEmptyColor="grey"
        starDimension="20px"
        starSpacing="5px"
      />
      <Row>
        <p>{comment}</p>
      </Row>
    </Container>
  );
}
