import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link } from 'react-router-dom';
import RegistrationForm from './pages/RegistrationForm';
import AllUser from './pages/AllUser';
import EditUser from './pages/EditUser';
import ViewUsers from './pages/ViewUsers';
import PhoneRegistration from './pages/PhoneRegistration';
import EmailRegistration from './pages/EmailRegistration';

function App() {
  return (
    <>
      <BrowserRouter>
      <div className='p-4 space-x-4 shadow text-black-800 bg-blue-500 sticky flex justify-end'>
        <Link to='/users' className='mx-5 mr-2 hover:underline'>Users</Link>
        <Link to='/' className='mx-5 mr-2 hover:underline'>Register</Link>
      </div>
        <Routes>
          <Route path="/" element={<RegistrationForm />} />
          <Route path='/phone' element={<PhoneRegistration />} />
          <Route path='/email' element={<EmailRegistration />}/>
          <Route path='/users' element={<AllUser />} />
          <Route path='/edit/:id' element={<EditUser />}/>
          <Route path='/view/:id' element={<ViewUsers />}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
