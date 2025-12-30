import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { loggedInUsername, logout, loggedInRoles } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const menuRef = useRef(null);
    const dropdownRef = useRef(null); // Yeni ref

    const menuItems = [
        { label: "Anasayfa", path: "/", icon: "🏠" },
        { label: "Profil", path: `/profile/${loggedInUsername}`, icon: "👤", authRequired: true },
        { label: "Admin", path: "/admin", icon: "⚙️", adminOnly: true },
    ];

    const handleLogout = () => {
        logout();
        // navigate("/login"); // AuthContext zaten yönlendiriyor
        setShowProfileMenu(false);
    };

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            // Hem butonun (menuRef) hem de menünün (dropdownRef) dışına tıklandıysa kapat
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


    return (
        <div className="hidden sm:flex flex-col gap-4 w-[68px] xl:w-[275px] h-screen sticky top-0 py-4 px-2 xl:px-4 border-r border-[#2f3336] overflow-y-auto">
            {/* LOGO */}
            <div
                onClick={() => navigate("/")}
                className="w-[50px] h-[50px] flex items-center justify-center rounded-full hover:bg-slate-900 transition-colors cursor-pointer mb-2 xl:ml-0"
            >
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
            </div>

            {/* MENU ITEMS */}
            <div className="flex flex-col gap-2">
                {menuItems.map((item) => {
                    if (item.authRequired && !loggedInUsername) return null;

                    const isAdmin = loggedInRoles?.some(r => (typeof r === 'string' ? r : r.authority || '').includes('ADMIN'));
                    if (item.adminOnly && !isAdmin) return null;

                    const isActive = location.pathname === item.path;

                    return (
                        <button
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className="flex items-center gap-4 p-3 rounded-full hover:bg-zinc-900/80 transition-all w-fit xl:w-full group"
                        >
                            <span className="text-2xl">{item.icon}</span>
                            <span className={`hidden xl:block text-xl mr-4 ${isActive ? 'font-bold' : 'font-normal'}`}>
                                {item.label}
                            </span>
                        </button>
                    )
                })}
            </div>



            {/* USER PROFILE */}
            {loggedInUsername && (
                <div className="mt-auto relative">
                    <div
                        ref={menuRef} // Using menuRef for the button to calculate position
                        className="flex items-center gap-3 p-3 rounded-full hover:bg-zinc-900/80 cursor-pointer transition-colors w-full select-none"
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                    >
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                            {loggedInUsername.charAt(0).toUpperCase()}
                        </div>
                        <div className="hidden xl:flex flex-col leading-tight">
                            <span className="font-bold text-white text-sm">{loggedInUsername}</span>
                            <span className="text-gray-500 text-sm">@{loggedInUsername}</span>
                        </div>
                        <div className="hidden xl:block ml-auto text-xl">...</div>
                    </div>

                    {showProfileMenu && (
                        <div
                            ref={dropdownRef} // Yeni ref buraya eklendi
                            className="fixed bg-black border border-[#2f3336] rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.1)] z-50 py-2 overflow-hidden mb-2 w-[300px]"
                            style={{
                                left: menuRef.current ? menuRef.current.getBoundingClientRect().left : '10px',
                                bottom: menuRef.current ? window.innerHeight - menuRef.current.getBoundingClientRect().top + 10 : '80px'
                                // Sidebar sol altta olduğu için bottom hesaplaması: window height - top position
                            }}
                        >
                            <button
                                className="block w-full text-left px-4 py-3 font-bold hover:bg-zinc-900 transition text-white"
                                onClick={handleLogout}
                            >
                                Çıkış yap @{loggedInUsername}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {!loggedInUsername && (
                <div className="mt-auto flex flex-col gap-2">
                    <button onClick={() => navigate("/login")} className="w-full border border-slate-600 font-bold rounded-full py-2 hover:bg-slate-900 transition">Giriş Yap</button>
                    <button onClick={() => navigate("/register")} className="w-full bg-white text-black font-bold rounded-full py-2 hover:bg-gray-200 transition">Kaydol</button>
                </div>
            )}
        </div>
    );
}

export default Sidebar;
