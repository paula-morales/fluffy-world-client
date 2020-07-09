import React, { useState, useEffect } from "react";
import {
  Jumbotron,
  Container,
  Form,
  Col,
  Button,
  Alert,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { showMessageWithTimeout } from "../../store/appState/actions";
import { useHistory } from "react-router-dom";
import { selectUser } from "../../store/user/selectors";
import { registerPet } from "../../store/profiles/actions";
import { fetchProfiles } from "../../store/profiles/actions";
import { profilesSelector } from "../../store/profiles/selectors";

export default function RegisterYourPet() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState("");
  const [availableFrom, setAvailableFrom] = useState(10);
  const [availableUntil, setAvailableUntil] = useState(16);
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(selectUser);
  const profiles = useSelector(profilesSelector);

  useEffect(() => {
    if (user.isCandidate || !user.token) {
      history.push("/");
    }
    dispatch(fetchProfiles);
  }, [user, history, dispatch]);

  //you only can register one pet
  //we register a pet with the service's name "pet friends" in our database
  let existingProfiles;
  let pet;
  if (profiles && user) {
    existingProfiles = profiles.filter((profile) => profile.userId === user.id);
    if (existingProfiles) {
      pet = existingProfiles.find((profile) => {
        return (profile.serviceId = 5);
      });
    }
    if (pet) {
      return <Alert variant="danger">You already registered your pet</Alert>;
    }
  }

  function handlerSubmit(e) {
    e.preventDefault();
    if (
      !picture ||
      !name ||
      !description ||
      !availableFrom ||
      !availableUntil
    ) {
      dispatch(
        showMessageWithTimeout("danger", true, "Please fill out all the fields")
      );
    } else if (
      availableFrom > 24 ||
      availableFrom < 0 ||
      availableUntil > 24 ||
      availableUntil < 0 ||
      availableFrom > availableUntil
    ) {
      dispatch(
        showMessageWithTimeout(
          "danger",
          true,
          "Please choose a time between 0 and 24 H"
        )
      );
    } else {
      parseInt(availableFrom);
      parseInt(availableUntil);
      dispatch(
        registerPet(name, description, picture, availableFrom, availableUntil)
      );
    }
    setName("");
    setDescription("");
    setPicture("");
  }

  return (
    <>
      <Jumbotron>
        <Container>
          <h1>Register your pet to meet some new pet friends!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <Form as={Col} md={{ span: 6, offset: 3 }} className="mt-5">
          <Form.Group controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(event) => setName(event.target.value)}
              type="text"
              placeholder="Enter name"
              required
            />
          </Form.Group>

          <Form.Group controlId="formBasicDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              type="text"
              placeholder="Enter description"
              required
            />
          </Form.Group>
          <Form.Group controlId="formBasicPicture">
            <Form.Label>Picture</Form.Label>
            <Form.Control
              value={picture}
              onChange={(event) => setPicture(event.target.value)}
              type="text"
              placeholder="Enter picture"
              required
            />
          </Form.Group>
          <Form.Group controlId="formBasicAvailableFrom">
            <Form.Label>
              Available From - <i>format 24H</i>
            </Form.Label>
            <Form.Control
              value={availableFrom}
              onChange={(event) => setAvailableFrom(event.target.value)}
              type="number"
              step="1"
              max={24}
              min={0}
              placeholder="Enter a number (format 24H)"
              required
            />
          </Form.Group>
          <Form.Group controlId="formBasicAvailableUntil">
            <Form.Label>
              Available Until - <i>format 24H</i>
            </Form.Label>
            <Form.Control
              value={availableUntil}
              onChange={(event) => setAvailableUntil(event.target.value)}
              placeholder="Enter a number (format 24H)"
              type="number"
              step="1"
              max={24}
              min={0}
              required
            />
          </Form.Group>
          <Form.Group className="mt-5">
            <Button variant="secondary" type="submit" onClick={handlerSubmit}>
              Submit
            </Button>
          </Form.Group>
        </Form>
      </Container>
    </>
  );
}
