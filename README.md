# Q&A Web Application

This repository contains the code for the **Q&A Web Application**, built using a **MERN stack** (MongoDB, Express, React, Node.js) . The application allows users to ask questions, provide answers, and interact with each other on a platform.



## Setup Instructions

### 1. Clone the Repository

First, clone this repository to your local machine:

```bash
git clone https://Anushkabh/QnA-Finance.git
```
### 2.  Install Backend Dependencies
Navigate to the backend folder and install the dependencies
```bash
cd Server
npm install
```
### 3. Configure Environment Variables

Create a `.env` file in the `Server` folder and add the following variables:

```env
MONGO_URI=mongodb://localhost:27017/qa-app # Or your MongoDB Atlas URI
JWT_SECRET=your_jwt_secret_key
NODE_ENV= production or developemnt
PORT= 

```
### 4.  Start the Backend Server
```bash
npm start
```
### 5. Install Frontend Dependencies
```bash
cd ../client
npm install
```
### 6. Configure Environment Variables
```env
VITE_API_BASE_URL=your backend url
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
```
### 7. Start the Frontend Server
```bash
npm run dev
```
The frontend will now be running on your loacalhost.

### 8. Access the Application
Open your browser and navigate to http://localhost:5173.


