
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import './css/common.css'
import Landing from './components/landing';
import Eduflex from "./components/eduflex";
import { useEffect, useState } from "react";
import Workexpflex from "./components/workexpflex";
import Projectflex from "./components/projectflex";
import Oobflex from "./components/oobflex";
import Certiflex from "./components/certiflex";
import Contactflex from "./components/contactflex";
import AdminLogin from "./components/login";
import ProtectedRoute from "./components/protectedroutes";
import Dashboard from "./components/dashboard";
import ManageWorkExp from "./components/manageworkexp";
import ManageCertificates from "./components/managecertificate";
import ManageEducation from "./components/manageeducation";
import Manageoutofthebox from "./components/manageoutofthebox";
import Manageproject from "./components/manageproject";
import Manageotherdetails from "./components/manageotherdetails";

function App() {
  // Initialize from localStorage, default to true if not found
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // Save to localStorage whenever theme changes
  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(isDark));
  }, [isDark]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing isDark={isDark} toggleTheme={toggleTheme} />} />
        <Route path="/oob" element = {<Oobflex isDark={isDark} toggleTheme={toggleTheme} />}/>
        <Route path="/edu" element = {<Eduflex isDark={isDark} toggleTheme={toggleTheme} />}/>
        <Route path="/work" element = {<Workexpflex isDark={isDark} toggleTheme={toggleTheme} />}/>
        <Route path="/contact" element = {<Contactflex isDark={isDark} toggleTheme={toggleTheme} />}/>
        <Route path="/project" element = {<Projectflex isDark={isDark} toggleTheme={toggleTheme} />}/>
        <Route path="/certificates" element = {<Certiflex isDark={isDark} toggleTheme={toggleTheme} />}/>
        <Route path="/Tommyshelby/login" element= {<AdminLogin/>}/>
        <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
        />
        <Route 
            path="/admin/work-experience" 
            element={
              <ProtectedRoute>
                <ManageWorkExp />
              </ProtectedRoute>
            } 
        />
        // Add this route
        <Route 
          path="/admin/certificates" 
          element={
            <ProtectedRoute>
              <ManageCertificates />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/education" 
          element={
            <ProtectedRoute>
              <ManageEducation />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/outofthebox" 
          element={
            <ProtectedRoute>
              <Manageoutofthebox />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/project" 
          element={
            <ProtectedRoute>
              <Manageproject />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/otherdetails" 
          element={
            <ProtectedRoute>
              <Manageotherdetails/>
            </ProtectedRoute>
          } 
        />

          {/* Redirect /admin to /admin/dashboard */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

          {/* 404 - Not Found */}
          <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
