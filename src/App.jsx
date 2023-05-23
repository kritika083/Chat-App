// import './index.css';
import { Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Home from './components/Home';
import ChatBox from './components/ChatBox';
import Users from "./components/Users";
import ProtectedRoute from "./components/ProtectedRoutes";

function App() {

  return (
    
      <Routes>
      <Route exact path="/" element={<Login/>} />
      <Route
            path='/home'
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
      <Route exact path="/chatbox" element={<ChatBox/>} />
      <Route exact path='/users' element={<Users/>} />
      </Routes>
    
  )
}

export default App
