import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useAuth } from "../context/AuthContext";
import adminService from "../services/adminService";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const { loggedInRoles } = useAuth(); // Sadece roller yeterli

  // Admin yetkisi yoksa anasayfaya yönlendir
  useEffect(() => {
    if (!loggedInRoles.includes("ADMIN")) {
      toast.error("Yalnızca yöneticiler bu sayfayı görüntüleyebilir!");
      navigate("/");
    }
  }, [loggedInRoles, navigate]);

  useEffect(() => {
    if (!loggedInRoles.includes("ADMIN")) return;

    const fetchUsers = async () => {
      try {
        const data = await adminService.getAllUsers();
        setUsers(data);
        setMessage(null);
      } catch (err) {
        console.error("Kullanıcılar çekilirken hata:", err);
        const errorMsg = err.response?.data?.message || err.message || "Kullanıcılar alınamadı.";
        toast.error(errorMsg);
        setMessage(errorMsg);
      }
    };
    fetchUsers();
  }, [loggedInRoles]);

  if (!loggedInRoles.includes("ADMIN")) {
    return null; // Yetki kontrolü yapılırken boş göster
  }

  return (
    <div className="flex-1 w-full max-w-2xl border-x border-gray-700">
      <div className="sticky top-0 bg-slate-900/80 backdrop-blur-md px-4 py-3 border-b border-gray-700">
        <h2 className="text-xl font-bold">Admin Paneli - Tüm Kullanıcılar</h2>
      </div>
      <div className="p-4">
        {message && <p className="text-sm text-red-400 mb-4">{message}</p>}
        {users.length === 0 && !message && <p className="text-sm text-gray-400">Kullanıcı bulunamadı.</p>}
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.id} className="bg-slate-800 p-3 rounded flex justify-between items-center">
              <div>
                <p className="font-semibold text-white">@{user.username}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
              <div className="text-sm text-gray-500">
                {user.roles.map((role) => (
                  <span key={role} className="ml-1 px-2 py-1 bg-blue-600 rounded-full text-xs">
                    {role}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminPanel;