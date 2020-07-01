import React, { useState, useEffect } from "react";
import { Jumbotron, Container, Form, Col, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { showMessageWithTimeout } from "../../store/appState/actions";
import { useHistory } from "react-router-dom";
import { selectUser } from "../../store/user/selectors";
import { registerPet } from "../../store/profiles/actions";

export default function RegisterYourPet() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(selectUser);
  useEffect(() => {
    if (!user.isOwner) {
      history.push("/");
    }
  }, [user, history]);
  function handlerSubmit() {
    if (!picture || !name || !description) {
      dispatch(
        showMessageWithTimeout("danger", true, "Please fill out all the fields")
      );
    } else {
      dispatch(registerPet(name, description, picture));
    }
  }

  return (
    <>
      <Jumbotron>
        <Container>
          <h1>Register Your Pet</h1>
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
