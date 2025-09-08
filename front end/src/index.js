import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Problemset from './problemset';
import Login from './login';
import Register from './register';
import PaymentForm from './PaymentForm';
import Premium from './Premium';
import Discuss from './Discuss';
import DiscussInput from './DiscussInput';
import Listcompanies from './listcompanies';
import Contests from './contests';
import Ranking from './Ranking';
import Problemtranning from './problemtranning';
import Profile from './profile';
import Events from './events';
import EmailVerificationForm from './EmailVerificationForm';
import ChangePasswordForm from './ChangePasswordForm';
import AboutUs from './AboutUs';
import ContactUs from './ContactUs';
import DiscussDetail from './DiscussDetail';

import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const suppressedErrors = [
  'ResizeObserver loop completed with undelivered notifications'
];

const originalConsoleError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && suppressedErrors.some(msg => args[0].includes(msg))) {
    // Bỏ qua lỗi ResizeObserver loop
    return;
  }
  originalConsoleError.apply(console, args);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/problemset" element={<Problemset />} />
      <Route path="/problemtranning" element={<Problemtranning />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />      <Route path="/PaymentForm" element={<PaymentForm />} />
      <Route path="/Premium" element={<Premium />} />      
      <Route path="/Discuss" element={<Discuss />} />      
      <Route path="/DiscussInput" element={<DiscussInput />} />      
      <Route path="/Listcompanies" element={<Listcompanies />} />      
      <Route path="/Contests" element={<Contests />} />      
      <Route path="/Ranking" element={<Ranking />} />      
      <Route path="/events" element={<Events />} />      
            <Route path="/EmailVerificationForm" element={<EmailVerificationForm />} />      
      <Route path="/ChangePasswordForm" element={<ChangePasswordForm />} />
      <Route path="/AboutUs" element={<AboutUs />} />
      <Route path="/ContactUs" element={<ContactUs />} />
      <Route path="/DiscussDetail" element={<DiscussDetail />} />

    </Routes>
  </Router>
);

// reportWebVitals code giữ nguyên
reportWebVitals();
