// frontend/src/pages/DoctorList.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DoctorList() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios.get('/api/users/doctors')  // Optional: you may need to create this backend route
      .then(res => setDoctors(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4 font-semibold">Available Doctors</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {doctors.map(doc => (
          <div key={doc._id} className="p-4 border rounded shadow">
            <h3 className="text-xl font-bold">{doc.name}</h3>
            <p>{doc.email}</p>
            <a href={`/book/${doc._id}`} className="text-blue-500 underline">Book Appointment</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorList;
