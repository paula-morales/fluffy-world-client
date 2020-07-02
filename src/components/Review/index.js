import React from "react";
import { Container, Col, Row, Image } from "react-bootstrap";
import StarRatings from "react-star-ratings";

export default function Review({ image, name, dateCreated, rating, comment }) {
  return (
    <Container>
      <Row className="row justify-content-md-center">
        <Col className="col-1">
          <Image
            style={{ width: "70px", height: "70px", borderRadius: "100%" }}
            src={image}
            alt={image}
          />
        </Col>
        <Col>
          <Row>
            <h4>{name}</h4>
          </Row>
          <Row style={{ lineHeight: 0 }}>
            <p>{dateCreated}</p>
          </Row>
          <StarRatings
            rating={rating}
            starRatedColor="#ebcc34"
            starEmptyColor="grey"
            starDimension="20px"
            starSpacing="5px"
          />
        </Col>
      </Row>
      <Row>
        <p>{comment}</p>
      </Row>
    </Container>
  );
}
