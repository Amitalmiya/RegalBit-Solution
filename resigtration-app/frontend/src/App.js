import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link } from 'react-router-dom';
import RegistrationForm from './pages/RegistrationForm';
import AllUser from './pages/AllUser';

function App() {
  return (
    <>
      <BrowserRouter>
      <div className='p-4 space-x-4 shadow text-black-800 bg-blue-200 position-sticky'>
        <Link to='/users' className='mx-5 mr-2 hover:underline'>Users</Link>
        <Link to='/' className='mx-5 mr-2 hover:underline'>Register</Link>
      </div>
        <Routes>
          <Route path="/" element={<RegistrationForm />} />
          <Route path='/users' element={<AllUser />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
