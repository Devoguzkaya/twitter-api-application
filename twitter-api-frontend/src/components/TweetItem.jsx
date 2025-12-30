import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useAuth } from "../context/AuthContext";
import tweetService from "../services/tweetService";
import commentService from "../services/commentService";

function TweetItem({ tweet: initialTweet, onAction, onDelete }) {
    const [tweet, setTweet] = useState(initialTweet);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(tweet.content);
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [commentContent, setCommentContent] = useState("");
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);

    // Comment Action States
    const [commentMenuOpenId, setCommentMenuOpenId] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editCommentContent, setEditCommentContent] = useState("");

    const navigate = useNavigate();
    const { loggedInUsername } = useAuth(); // Removed authHeader and apiUrl

    useEffect(() => {
        setTweet(initialTweet);
    }, [initialTweet]);

    const handleUserClick = (e, username) => {
        e.stopPropagation();
        navigate(`/profile/${username}`);
    };

    const toggleMenu = (e) => {
        e.stopPropagation();
        setMenuOpen(!menuOpen);
    };

    // --- ACTIONS ---

    const handleToggleLike = async (e) => {
        e.stopPropagation();
        if (!loggedInUsername) return toast.error("Giriş yapmalısın!"); // Check loggedInUsername instead of authHeader

        // Optimistic Update
        setTweet(prev => ({
            ...prev,
            liked: !prev.liked,
            likeCount: prev.liked ? prev.likeCount - 1 : prev.likeCount + 1
        }));

        try {
            await tweetService.toggleLike(tweet.id, tweet.liked);
            if (onAction) onAction();
        } catch (err) {
            console.error(err);
            toast.error("Beğeni işlemi başarısız");
            // Rollback
            setTweet(prev => ({
                ...prev,
                liked: !prev.liked,
                likeCount: prev.liked ? prev.likeCount - 1 : prev.likeCount + 1
            }));
        }
    };

    const handleToggleRetweet = async (e) => {
        e.stopPropagation();
        if (!loggedInUsername) return toast.error("Giriş yapmalısın!");
        if (loggedInUsername === tweet.authorUsername) return toast.warning("Kendi tweetini retweetleyemezsin");

        // Optimistic Update
        const isRetweeted = tweet.isRetweeted || tweet.retweeted;
        setTweet(prev => ({
            ...prev,
            isRetweeted: !isRetweeted,
            retweeted: !isRetweeted,
            retweetCount: isRetweeted ? prev.retweetCount - 1 : prev.retweetCount + 1
        }));

        try {
            await tweetService.toggleRetweet(tweet.id, isRetweeted);

            if (onAction) onAction();
            toast.success(isRetweeted ? "Retweet geri alındı" : "Retweetlendi!");
        } catch (err) {
            console.error(err);
            toast.error("Retweet işlemi başarısız");
            // Rollback
            const isRetweeted = tweet.isRetweeted || tweet.retweeted;
            setTweet(prev => ({
                ...prev,
                isRetweeted: isRetweeted,
                retweeted: isRetweeted,
                retweetCount: isRetweeted ? prev.retweetCount + 1 : prev.retweetCount - 1
            }));
        }
    };

    const handleDeleteTweet = async () => {
        if (!window.confirm("Silmek istediğine emin misin?")) return;
        try {
            await tweetService.deleteTweet(tweet.id);
            toast.success("Tweet silindi!");
            if (onDelete) onDelete(tweet.id);
            if (onAction) onAction();
        } catch (err) {
            console.error(err);
            toast.error("Silme başarısız");
        }
    };

    const handleUpdateTweet = async () => {
        try {
            const updated = await tweetService.updateTweet(tweet.id, editContent);
            setTweet(prev => ({ ...prev, content: updated.content }));
            setIsEditing(false);
            toast.success("Tweet güncellendi!");
        } catch (err) {
            console.error(err);
            toast.error("Güncelleme başarısız");
        }
    };

    // --- COMMENTS ---

    const fetchComments = async (e) => {
        if (e) e.stopPropagation();
        if (!showComments) {
            try {
                const data = await commentService.getCommentsByTweetId(tweet.id);
                setComments(data);
            } catch (err) { console.error(err); }
        }
        setShowComments(!showComments);
    };

    const submitComment = async (e) => {
        e.preventDefault();
        if (!commentContent.trim()) return;
        try {
            await commentService.postComment(tweet.id, commentContent);

            setCommentContent("");
            setShowReplyBox(false);
            if (!showComments) setShowComments(true);

            // Yorumları yeniden çek
            const data = await commentService.getCommentsByTweetId(tweet.id);
            setComments(data);

            // Tweet commentCount güncelle (Optimistic)
            setTweet(prev => ({ ...prev, commentCount: prev.commentCount + 1 }));
            if (onAction) onAction();
            toast.success("Yorum gönderildi!");

        } catch (err) { console.error(err); toast.error("Yorum gönderilemedi"); }
    };

    // --- COMMENT EDIT/DELETE ---

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Yorumu sil?")) return;
        try {
            await commentService.deleteComment(commentId);
            setComments(prev => prev.filter(c => c.id !== commentId));
            setTweet(prev => ({ ...prev, commentCount: prev.commentCount - 1 }));
            toast.success("Yorum silindi");
        } catch (err) { console.error(err); toast.error("Hata oluştu"); }
    };

    const handleUpdateComment = async (commentId) => {
        try {
            const updated = await commentService.updateComment(commentId, editCommentContent);
            setComments(prev => prev.map(c => c.id === commentId ? { ...c, content: updated.content } : c));
            setEditingCommentId(null);
            toast.success("Yorum güncellendi");
        } catch (err) { console.error(err); toast.error("Hata oluştu"); }
    };


    const toggleReplyBox = (tweetId) => {
        if (showReplyBox === tweetId) {
            setShowReplyBox(null);
            setCommentContent("");
        } else {
            setShowReplyBox(tweetId);
            setCommentContent("");
        }
    };

    const toggleCommentMenu = (e, commentId) => {
        e.stopPropagation();
        setCommentMenuOpenId(commentMenuOpenId === commentId ? null : commentId);
    };


    return (
        <div className="bg-slate-800 rounded-lg shadow-md mb-3 border border-slate-700 flex flex-col relative">
            <div className="p-4 rounded-t-lg relative">
                {/* MENU */}
                {loggedInUsername === tweet.authorUsername && !tweet.retweetId && (
                    <div className="absolute top-2 right-2">
                        <button onClick={toggleMenu} className="text-gray-400 hover:text-white font-bold text-xl px-2">⋮</button>
                        {menuOpen && (
                            <div className="absolute right-0 mt-1 w-32 bg-slate-700 border border-slate-600 rounded shadow-lg z-10 flex flex-col">
                                <button onClick={(e) => { e.stopPropagation(); setIsEditing(true); setMenuOpen(false); }} className="text-left text-sm text-gray-200 hover:bg-slate-600 px-4 py-2 w-full">✏️ Düzenle</button>
                                <button onClick={(e) => { e.stopPropagation(); handleDeleteTweet(); }} className="text-left text-sm text-red-400 hover:bg-slate-600 px-4 py-2 w-full">🗑️ Sil</button>
                            </div>
                        )}
                    </div>
                )}

                {/* CONTENT */}
                <div className="cursor-pointer" onClick={() => navigate(`/tweet/${tweet.id}`)}>
                    <div className="flex items-center mb-2 pr-8">
                        <div className="flex flex-col">
                            {tweet.retweetId && (
                                <p className="text-xs text-amber-300 mr-2 flex items-center gap-1">
                                    <span>🔁</span>
                                    <span className="hover:underline cursor-pointer" onClick={(e) => handleUserClick(e, tweet.retweetedByUsername)}>@{tweet.retweetedByUsername}</span>
                                    <span>retweetledi</span>
                                </p>
                            )}
                            <p className="font-bold text-white text-base hover:text-blue-400 hover:underline w-fit" onClick={(e) => handleUserClick(e, tweet.authorUsername)}>@{tweet.authorUsername}</p>
                        </div>
                    </div>

                    {isEditing ? (
                        <div onClick={e => e.stopPropagation()} className="mt-2">
                            <textarea value={editContent} onChange={e => setEditContent(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded border border-slate-600" rows="3" />
                            <div className="flex justify-end gap-2 mt-2">
                                <button onClick={() => setIsEditing(false)} className="text-sm text-gray-400">İptal</button>
                                <button onClick={handleUpdateTweet} className="text-sm bg-blue-600 text-white px-3 py-1 rounded">Kaydet</button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-100 mt-2">{tweet.content}</p>
                    )}
                </div>
            </div>

            {/* ACTIONS */}
            <div className="px-4 pb-4">
                <div className="mt-3 flex gap-4">
                    {/* LIKE */}
                    <button onClick={handleToggleLike} className="group flex items-center gap-1 cursor-pointer transition-transform active:scale-75">
                        <div className="p-2 rounded-full group-hover:bg-pink-500/10">
                            <svg viewBox="0 0 24 24" className={`w-5 h-5 transition-colors duration-200 ${tweet.liked ? "fill-pink-600 text-pink-600" : "fill-transparent stroke-gray-500 stroke-2 group-hover:stroke-pink-500"}`}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                            </svg>
                        </div>
                        <span className={`text-sm ${tweet.liked ? "text-pink-600" : "text-gray-500 group-hover:text-pink-500"}`}>{tweet.likeCount}</span>
                    </button>

                    {/* RETWEET */}
                    {loggedInUsername !== tweet.authorUsername && (
                        <button onClick={handleToggleRetweet} className="group flex items-center gap-1 cursor-pointer transition-transform active:scale-75">
                            <span className={`text-lg ${(tweet.isRetweeted || tweet.retweeted) ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}>🔁</span>
                            <span className={`text-sm ${(tweet.isRetweeted || tweet.retweeted) ? "text-green-500" : "text-gray-500 group-hover:text-green-500"}`}>{tweet.retweetCount}</span>
                        </button>
                    )}

                    {/* REPLY */}
                    <button onClick={() => toggleReplyBox(tweet.id)} className="text-sm text-gray-400 hover:text-blue-500">💬</button>

                    {/* SHOW COMMENTS */}
                    <button onClick={fetchComments} className="text-sm text-gray-400 hover:text-indigo-400">
                        <span>({tweet.commentCount})</span>
                    </button>
                </div>

                {showReplyBox === tweet.id && (
                    <form onSubmit={submitComment} className="mt-3 flex flex-col gap-2 bg-slate-700 p-3 rounded-md">
                        <textarea className="w-full p-2 rounded bg-slate-600 text-white text-sm" rows="2" placeholder="Yanıtla..." value={commentContent} onChange={e => setCommentContent(e.target.value)} />
                        <div className="flex justify-end"><button type="submit" className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full">Yanıtla</button></div>
                    </form>
                )}

                {showComments && (
                    <div className="mt-2 border-t border-slate-700 pt-2 flex flex-col gap-2">
                        {comments.map(c => (
                            <div key={c.id} className="text-sm text-gray-200 bg-slate-750 p-2 rounded relative group">

                                {/* COMMENT MENU BUTTON */}
                                {loggedInUsername === c.authorUsername && (
                                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100">
                                        <button
                                            onClick={(e) => toggleCommentMenu(e, c.id)}
                                            className="text-gray-400 hover:text-white font-bold text-lg px-1">⋮</button>
                                        {commentMenuOpenId === c.id && (
                                            <div className="absolute right-0 mt-1 w-28 bg-slate-600 border border-slate-500 rounded shadow-lg z-20 flex flex-col">
                                                <button onClick={() => { setEditingCommentId(c.id); setEditCommentContent(c.content); setCommentMenuOpenId(null); }} className="text-left text-xs text-gray-200 hover:bg-slate-500 px-3 py-2 w-full">✏️ Düzenle</button>
                                                <button onClick={() => handleDeleteComment(c.id)} className="text-left text-xs text-red-300 hover:bg-slate-500 px-3 py-2 w-full">🗑️ Sil</button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <span
                                    className="font-semibold text-blue-300 mr-2"
                                    onClick={(e) => handleUserClick(e, c.authorUsername)}
                                >
                                    @{c.authorUsername}:
                                </span>

                                {/* COMMENT CONTENT OR EDIT FORM */}
                                {editingCommentId === c.id ? (
                                    <div onClick={(e) => e.stopPropagation()} className="mt-1">
                                        <textarea
                                            value={editCommentContent}
                                            onChange={(e) => setEditCommentContent(e.target.value)}
                                            className="w-full bg-slate-900 text-white p-1 rounded border border-slate-600 text-xs"
                                            rows="2"
                                        />
                                        <div className="flex justify-end gap-2 mt-1">
                                            <button onClick={() => setEditingCommentId(null)} className="text-xs text-gray-400">İptal</button>
                                            <button onClick={() => handleUpdateComment(c.id)} className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">Kaydet</button>
                                        </div>
                                    </div>
                                ) : (
                                    <span>{c.content}</span>
                                )}

                            </div>
                        ))}
                        {comments.length === 0 && <p className="text-xs text-gray-400">Yorum yok.</p>}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TweetItem;