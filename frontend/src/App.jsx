// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DoctorList from './pages/DoctorList'; // Import DoctorList component
import BookAppointment from './pages/BookAppointment'; // Import BookAppointment component
import Appointments from './pages/Appointments'; // Import Appointments component
import PrivateChat from './pages/PrivateChat'; // Import PrivateChat component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DoctorList />} /> {/* Route to the doctor list */}
        <Route path="/book/:doctorId" element={<BookAppointment />} /> {/* Route for booking appointment */}
        <Route path="/appointments" element={<Appointments />} /> {/* Route for viewing appointments */}
       
      </Routes>
    </Router>
  );
}

export default App;
