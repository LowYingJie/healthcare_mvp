// frontend/src/pages/BookAppointment.jsx

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ date: '', time: '', reason: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('/api/appointments', {
      doctorId,
      ...form
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(() => {
      alert('Appointment booked!');
      navigate('/appointments');
    }).catch(err => alert(err.response?.data?.error || 'Error booking'));
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Book Appointment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="date" type="date" onChange={handleChange} className="w-full border p-2" required />
        <input name="time" type="time" onChange={handleChange} className="w-full border p-2" required />
        <textarea name="reason" placeholder="Reason..." onChange={handleChange} className="w-full border p-2" />
        <button className="bg-blue-500 text-white px-4 py-2">Book</button>
      </form>
    </div>
  );
}

export default BookAppointment;
