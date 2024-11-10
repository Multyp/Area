---
title: Intro
sidebar_position: 1
---

# ACTION-REACTION

## CREATE AN AUTOMATION PLATFORM

**ACTION-REACTION**

## General Considerations

As part of this project, you will assume the role of a Software Architect team.

Your main goal is neither reinventing the wheel nor writing numerous lines of code. On the contrary, your main goal is to understand, select and integrate a wide range of existing libraries.

The code you write will only implement the so-called _business_ logic. In other words, your main job will be to write _glue_ between selected software components to complete the requested project.

Before embarking on the creation of such a project, we suggest you take the time to analyze and understand the operation of each software brick. In this theory, we will talk about **state of the art** and **POC**:

- **State of the art**: Study the different possible solutions and choose the right component based on the requirements.
- **POC (Proof Of Concept)**: Make a quick demo program that proves the proper functioning of a component or algorithm.

This project is longer than your usual ones. It will be essential for the success of this project that you put in place real project management and not rush headlong.

## The Project

The goal of this project is to discover, as a whole, the software platform that you have chosen through the creation of a business application.

To do this, you must implement a software suite that functions similar to that of IFTTT and/or Zapier.

This software suite will be broken into three parts:

- An application server to implement all the features listed below (see Features)
- A web client to use the application from your browser by querying the application server  
- A mobile client to use the application from your phone by querying the application server

No business process will be performed on the web & mobile client side, which only serves as a user interface and redirects requests from/to the application server.

While developing the web client and mobile client, consider accessibility guidelines and best practices. Make your application usable by as many people as possible, including those with disabilities. [Click here for more information]

## Functions

The application will offer the following functionalities:

1. The user registers on the application in order to obtain an account (see User Management)
2. The registered user then confirms their enrollment on the application before being able to use it (see Authentication/Identification) 
3. The application then asks the authenticated user to subscribe to Services (see Services)
4. Each service offers the following components:
   - Type **Action** (see _Action Components_)
   - Type **REAction** (see _REAction Components_)
5. The authenticated user composes **AREA** by interconnecting an **Action** to a **REAction** previously configured (see AREA)
6. The application triggers **AREA** automatically thanks to **triggers** (see Trigger)

> The application server is only exploited for web and/or mobile clients, which will have to expose all of its functionalities through a REST API.

## Work Group

The project is to be done in a group. Validation of the associated module will take into account not only the quality of the work performed but also the quantity of available features.

Here is the minimum expected configuration for a group of **X students**:

Let:
- NBS = number of services supported by the application server and available from clients
- NBA = total number of Actions supported by all services and customers available  
- NBR = total number of REActions supported by all services and customers available

Here's what's expected of you:

- NBS >= 1 + X
- NBA + NBR >= 3 * X

> In the case where one of the two web or mobile clients offers less functions than the other, this calculation will be based on the least successful client.

## User Management

As the application is centered on the digital life of users, it must therefore offer management of the latter.

To do this, you must create a user management module.

The **client** asks non-identified users to register via an online form. Take inspiration from what you already know about this step (e.g. fill in an email address, registration via a third party service like Google, Facebook, X, etc.).

When the form is submitted from the **client**, a request is made to the **application server** to validate this account creation step.

> An administration section would be useful to manage site users.

## Authentication/Identification

Using the application requires knowing the user in question.

To do this, it is necessary to implement the following options:

1. A method of user authentication via a username/password. In this case, the client transmits the request to the application server which will process it.
2. A method of identifying users via OAuth2 (e.g. Google/X/Facebook/etc.). In this case, the client processes this identification itself and warns the application server if successful.

> Regarding the method of identification, remember to connect the third party account to a system user.

## Services

The purpose of the application being to interconnect **services** between them (Outlook 365, Google, OneDrive, X, etc.), it is first necessary to propose to the authenticated user to select the **services** for which they have an account.

In this part, it will therefore be necessary to ask users to subscribe to these **services** (e.g. from their profile page the user links their X/Google account/etc via OAuth2 authentication).

When necessary, the **client** will have to manage the identification before transmitting to the **application server** the subscription to this **service** (e.g. the user subscribes to the Facebook service which requires them to log in via OAuth2).

The available **services** offered to the user from their **client** will be retrieved from the **services** list implemented on the **application server** side.

## Action Components

Each **service** may offer **Action** components. These components enable the activation of a **trigger** (see _Trigger_) when the condition is detected.

Some examples:

**Google service/Facebook/X/Instagram/etc.**
- A new message is posted in group G
- A new message containing a #hashtag is posted
- A new private message is received by the user
- One of the user's messages gets a like
- The user gains a Follower

**Service RSS/Feedly/etc.**
- A new article is available
- An article is added to their favorites by the user

**Service OneDrive/Dropbox**
- A new file is present in the X directory
- A user shares a file

**Service Outlook 365/Mail/Gmail/etc.**
- Receipt of a message from a user X
- Receipt of a message whose title contains the word X

**Service Timer**
- The current date is of the type DD/MM
- The current time is of the type HH:MM
- In X days it will be Y (ex: In 3 days, it will be Friday)

## REAction Components

Each **service** may offer **REAction** components. These components perform a specific task by activating a **trigger** (see _Trigger_).

Some examples:

**Service Google/Facebook/X/Instagram/etc.**
- The user posts a message in group G
- The user follows a new person P

**Service OneDrive/Dropbox**
- The user adds the file F in the directory R
- The user shares the F file with another user U

**Service Outlook 365/Mail/Gmail/etc.**
- The user sends a message M to a recipient D

**Service Scripting**
- The user checks their 'pickup' rights on the project P

## AREA

After subscribing to different **services**, the authenticated user can create some **AREA** in order to execute a **REAction** when an **Action** is found.

Some examples:

**Gmail/OneDrive**
- Action: A received email containing an attachment
- REAction: The attachment is stored in a directory in OneDrive

**GitHub/Teams**
- Action: An issue is created on a repository
- REAction: A message is sent on teams

## Trigger

This essential element of the application aims to trigger **REActions** when the effects of **Actions** linked via an **AREA** are recorded.

To do this, for each **Action** used in the system, it will retrieve the necessary elements to determine whether or not this **Action** occurred.

For example, for the **Action** "_A project P is to be completed in less than H hours_":

1. The trigger will list the user projects
2. The trigger will find that the project P ends in less than H hours
3. The trigger checks that this is the first time they see it for this project P
4. The trigger will activate the REAction components present in the AREA of the user that are linked to this Action component

> Refer to the IFTTT or Zapier website for a better understanding of this feature if necessary.

## Architecture

### Mobile Client

The **mobile client** should be available on Android or Windows Mobile. It will only be responsible for displaying screens and forwarding requests from the user to the **application server**.

> The mobile client must provide a way to configure the network location of the application server.

### Web Client

The **web client** will only be responsible for displaying screens and forwarding requests from the user to the **application server**.

### Application Server

The **application server** is the only one to embed the _business_ logic of the project. It will offer its services to **web & module clients** through a REST API.

> No business model process will be carried out on the web & mobile client side. This only serves as a user interface and redirects requests from/to the application server.

## Project Construction

As part of this project, you will have to develop several more or less independent parts. Each of these parts will be free to use the technologies of your choice.

In order to homogenize the construction of such a project, it will be based on the use of Docker Compose.

> Please read the following points carefully

### docker-compose build

You will have to make a docker-compose.yml file at the root of your project, which will describe the different docker services used.

This file must include at least the following three docker services:

- A server service to launch the application server on port 8081
- A client_mobile service to build the mobile client
- A client_web service to launch the web client on port 8082

> The client_web depends on client_mobile AND server. For more information, see the documentation about depends_on

### docker-compose up

Validation of the integrity of your images will be done when launching the _docker-compose up_ command.

The following points should be respected:

- The services client_mobile and client_web will share a common volume
- The client_mobile service will edit the associated binary and put it on the common volume with the client_web
- The server service will run by exposing port 8081
- The server service will respond to the request http://localhost:8081/about.json (see File about.json)
- The client_web service will run by exposing port 8082
- The client_web service will respond to http://localhost:8082/client.apk to provide the Android version of mobile client

## File about.json

The **application server** should answer the call http://localhost:8081/about.json
