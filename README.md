# College Management System

## Description
The College Management System is a web application designed to simplify and streamline the management of student and faculty information, assessments, and attendance tracking. Built using modern technologies, this system provides a user-friendly interface and efficient backend operations to enhance the user experience for students, faculty, and administrators.

---

## Features
- **Dual Login System**: Separate login portals for students and faculty.
- **Assessment Management**: Tracks and displays marks for CAT1, CAT2, and MODEL exams.
- **Attendance Tracking**: Easy attendance management for faculty.
- **Responsive UI**: Modern design compatible with all devices.
- **Role-Specific Dashboards**: Tailored views for students and faculty.

---

## Technologies Used
- **Frontend**: React.js
- **Backend**: Express.js
- **Database**: MongoDB
- **Authentication**: Firebase Authentication
- **Other Tools**:
  - Node.js
  - Mongoose
  - Axios

---

## Installation and Setup

### Prerequisites
Ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB
- Firebase Account (for Authentication)

### Steps

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd college-management
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   cd backend
   npm install
   ```

3. **Configure Environment Variables**:
   - Create a `.env` file in the root directory and add the following:
     ```env
     MONGO_URI=<Your MongoDB Connection String>
     FIREBASE_API_KEY=<Your Firebase API Key>
     FIREBASE_AUTH_DOMAIN=<Your Firebase Auth Domain>
     FIREBASE_PROJECT_ID=<Your Firebase Project ID>
     ```

4. **Run the Application**:
   - Start the backend:
     ```bash
     cd backend
     node server.js
     ```
   - Start the frontend:
     ```bash
     npm start
     ```

5. **Access the Application**:
   - Open [http://localhost:3000](http://localhost:3000) in your browser.

---


## Contributing
We welcome contributions! Please fork the repository and submit a pull request for review.

---

## License
This project is licensed under the MIT License. See the LICENSE file for details.

---

## Contact
For any queries or suggestions, please contact:
- **Name**: Mohammed Faisal
- **Email**: <mdfaisalffz02@gmail.com>

