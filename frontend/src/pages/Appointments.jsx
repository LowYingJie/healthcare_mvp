// frontend/src/pages/Appointments.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Appointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios.get('/api/appointments', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => setAppointments(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4 font-semibold">My Appointments</h2>
      {appointments.map(app => (
        <div key={app._id} className="p-3 border mb-3">
          <p><strong>Doctor:</strong> {app.doctorId?.name}</p>
          <p><strong>Date:</strong> {new Date(app.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {app.time}</p>
          <p><strong>Status:</strong> {app.status}</p>
        </div>
      ))}
    </div>
  );
}

export default Appointments;
