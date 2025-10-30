# React & Socket.IO Room-Based Chat

A full-stack, real-time chat application built with Node.js, Socket.IO, and React. This project allows users to create unique chat rooms or join existing ones using a username, featuring real-time messaging, timestamps, and a "is typing..." indicator.

## ✨ Features

* **Lobby System:** A main lobby page where users must enter a username to proceed.
* **Room Creation:** Users can create a new, private chat room with a unique `uuid`.
* **Join Room:** Users can join an existing room by entering its specific Room ID.
* **Real-Time Messaging:** Powered by `Socket.IO` for instant bi-directional communication.
* **Modern UI:** A sleek, dark-mode interface built with `Tailwind CSS`.
* **User-Specific Message Alignment:** Messages sent by the user are aligned to the right (in blue), while messages from others are aligned to the left (in gray).
* **Username Display:** The sender's username is displayed above their message.
* **Server-Side Timestamps:** All messages are timestamped by the server (`HH:MM`) to ensure time consistency across all clients.
* **"Is Typing..." Indicator:** Shows when other users in the room are actively typing a message.
* **Clean Routing:** Uses `React Router` to manage navigation between the lobby and chat rooms.

## 🛠️ Tech Stack

**Frontend (Client):**
* **React** (with Hooks)
* **Socket.IO Client**
* **Tailwind CSS**
* **React Router DOM**
* **UUID** (for generating room IDs)

**Backend (Server):**
* **Node.js**
* **Express**
* **Socket.IO**
* **CORS**
* **Nodemon** (for development)

by nora...
