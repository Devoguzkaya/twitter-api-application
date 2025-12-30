import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import authService from "../services/authService";

function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.register(form);
      toast.success("Kayıt başarılı! Giriş yapabilirsiniz.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.message || "Kayıt başarısız";
      toast.error(errorMsg);
    }
  };


  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm flex flex-col gap-6">
        {/* Logo */}
        <div className="flex justify-center">
          <svg viewBox="0 0 24 24" className="w-10 h-10 fill-white" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </svg>
        </div>

        <h1 className="text-3xl font-bold">Hesabını oluştur</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="İsim"
              className="w-full bg-black border border-gray-600 rounded bg-transparent p-4 text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-colors"
              required
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="E-posta"
              className="w-full bg-black border border-gray-600 rounded bg-transparent p-4 text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-colors"
              required
            />
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Şifre"
              className="w-full bg-black border border-gray-600 rounded bg-transparent p-4 text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-colors"
              required
            />
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-white text-black font-bold rounded-full py-3 hover:bg-gray-200 transition-colors"
            >
              Kaydol
            </button>
          </div>

        </form>
        <p className="text-gray-500 text-sm mt-4">
          Zaten bir hesabın var mı?{" "}
          <button onClick={() => navigate("/login")} className="text-blue-400 hover:underline">
            Giriş yap
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;