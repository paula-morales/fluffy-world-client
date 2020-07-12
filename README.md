# 🐕🐈Fluffy World Client🐩🦮

Hi 👋 I am Paula and in this project I combined two things that I love: coding and dogs!

Fluffy World is an application that allows pet lovers to search for pet services and pet friends near their location.
You can find the perfect candidate and be sure that your fluffy friend is in right hands. You can contact them by email to ask for more details.

[![Netlify Status](https://api.netlify.com/api/v1/badges/0a20a418-2bad-46b9-916e-4bf25bd86249/deploy-status)](https://app.netlify.com/sites/fluffy-world/deploys)

## [❗️Check out the deployed version here❗️](https://fluffy-world.netlify.app/)

- [Wireframe](https://s3.amazonaws.com/assets.mockflow.com/app/wireframepro/company/C1d2e5619aa7c4499b2ad5a3a7bd281e2/projects/M8f39340cb053a6865d083471df78c7c41593354426480/pages/D2ce52e1f90a1d6771d9d766285b4c879/image/D2ce52e1f90a1d6771d9d766285b4c879.png)
- [Kanban task board](https://github.com/users/paula-morales/projects/1)

## Table of contents:

- **[App demo](#app-demo)**
- **[Goals for this project](#goals-for-this-project)**
- **[User stories](#user-stories)**
- **[Server](#server)**
- **[Technologies used](#technologies-used)**
- **[Git workflow](#git-workflow)**

## App demo

![APP-DEMO-01](/src/images/gif/01.gif)
![APP-DEMO-02](/src/images/gif/02.gif)
![APP-DEMO-03](/src/images/gif/03.gif)
![APP-DEMO-04](/src/images/gif/04.gif)
![APP-DEMO-05](/src/images/gif/05.gif)
![APP-DEMO-06](/src/images/gif/06.gif)
![APP-DEMO-07](/src/images/gif/07.gif)

## Goals for this project

The goal of this project is to build a full-stack app using new technologies .

- Practice full-stack development
- Apply what I learned in the bootcamp
- Practice learning new technology independently
- Practice disciplined git usage

## User stories

**As a user, I want to be able to:**

- Sign up as owner or candidate and choose which languages I speak
- Add or remove profiles from my favorites
- See details about my account. Favorites and profiles created by me

**🐕🐈 As a pet owner, I want to be able to:**

- Type one address and find pet services around it
- See a map with candidates near me (filter by distance)
- When I click the marker, I can see a Card with a short description of the candidate selected
- Check the details of each candidate
- Contact one candidate with a possible date and hour for the service
- Leave a review to help other owners to find the right candidate
- Register my pet to be available when someone looks for pet friends

**👨🏻👩🏻As a person who provide services, I want to be able to:**

- Create profiles to offer different services and define my available time for each one

## Server

[**Here**](https://github.com/paula-morales/fluffy-world-server) you can find the server repository for this project.

## Technologies used

- [React, React Router DOM](https://github.com/paula-morales/fluffy-world-client/blob/development/src/App.js)
- [Redux, Redux-Thunk](https://github.com/paula-morales/fluffy-world-client/tree/development/src/store)
- [React Geocode, Google Maps API](https://github.com/paula-morales/fluffy-world-client/blob/development/src/pages/Homepage/Homepage.js)
- [CSS, HTML, Bootstrap, Material-UI](https://github.com/paula-morales/fluffy-world-client/blob/development/src/pages/Homepage/Homepage.css)

## Git workflow

In this project I try to use:

- Good commit messages
- Well named branches
- [Pull requests with summaries](https://github.com/paula-morales/fluffy-world-client/pull/12)

## Set up

- Clone the app
- Cd into your project
- npm install
- npm start

You will need to create your own Google API Key for Geocoding API, Places API, Maps Javascript API
