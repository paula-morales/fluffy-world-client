import React, { useState, useEffect } from "react";
import { Container, Form, Col, Button, Row } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { fetchProfiles } from "../../store/profiles/actions";
import { profilesByIdSelector } from "../../store/profiles/selectors";
import { selectToken } from "../../store/user/selectors";
import { sendEmail } from "../../store/profiles/actions";
import { fetchServices } from "../../store/typeOfServices/actions";
import { typeOfServicesSelector } from "../../store/typeOfServices/selectors";
import { showMessageWithTimeout } from "../../store/appState/actions";
import "./Contact.css";

export default function Contact() {
  const { idprofile } = useParams();
  const dispatch = useDispatch();
  const [date, setDate] = useState();
  const [message, setMessage] = useState();
  const [hour, setHour] = useState();
  const history = useHistory();
  const profile = useSelector(profilesByIdSelector(parseInt(idprofile)));
  const token = useSelector(selectToken);
  const typeOfServices = useSelector(typeOfServicesSelector);

  useEffect(() => {
    if (token === null) {
      history.push("/login");
    } else {
      dispatch(fetchServices);
      dispatch(fetchProfiles);
    }
  }, [token, history, dispatch]);

  //to display the hours when the person is available
  const hours = [];
  let serviceSelected;
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
        sendEmail(profile.userId, date, hour, message, profile.serviceId)
      );
      setDate("");
      setHour("");
      setMessage("");
    }
  }

  return (
    <>
      <div className="contact">
        <Container>
          {" "}
          <h1>Contact form</h1>
        </Container>{" "}
      </div>
      <div>
        <Row>
          <Col className="col-4">
            <img
              className="contact-image"
              src={require("../../images/dog-cat.png")}
              alt="cat-dog"
            />
          </Col>
          <Col>
            {profile ? (
              <Form as={Col} md={{ span: 6 }} className="mt-5">
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

                  <textarea
                    style={{
                      border: "1px solid #ced4da",
                      borderRadius: ".25rem",
                    }}
                    name="Message"
                    rows="9"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                  ></textarea>
                </Form.Group>
                <Form.Group className="mt-1">
                  <Button
                    variant="secondary"
                    type="submit"
                    onClick={onSubmitHandler}
                  >
                    Submit
                  </Button>
                </Form.Group>
              </Form>
            ) : null}
          </Col>
        </Row>
      </div>
    </>
  );
}
