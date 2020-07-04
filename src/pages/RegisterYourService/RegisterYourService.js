import React, { useState, useEffect } from "react";
import { Jumbotron, Container, Form, Col, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { showMessageWithTimeout } from "../../store/appState/actions";
import { useHistory } from "react-router-dom";
import { selectUser } from "../../store/user/selectors";
import { registerService } from "../../store/profiles/actions";
import { typeOfServicesSelector } from "../../store/typeOfServices/selectors";
import { fetchProfiles } from "../../store/profiles/actions";
import { profilesSelector } from "../../store/profiles/selectors";

export default function RegisterYourService() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState("");
  const [serviceId, setService] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(selectUser);
  const servicesList = useSelector(typeOfServicesSelector);

  useEffect(() => {
    //you only can access if you are a candidate
    if (!user.isCandidate) {
      history.push("/");
    }
    dispatch(fetchProfiles);
  }, [user, history, dispatch]);

  const profiles = useSelector(profilesSelector);
  let existingProfiles;
  if (profiles && user) {
    existingProfiles = profiles.filter((profile) => profile.userId === user.id);
  }

  let existingServices = [];
  if (existingProfiles) {
    existingProfiles.forEach((profile) => {
      existingServices.push(profile.serviceId);
    });
  }

  //you cannot choose the service called "pet friends", that is only to register pets
  for (var j = servicesList.length - 1; j >= 0; j--) {
    if (servicesList[j].name === "pet friends") {
      servicesList.splice(j, 1);
    }
  }

  //if you already register a service (i.e. dog walking), you cannot choose it again
  if (existingServices) {
    existingServices.forEach((service) => {
      for (var k = servicesList.length - 1; k >= 0; k--) {
        if (servicesList[k].id === service) {
          servicesList.splice(k, 1);
        }
      }
    });
  }

  function handlerSubmit() {
    if (!picture || !title || !price || !serviceId || !description) {
      dispatch(
        showMessageWithTimeout("danger", true, "Please fill out all the fields")
      );
    } else {
      dispatch(registerService(title, price, description, picture, serviceId));
    }
    setTitle("");
    setPrice("");
    setDescription("");
    setPicture("");
    setService("");
  }

  return (
    <>
      <Jumbotron>
        <Container>
          <h1>Register Your Service</h1>
        </Container>
      </Jumbotron>
      <Container>
        <Form as={Col} md={{ span: 6, offset: 3 }} className="mt-5">
          <Form.Group controlId="formBasicTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              type="text"
              placeholder="Enter title"
              required
            />
          </Form.Group>

          <Form.Group controlId="formBasicPrice">
            <Form.Label>Price (EUR/h)</Form.Label>
            <Form.Control
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              type="text"
              placeholder="Enter price"
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

          <Form.Group controlId="formBasicService">
            <Form.Label>Choose a service</Form.Label>
            <Form.Control
              as="select"
              onChange={(event) => setService(parseInt(event.target.value))}
            >
              <option defaultValue>Select</option>
              {servicesList
                ? servicesList.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))
                : null}
            </Form.Control>
          </Form.Group>

          <Button variant="danger" type="submit" onClick={handlerSubmit}>
            Submit
          </Button>
        </Form>
      </Container>
    </>
  );
}
