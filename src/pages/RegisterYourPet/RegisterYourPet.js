import React, { useState, useEffect } from "react";
import { Jumbotron, Container, Form, Col, Button } from "react-bootstrap";
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
  useEffect(() => {
    if (!user.isOwner) {
      history.push("/");
    }
    dispatch(fetchProfiles);
  }, [user, history, dispatch]);

  const profiles = useSelector(profilesSelector);
  let existingProfiles;
  if (profiles && user) {
    existingProfiles = profiles.filter((profile) => profile.userId === user.id);
  }

  let pet;
  if (existingProfiles) {
    pet = existingProfiles.find((profile) => {
      return (profile.serviceId = 5);
    });
  }
  if (pet) {
    history.push("/");
    dispatch(
      showMessageWithTimeout("danger", true, "You already registered your pet")
    );
  }
  function handlerSubmit() {
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
    } else {
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
              type="text"
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
              type="text"
              placeholder="Enter a number (format 24H)"
              required
            />
          </Form.Group>
          <Form.Group className="mt-5">
            <Button variant="danger" type="submit" onClick={handlerSubmit}>
              Submit
            </Button>
          </Form.Group>
        </Form>
      </Container>
    </>
  );
}
