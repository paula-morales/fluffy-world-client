import React, { useState, useEffect } from "react";
import { Container, Jumbotron, Form, Col, Button } from "react-bootstrap";
import "./Contact.css";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfiles } from "../../store/profiles/actions";
import { profilesByIdSelector } from "../../store/profiles/selectors";

export default function Contact() {
  const { iduser } = useParams();
  const dispatch = useDispatch();
  const [date, setDate] = useState();
  const [hour, setHour] = useState();
  const [message, setMessage] = useState();
  const profile = useSelector(profilesByIdSelector(parseInt(iduser)));
  console.log(profile);
  useEffect(() => {
    dispatch(fetchProfiles);
  }, [dispatch]);

  return (
    <Container>
      <Jumbotron className="background-dog">
        <h1>Contact form</h1>
      </Jumbotron>
      <Form as={Col} md={{ span: 6, offset: 3 }} className="mt-5">
        {profile ? <Form.Label>Service: {profile.serviceId}</Form.Label> : null}
        <Form.Group controlId="formBasicDate">
          <Form.Label>Date</Form.Label>
          <Form.Control
            value={date}
            onChange={(event) => setDate(event.target.value)}
            type="date"
            required
          />
        </Form.Group>
        <Form.Group controlId="formBasicHour">
          <Form.Label>Hour</Form.Label>
          <Form.Control
            value={hour}
            onChange={(event) => setHour(event.target.value)}
            type="hour"
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicMessage">
          <Form.Label>Message</Form.Label>
          <Form.Control
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            type="text"
            placeholder="Describe your needs"
            required
          />
        </Form.Group>
        <Form.Group className="mt-5">
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
}
