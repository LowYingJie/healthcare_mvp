import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function DoctorList() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios.get('/api/users/doctors') // You must create this API route on backend
      .then(res => setDoctors(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Available Doctors</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {doctors.map(doc => (
          <div key={doc._id} className="p-4 border rounded shadow bg-white">
            <h3 className="text-lg font-bold">{doc.name}</h3>
            <p>{doc.email}</p>
            <div className="mt-2 flex space-x-4">
              <Link
                to={`/book/${doc._id}`}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Book
              </Link>
              <Link
                to={`/chat/${doc._id}`}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Chat
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorList;
