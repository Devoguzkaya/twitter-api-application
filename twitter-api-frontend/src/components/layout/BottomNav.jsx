import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useRef, useEffect } from "react";

function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();
    const { loggedInUsername, logout, loggedInRoles } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const menuRef = useRef(null);
    const dropdownRef = useRef(null);

    const menuItems = [
        { label: "Anasayfa", path: "/", icon: "🏠" },
        { label: "Profil", path: `/profile/${loggedInUsername}`, icon: "👤", authRequired: true },
        { label: "Admin", path: "/admin", icon: "⚙️", adminOnly: true },
    ];

    const isAdmin = loggedInRoles?.some(r => (typeof r === 'string' ? r : r.authority || '').includes('ADMIN'));

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                (!dropdownRef.current || !dropdownRef.current.contains(event.target))
            ) {
                setShowProfileMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setShowProfileMenu(false);
    };

    if (!loggedInUsername) {
        return (
            <div className="fixed bottom-0 left-0 w-full h-[53px] bg-black border-t border-[#2f3336] flex items-center justify-around sm:hidden z-50">
                <button onClick={() => navigate("/login")} className="text-white font-bold text-sm bg-slate-800 px-4 py-2 rounded-full">Giriş Yap</button>
                <button onClick={() => navigate("/register")} className="text-black font-bold text-sm bg-white px-4 py-2 rounded-full">Kaydol</button>
            </div>
        )
    }

    return (
        <>
            <div className="fixed bottom-0 left-0 w-full h-[53px] bg-black border-t border-[#2f3336] flex items-center justify-around sm:hidden z-50">
                {menuItems.map((item) => {
                    if (item.authRequired && !loggedInUsername) return null;
                    if (item.adminOnly && !isAdmin) return null;

                    const isActive = location.pathname === item.path;

                    return (
                        <div
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className="flex items-center justify-center w-full h-full cursor-pointer hover:bg-zinc-900/50"
                        >
                            <span className={`text-2xl ${isActive ? 'scale-110' : ''}`}>{item.icon}</span>
                        </div>
                    )
                })}

                {/* Çıkış / Profil Butonu (Mobile Özel Basit Versiyon) */}
                <div
                    ref={menuRef}
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center justify-center w-full h-full cursor-pointer hover:bg-zinc-900/50 relative"
                >
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-sm font-bold border border-black">
                        {loggedInUsername.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>

            {/* Mobile Profile Dropdown (Bottom Sheet style) */}
            {showProfileMenu && (
                <div
                    ref={dropdownRef}
                    className="fixed bottom-[60px] right-2 bg-black border border-[#2f3336] rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.1)] z-50 py-2 w-[200px] sm:hidden"
                >
                    <button
                        className="block w-full text-left px-4 py-3 font-bold hover:bg-zinc-900 transition text-white text-sm"
                        onClick={handleLogout}
                    >
                        Çıkış yap @{loggedInUsername}
                    </button>
                </div>
            )}
        </>
    );
}

export default BottomNav;
