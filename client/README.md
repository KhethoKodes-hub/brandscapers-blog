Brandscapers Blog Platform

A full-stack blog and engagement platform built to support content publishing, user interaction, and administrative moderation.
This system allows public users to sign up, log in, interact with posts, and engage through comments and reactions, while administrators manage content and moderation.

👨🏽‍💻 Developer

Khetho Mngomezulu
Full Stack Developer

Personal Email: kmngomezulu82@gmail.com

Work Email: khetho.m@brandscapersafrica.com

🧩 Project Overview

This application is a modern blog platform with:

Secure authentication

Role-based access (Admin vs Normal Users)

Post creation and moderation

User engagement (likes, comments, replies, reactions)

Cloud-hosted media

Production-ready architecture

The platform was designed and developed end-to-end (frontend and backend) by Khetho Mngomezulu.

🛠️ Tech Stack
Frontend

React.js

React Router

Axios

Firebase Authentication

HTML5 / CSS3 / JavaScript

Backend

Node.js

Express.js

MongoDB

Mongoose

Firebase Admin SDK (token verification)

Cloudinary (image & media storage)

Multer (file uploads)

🔐 Authentication & Authorization
User Authentication

Firebase Email & Password Authentication

JWT (Firebase ID Token) used for API authorization

Users can:

Sign up

Log in

Like posts

Comment on posts

Edit & delete their own comments

React to other users’ comments

Admin Authentication

Firebase Authentication (Admin accounts only)

Admins can:

Create posts

Upload images (stored on Cloudinary)

Delete posts

Delete user comments

Moderate inappropriate or spam content

✨ Core Features
Posts

Admin-created posts

Image and media support via Cloudinary

Slug-based routing

Pinned and published posts

Soft-delete support

Likes & Reactions

Users can like/unlike posts

Users can react to comments

Prevents duplicate likes by the same user

Comments System

Authenticated users can:

Add comments

Edit their own comments

Delete their own comments

React to other users’ comments

Comments display the email address used during signup/login

Admins can remove abusive or spam comments

🗂️ Media Storage

All images and media files are stored securely on Cloudinary

Uploaded via Multer with memory storage

Supports images and other media types

📁 Project Structure (Simplified)
client/
  ├── components/
  ├── pages/
  ├── services/
  ├── firebase.js
  └── App.js

server/
  ├── controllers/
  ├── models/
  ├── routes/
  ├── middleware/
  ├── utils/
  └── server.js

🚀 Deployment Ready

Environment-based configuration

Secure token verification

Scalable architecture

Clean separation of concerns (MVC pattern)

📜 Credits

Designed and developed frontend and backend by:

Khetho Mngomezulu
Full Stack Developer

📧 kmngomezulu82@gmail.com

📧 khetho.m@brandscapersafrica.com