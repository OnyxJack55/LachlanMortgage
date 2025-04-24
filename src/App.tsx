import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Hero from './components/Hero';
import BrokerSection from './components/BrokerSection';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { StaffProvider } from './context/StaffContext';
import type { StaffMember } from './context/StaffContext';

// Sample broker data - this will be replaced with actual data
const initialStaff: StaffMember[] = [
  {
    name: "John Smith",
    position: "Senior Mortgage Broker",
    email: "john.smith@lachlanmortgage.com.au",
    phone: "0412 345 678",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
  },
  {
    name: "Sarah Johnson",
    position: "Mortgage Specialist",
    email: "sarah.johnson@lachlanmortgage.com.au",
    phone: "0423 456 789",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80"
  },
  {
    name: "David Thompson",
    position: "Senior Mortgage Broker",
    email: "david.thompson@lachlanmortgage.com",
    phone: "+61 400 567 890",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
  },
  {
    name: "Lisa Anderson",
    position: "Mortgage Specialist",
    email: "lisa.anderson@lachlanmortgage.com",
    phone: "+61 400 234 567",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=761&q=80"
  },
  {
    name: "James Taylor",
    position: "Commercial Broker",
    email: "james.taylor@lachlanmortgage.com",
    phone: "+61 400 890 123",
    imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
  },
  {
    name: "Sophie Martinez",
    position: "Residential Specialist",
    email: "sophie.martinez@lachlanmortgage.com",
    phone: "+61 400 456 789",
    imageUrl: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
  }
];

const HomePage: React.FC = () => {
  return (
    <Layout>
      <Hero businessName="Lachlan Mortgage" />
      <BrokerSection />
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <StaffProvider initialStaff={initialStaff}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </StaffProvider>
  );
};

export default App; 