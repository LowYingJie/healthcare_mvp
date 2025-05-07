
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DoctorList from './pages/DoctorList';
import BookAppointment from './pages/BookAppointment';
import Appointments from './pages/Appointments';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/doctors" element={<DoctorList />} />
        <Route path="/book/:doctorId" element={<BookAppointment />} />
        <Route path="/appointments" element={<Appointments />} />
        {/* Add login/register/dashboard routes here */}
      </Routes>
    </Router>
  );
}

export default App;
