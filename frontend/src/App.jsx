import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoleSelection from "./pages/RoleSelection";
import AdminSignup from "./components/Forms/AdminSignupForm";
import OwnerSignup from "./components/Forms/OwnerSignupForm";
import UserSignup from "./components/Forms/UserSignupForm";
import OwnerLoginForm from "./components/Auth/OwnerLogin";
import UserLoginForm from "./components/Auth/UserLogin";
import OwnerDashboard from "./pages/OwnerDashboard";
import UserDashboard from "./pages/UserDashboard";
import SearchShops from "./pages/SearchShops";
import UserChat from "./pages/UserChat";
import FileUploadPage from './pages/FileUploadPage';
import Home from './pages/Home';
import QRCodeDownload from "./pages/QRCodeDownload";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/role" element={<RoleSelection />} />
        <Route path="/" element={<Home />} />
        <Route path="/qr-code-download" element={<QRCodeDownload />} />
        <Route path="/owner/login" element={<OwnerLoginForm />} />
        <Route path="/user/login" element={<UserLoginForm />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/owner/signup" element={<OwnerSignup />} />
        <Route path="/user/signup" element={<UserSignup />} />
        <Route path="/search" element={<SearchShops />} />
        <Route path="/chat/:shopId" element={<UserChat />} />
        <Route path="/file-upload/:shopId" element={<FileUploadPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
