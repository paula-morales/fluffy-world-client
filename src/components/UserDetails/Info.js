import React from "react";
import Avatar from "@material-ui/core/Avatar";

export default function Info(props) {
  const {
    email,
    firstName,
    lastName,
    phoneNumber,
    profilePicture,
    isOwner,
    isCandidate,
  } = props;
  return (
    <div>
      {email}
      <Avatar alt="firstName" src={profilePicture} />
    </div>
  );
}
