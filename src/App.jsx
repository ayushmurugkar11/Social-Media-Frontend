// src/App.jsx
import { Routes, Route, Link } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import SignupForm from './Pages/Register';
import ProtectedRoute from './Auth/Auth.jsx'
import Navbar from './component/navbar.jsx'
import Feed from './Pages/feed.jsx';
import {PostProvider} from './Context/postcontext.jsx'

function App() {
  return (
    <div className="container mt-5">
      <Navbar/>

      <Routes>

        <Route path="/home" element={
          <ProtectedRoute>
            <Home /> </ProtectedRoute>} />
        
       
        <Route path="/feed" element={
           <PostProvider>
            <ProtectedRoute>
             
          <Feed /> </ProtectedRoute> </PostProvider>} />  
        
        <Route path="/login" element={<Login />} />
        
        <Route path="/register" element={<SignupForm />} />
      </Routes>
    </div>
  );
}

export default App;
