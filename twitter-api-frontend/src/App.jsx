import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from "./components/layout/Layout";
import { useAuth } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TweetDetail from "./pages/TweetDetail";
import AdminPanel from "./pages/AdminPanel";
import ProfilePage from "./pages/ProfilePage";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <>
      <ToastContainer theme="dark" position="bottom-right" />
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        {/* Layout ile sarmalanan sayfalar */}
        <Route path="*" element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/tweet/:id" element={<TweetDetail />} />
                <Route path="/profile/:username" element={<ProfilePage />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/" element={<Home />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default App;