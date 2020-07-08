import React from "react";

export default function Aboutus() {
  return (
    <div className="container-cards">
      <div className="card" style={{ fontSize: "22px", margin: "0 20px" }}>
        <div className="container mt-4 mb-4">
          <h4>
            <b>Sign up</b>
          </h4>
          <p>
            {" "}
            <i className="fa fa-user-plus"></i> Register as <u>candidate</u>:
            You can offer different pet services.
          </p>
          <p>
            {" "}
            <i className="fa fa-paw"> </i> Register as <u>owner</u>: You can
            leave reviews and register your pet (1) to find new friends around
            you.
          </p>
          <a href="/signup">
            {" "}
            <button className="button about">Sign up</button>
          </a>
        </div>
      </div>
      <div className="card" style={{ fontSize: "22px", margin: "0 20px" }}>
        <div className="container mt-4 mb-4">
          <h4>
            <b>Search</b>
          </h4>
          <p>
            {" "}
            <i className="fa fa-mouse-pointer"></i> Select the service you are
            looking for, address and how many kilometers away you want to
            search.
          </p>
          <p>
            {" "}
            <i className="fa fa-map-marker"> </i> You will get a map with the
            location of each candidate. You can see the details by clicking on
            the marker.
          </p>
          <a href="#look-for">
            {" "}
            <button className="button about">Start search</button>
          </a>
        </div>
      </div>
      <div
        className="card"
        style={{ fontSize: "22px", margin: "0 200px 0 20px" }}
      >
        <div className="container mt-4 mb-4">
          <h4>
            <b>Contact by email</b>
          </h4>
          <p>
            {" "}
            <i className="fa fa-sign-in"></i> Log in.
          </p>
          <p>
            {" "}
            <i className="fa fa-calendar"> </i> Choose the possible date and
            hour and write a message giving some details about you.
          </p>
        </div>
      </div>
    </div>
  );
}
