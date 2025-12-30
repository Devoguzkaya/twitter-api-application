import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function TweetHeader({ tweet, onEditClick, onDeleteClick }) {
    const { loggedInUsername } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef(null);
    const menuContainerRef = useRef(null);

    const isAuthor = loggedInUsername === tweet.authorUsername;
    const isRetweet = Boolean(tweet.retweetId);

    // Format createdAt manually '2s', '4h', '12 Mar' style logic is complex, using simple date for now
    const formattedDate = new Date(tweet.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' });

    const toggleMenu = (e) => {
        e.stopPropagation();
        if (menuOpen) {
            setMenuOpen(false);
            return;
        }

        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            // Menüyü butonun altına ve sağa hizalı
            // Eğer ekranın en altındaysa yukarı açsın
            const spaceBelow = window.innerHeight - rect.bottom;
            const openUpwards = spaceBelow < 150;

            setMenuPosition({
                top: openUpwards ? rect.top - 80 : rect.bottom,
                left: rect.right - 128 // 128px menu width
            });
            setMenuOpen(true);
        }
    };

    // Close menu when clicking outside or scrolling
    useEffect(() => {
        function handleInteraction(event) {
            if (menuContainerRef.current && !menuContainerRef.current.contains(event.target) && buttonRef.current && !buttonRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }
        function handleScroll() {
            if (menuOpen) setMenuOpen(false);
        }

        document.addEventListener("mousedown", handleInteraction);
        window.addEventListener("scroll", handleScroll, true);
        return () => {
            document.removeEventListener("mousedown", handleInteraction);
            window.removeEventListener("scroll", handleScroll, true);
        };
    }, [menuOpen]);

    return (
        <div className="flex justify-between items-start relative pb-1">
            <div className="flex items-center gap-1 text-[15px] flex-wrap leading-tight">
                {isRetweet && (
                    <div className="w-full text-xs text-gray-500 font-bold flex items-center gap-1 mb-1">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-currentColor"><path d="M4.75 3.79l4.603 4.3-1.706 1.82L6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13V20H7.75c-2.347 0-4.25-1.9-4.25-4.25V8.38L1.853 9.91.147 8.09l4.603-4.3zm11.5 2.71H11V4h5.25c2.347 0 4.25 1.9 4.25 4.25v7.37l1.647-1.53 1.706 1.82-4.603 4.3-4.603-4.3 1.706-1.82L18 15.62V8.25c0-.97-.784-1.75-1.75-1.75z"></path></svg>
                        <Link to={`/profile/${tweet.retweetedByUsername}`} onClick={e => e.stopPropagation()} className="hover:underline">
                            {tweet.retweetedByUsername} tarafından repostlandı
                        </Link>
                    </div>
                )}

                <Link
                    to={`/profile/${tweet.authorUsername}`}
                    onClick={e => e.stopPropagation()}
                    className="font-bold text-white hover:underline truncate"
                >
                    {tweet.authorUsername}
                </Link>
                <span className="text-gray-500 text-[15px] truncate ml-1">@{tweet.authorUsername}</span>
                <span className="text-gray-500 text-[15px] mx-1">·</span>
                <span className="text-gray-500 hover:underline text-[15px]">{formattedDate}</span>
            </div>

            {isAuthor && (
                <div className="relative group shrink-0">
                    <button
                        ref={buttonRef}
                        onClick={toggleMenu}
                        className="text-gray-300 hover:text-[#1d9bf0] hover:bg-[#1d9bf0]/10 rounded-full p-2 transition-colors -mt-2 -mr-2"
                    >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></svg>
                    </button>

                    {menuOpen && (
                        <div
                            ref={menuContainerRef}
                            style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
                            className="fixed w-32 bg-black border border-[#2f3336] shadow-[0_0_15px_rgba(255,255,255,0.1)] rounded-xl z-50 overflow-hidden py-1"
                        >
                            <button
                                className="block w-full text-left px-4 py-3 text-sm text-white hover:bg-zinc-900 flex items-center gap-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEditClick();
                                    setMenuOpen(false);
                                }}
                            >
                                <span>✏️</span> Düzenle
                            </button>
                            <button
                                className="block w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-zinc-900 flex items-center gap-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteClick();
                                    setMenuOpen(false);
                                }}
                            >
                                <span>🗑️</span> Sil
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default TweetHeader;
