import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { signUp } from "../../store/user/actions";
import { selectUser } from "../../store/user/selectors";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import Geocode from "react-geocode";
import { apiKeyGoogle } from "../../config/constants";
import { showMessageWithTimeout } from "../../store/appState/actions";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const history = useHistory();
  const [radioValue, setRadioValue] = useState("");

  const radios = [
    { name: "I am a pet owner", value: "1" },
    { name: "I want to offer pet services", value: "2" },
  ];

  useEffect(() => {
    if (user.isOwner) {
      history.push("/registerpet");
    } else if (user.isCandidate) {
      history.push("/registerservice");
    }
  }, [user, history]);

  Geocode.setApiKey(apiKeyGoogle);
  Geocode.setRegion("nl");

  let isOwner = false;
  let isCandidate = false;
  function submitForm(event) {
    event.preventDefault();
    if (radioValue === "1") {
      isOwner = true;
      isCandidate = false;
    } else if (radioValue === "2") {
      isOwner = false;
      isCandidate = true;
    }
    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !email ||
      !password ||
      !address ||
      (!isOwner && !isCandidate) ||
      (isOwner && isCandidate)
    ) {
      dispatch(
        showMessageWithTimeout("danger", true, "Please fill out all the fields")
      );
    } else {
      Geocode.fromAddress(address).then(
        (response) => {
          const { lat, lng } = response.results[0].geometry.location;

          dispatch(
            signUp(
              firstName,
              lastName,
              profilePicture,
              phoneNumber,
              lat,
              lng,
              email,
              password,
              isOwner,
              isCandidate
            )
          );
        },
        (error) => {
          dispatch(
            showMessageWithTimeout(
              "danger",
              true,
              "Sorry, we did not find the address"
            )
          );
        }
      );
    }

    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setPhoneNumber("");
    setAddress("");
    setRadioValue("");
    setProfilePicture("");
  }

  return (
    <Container>
      <Form as={Col} md={{ span: 6, offset: 3 }} className="mt-4">
        <h4 className="mt-2 mb-4">
          <strong>Sign up</strong>
        </h4>
        <Form.Row>
          <Form.Group as={Col} controlId="formBasicFirstName">
            <Form.Label>First name</Form.Label>
            <Form.Control
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              type="text"
              placeholder="Enter first name"
              required
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formBasicLastName">
            <Form.Label>Last name</Form.Label>
            <Form.Control
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              type="text"
              placeholder="Enter last name"
              required
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="formBasicPhone">
            <Form.Label>Phone number</Form.Label>
            <Form.Control
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              type="number"
              placeholder="Enter phone number"
              required
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formBasicPicture">
            <Form.Label>Profile picture</Form.Label>
            <Form.Control
              value={profilePicture}
              onChange={(event) => setProfilePicture(event.target.value)}
              type="text"
              placeholder="Enter picture url"
              required
            />
          </Form.Group>
        </Form.Row>
        <Form.Group controlId="formBasicAddress">
          <Form.Label>Address</Form.Label>
          <Form.Control
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            type="text"
            placeholder="Enter address"
            required
          />
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="Enter email"
            required
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="Password"
            required
          />
        </Form.Group>
        <fieldset>
          <Form.Group as={Row}>
            <Col sm={10}>
              {radios.map((radio, idx) => (
                <Form.Check
                  key={idx}
                  type="radio"
                  variant="primary"
                  value={radio.value}
                  checked={radioValue === radio.value}
                  onChange={(e) => {
                    setRadioValue(e.currentTarget.value);
                  }}
                  label={radio.name}
                  name="formHorizontalRadios"
                  id={`formHorizontalRadios${radio.value}`}
                />
              ))}
            </Col>
          </Form.Group>
        </fieldset>

        <Form.Group controlId="formBasicCheckbox"></Form.Group>
        <Form.Group className="mt-0">
          <Button variant="primary" type="submit" onClick={submitForm}>
            Sign up
          </Button>
        </Form.Group>
        <label>Already have an account?</label>
        <Link
          to="/login"
          style={{ paddingBottom: "5rem", marginLeft: "0.5rem" }}
        >
          Log in
        </Link>
      </Form>
    </Container>
  );
}
