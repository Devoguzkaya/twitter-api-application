import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from "./components/layout/Layout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TweetDetail from "./pages/TweetDetail";
import AdminPanel from "./pages/AdminPanel";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <>
      <ToastContainer theme="dark" position="bottom-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Layout ile sarmalanan sayfalar */}
        <Route path="*" element={
          <Layout>
            <Routes>
              <Route path="/tweet/:id" element={<TweetDetail />} />
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </>
  );
}

export default App;