import React, { useState, useEffect } from "react";
import { Container, Jumbotron, Form, Col, Button } from "react-bootstrap";
import "./Contact.css";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfiles } from "../../store/profiles/actions";
import { profilesByIdSelector } from "../../store/profiles/selectors";
import moment from "moment";
import { selectToken } from "../../store/user/selectors";
import { sendEmail } from "../../store/profiles/actions";
import { fetchServices } from "../../store/typeOfServices/actions";
import { typeOfServicesSelector } from "../../store/typeOfServices/selectors";
import { showMessageWithTimeout } from "../../store/appState/actions";

export default function Contact() {
  const { iduser } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [date, setDate] = useState();
  const [message, setMessage] = useState();
  const [hour, setHour] = useState();
  const profile = useSelector(profilesByIdSelector(parseInt(iduser)));
  const token = useSelector(selectToken);
  const hours = [];
  let serviceSelected;

  useEffect(() => {
    if (token === null) {
      history.push("/login");
    } else {
      dispatch(fetchServices);
      dispatch(fetchProfiles);
    }
  }, [token, history, dispatch]);

  const typeOfServices = useSelector(typeOfServicesSelector);
  if (profile) {
    serviceSelected = typeOfServices.find((service) => {
      return service.id === profile.serviceId;
    });

    for (
      let hour = profile.availableFrom;
      hour < profile.availableUntil;
      hour++
    ) {
      hours.push(moment({ hour }).format("HH:mm"));
      hours.push(
        moment({
          hour,
          minute: 30,
        }).format("HH:mm")
      );
    }
  }

  function onSubmitHandler(e) {
    e.preventDefault();
    if (!date || !hour || !message) {
      dispatch(
        showMessageWithTimeout("danger", true, "Please fill out all the fields")
      );
    } else {
      dispatch(
        sendEmail(profile.user.id, date, hour, message, profile.serviceId)
      );
      setDate("");
      setHour("");
      setMessage("");
    }
  }

  return (
    <Container>
      <Jumbotron className="background-dog">
        <h1>Contact form</h1>
      </Jumbotron>

      {profile ? (
        <Form as={Col} md={{ span: 6, offset: 3 }} className="mt-5">
          <Form.Label>
            Service: {serviceSelected ? serviceSelected.name : null}
          </Form.Label>
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
            <Form.Label>
              Choose a time. {profile.user.firstName} is available from{" "}
              <strong>{profile.availableFrom}h</strong> until{" "}
              <strong>{profile.availableUntil}h</strong>.
            </Form.Label>
            <Form.Control
              as="select"
              onChange={(event) => setHour(event.target.value)}
            >
              <option>Select</option>
              {hours
                ? hours.map((hour) => <option key={hour}>{hour}</option>)
                : null}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formBasicMessage">
            <Form.Label>Message</Form.Label>
            <Form.Control
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              type="text"
              placeholder="Describe your needs"
              required
              style={{ height: "10rem" }}
            />
          </Form.Group>
          <Form.Group className="mt-5">
            <Button variant="primary" type="submit" onClick={onSubmitHandler}>
              Submit
            </Button>
          </Form.Group>
        </Form>
      ) : null}
    </Container>
  );
}
