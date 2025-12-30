import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import commentService from "../../services/commentService";

function CommentItem({ comment, onDeleteFromList, onUpdateInList }) {
    const { loggedInUsername } = useAuth();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [menuOpen, setMenuOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const buttonRef = useRef(null);

    const toggleMenu = (e) => {
        e.stopPropagation();
        if (menuOpen) {
            setMenuOpen(false);
            return;
        }

        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            // Menüyü butonun altına ve sağa hizalı (menu width 128px approx)
            // Eğer ekranın en altındaysa yukarı açsın (basit kontrol: window.innerHeight - rect.bottom < 150)
            const spaceBelow = window.innerHeight - rect.bottom;
            const openUpwards = spaceBelow < 150;

            setMenuPosition({
                top: openUpwards ? rect.top - 80 : rect.bottom, // 80px approx menu height
                left: rect.right - 128 // 128px menu width (w-32)
            });
            setMenuOpen(true);
        }
    };

    const isAuthor = loggedInUsername === comment.authorUsername;

    const handleUserClick = (e) => {
        e.stopPropagation();
        navigate(`/profile/${comment.authorUsername}`);
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
        setMenuOpen(false); // Menüyü kapat
    };

    const confirmDelete = async () => {
        try {
            await commentService.deleteComment(comment.id);
            onDeleteFromList(comment.id);
            toast.success("Yorum silindi");
        } catch (err) {
            console.error(err);
            toast.error("Yorum silinemedi");
        } finally {
            setShowDeleteModal(false);
        }
    };

    const handleUpdate = async () => {
        try {
            const updated = await commentService.updateComment(comment.id, editContent);
            onUpdateInList(comment.id, updated.content);
            setIsEditing(false);
            toast.success("Yorum güncellendi");
        } catch (err) {
            console.error(err);
            toast.error("Yorum güncellenemedi");
        }
    };

    // Close menu when clicking outside or scrolling
    const menuContainerRef = useRef(null);

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
        window.addEventListener("scroll", handleScroll, true); // true for capturing scroll in sub-elements
        return () => {
            document.removeEventListener("mousedown", handleInteraction);
            window.removeEventListener("scroll", handleScroll, true);
        };
    }, [menuOpen]);

    return (
        <div className="flex gap-3 px-4 py-3 border-b border-[#2f3336] hover:bg-white/[0.03] transition-colors">
            {/* AVATAR */}
            <div className="shrink-0 cursor-pointer" onClick={handleUserClick}>
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white text-sm">
                    {comment.authorUsername.charAt(0).toUpperCase()}
                </div>
            </div>

            <div className="flex-1 min-w-0">
                {/* HEADER */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-1 text-[15px] leading-tight mb-1">
                        <span className="font-bold text-white hover:underline cursor-pointer" onClick={handleUserClick}>
                            {comment.authorUsername}
                        </span>
                        <span className="text-gray-500">@{comment.authorUsername}</span>
                    </div>

                    {isAuthor && (
                        <>
                            <div className="relative shrink-0">
                                <button
                                    ref={buttonRef}
                                    onClick={toggleMenu}
                                    className="text-gray-300 hover:text-[#1d9bf0] hover:bg-[#1d9bf0]/10 rounded-full p-1 transition-colors -mt-1 -mr-1"
                                >
                                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></svg>
                                </button>
                            </div>
                            {menuOpen && (
                                <div
                                    ref={menuContainerRef}
                                    style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
                                    className="fixed w-32 bg-black border border-[#2f3336] shadow-[0_0_15px_rgba(255,255,255,0.1)] rounded-xl z-50 overflow-hidden py-1"
                                >
                                    <button
                                        onClick={() => { setIsEditing(true); setMenuOpen(false); }}
                                        className="block w-full text-left px-4 py-3 text-sm text-white hover:bg-zinc-900 flex items-center gap-2"
                                    >
                                        <span>✏️</span> Düzenle
                                    </button>
                                    <button
                                        onClick={handleDeleteClick}
                                        className="block w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-zinc-900 flex items-center gap-2"
                                    >
                                        <span>🗑️</span> Sil
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* CONTENT */}
                {isEditing ? (
                    <div className="mt-1">
                        <textarea
                            value={editContent}
                            onChange={e => setEditContent(e.target.value)}
                            className="w-full bg-transparent text-white border border-[#2f3336] rounded p-2 focus:border-[#1d9bf0] outline-none resize-none text-[15px]"
                            rows="2"
                        />
                        <div className="flex justify-end gap-2 mt-2">
                            <button onClick={() => setIsEditing(false)} className="text-sm font-bold text-white hover:bg-white/10 px-3 py-1.5 rounded-full transition-colors">İptal</button>
                            <button onClick={handleUpdate} className="text-sm font-bold bg-white text-black hover:bg-opacity-90 px-3 py-1.5 rounded-full transition-colors">Kaydet</button>
                        </div>
                    </div>
                ) : (
                    <div className="text-[15px] text-white whitespace-pre-wrap break-words">
                        {comment.content}
                    </div>
                )}
            </div>

            {/* DELETE MODAL */}
            {showDeleteModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
                    onClick={() => setShowDeleteModal(false)}
                >
                    <div
                        className="bg-black w-[320px] p-8 rounded-2xl border border-none shadow-2xl flex flex-col gap-3"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-bold text-white">Yorumu sil?</h3>
                        <p className="text-gray-500 text-sm">Bu işlem geri alınamaz, yorum silinecek.</p>

                        <div className="flex flex-col gap-3 mt-4">
                            <button
                                onClick={confirmDelete}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-full transition-colors w-full"
                            >
                                Sil
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="border border-slate-600 hover:bg-slate-900 text-white font-bold py-3 rounded-full transition-colors w-full"
                            >
                                İptal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CommentItem;
