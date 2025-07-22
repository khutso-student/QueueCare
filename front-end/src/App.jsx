import { Routes,Route } from "react-router-dom";
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import MainDashboard from './pages/MainDashboard';
import ProtectedRoute from './components/ProtectedRoute'
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return(
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/maindashboard" element={
            <ProtectedRoute>
              <MainDashboard />
            </ProtectedRoute>
                            }
        />

      </Routes>
    </div>
  )
}

export default App;