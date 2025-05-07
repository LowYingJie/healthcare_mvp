import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import DoctorList from './pages/DoctorList';
import BookAppointment from './pages/BookAppointment';
import Appointments from './pages/Appointments';
import PrivateChat from './pages/PrivateChat'; // ✅ Import your private chat component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/doctors" element={<DoctorList />} />
        <Route path="/book/:doctorId" element={<BookAppointment />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/chat/:doctorId" element={<PrivateChat />} /> {/* ✅ Chat route with dynamic doctor ID */}
      </Routes>
    </Router>
  );
}

export default App;
