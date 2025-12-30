import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import CommentItem from "./CommentItem";
import commentService from "../../services/commentService";

function CommentSection({ tweetId, onCommentCountChange }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const data = await commentService.getCommentsByTweetId(tweetId);
                setComments(data);
            } catch (err) {
                console.error(err);
                toast.error("Yorumlar yüklenemedi");
            } finally {
                setLoading(false);
            }
        };
        fetchComments();
    }, [tweetId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            // Backend comment objesi dönmeli ama dönmezse manuel ekleriz
            // Servis postComment: (tweetId, content) -> response data (yeni yorum veya boş)
            // Varsayım: backend yeni eklenen yorumu dönmüyor olabilir, o yüzden listeyi refresh etmek gerekebilir
            // Ama kodda res.ok ise listeyi refresh ediyordu. Biz optimistik ekleyelim veya döneni kullanalım.
            // Önceki kodda: commentService yoktu, fetch vardı.
            // Biz commentService.postComment yazdık.

            await commentService.postComment(tweetId, newComment);
            setNewComment("");

            // Listeyi güncellemek için tekrar fetch edebiliriz veya dönen değeri ekleyebiliriz
            // Garanti olsun diye tekrar fetch edelim (maliyet düşük)
            const updatedComments = await commentService.getCommentsByTweetId(tweetId);
            setComments(updatedComments);

            toast.success("Yorum gönderildi!");
            // Parent count update
            if (onCommentCountChange) onCommentCountChange(1); // +1 increment
        } catch (err) {
            console.error(err);
            toast.error("Yorum gönderilemedi");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteFromList = (commentId) => {
        setComments(prev => prev.filter(c => c.id !== commentId));
        if (onCommentCountChange) onCommentCountChange(-1); // -1 decrement
    };

    const handleUpdateInList = (commentId, newContent) => {
        setComments(prev => prev.map(c => c.id === commentId ? { ...c, content: newContent } : c));
    };

    if (loading) return <div className="text-xs text-gray-400 py-2">Yorumlar yükleniyor...</div>;

    return (
        <div className="mt-2 border-t border-slate-700 pt-2 flex flex-col gap-2">
            {/* FORM */}
            <form onSubmit={handleSubmit} className="flex gap-2 mb-2">
                <input
                    type="text"
                    className="flex-1 bg-slate-700 text-white text-sm rounded px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Yanıtla..."
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={submitting || !newComment.trim()}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded disabled:opacity-50 transition-colors"
                >
                    {submitting ? "..." : "Yanıtla"}
                </button>
            </form>

            {/* LIST */}
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                {comments.map(c => (
                    <CommentItem
                        key={c.id}
                        comment={c}
                        onDeleteFromList={handleDeleteFromList}
                        onUpdateInList={handleUpdateInList}
                    />
                ))}
                {comments.length === 0 && <p className="text-xs text-gray-500 text-center py-2">Henüz yorum yok.</p>}
            </div>
        </div>
    );
}

export default CommentSection;
