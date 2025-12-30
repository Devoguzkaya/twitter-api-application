import { useState } from "react";
import { toast } from "react-toastify";
import tweetService from "../../services/tweetService";

function TweetContent({ tweet, isEditing, setIsEditing, onTweetUpdated }) {
    const [editContent, setEditContent] = useState(tweet.content);
    const [saving, setSaving] = useState(false);

    const handleUpdate = async () => {
        if (!editContent.trim()) return;
        setSaving(true);
        try {
            await tweetService.updateTweet(tweet.id, editContent);
            onTweetUpdated({ ...tweet, content: editContent });
            setIsEditing(false);
            toast.success("Tweet güncellendi!");
        } catch (err) {
            console.error(err);
            toast.error("Güncelleme başarısız");
        } finally {
            setSaving(false);
        }
    };

    if (isEditing) {
        return (
            <div className="mt-2" onClick={e => e.stopPropagation()}>
                <textarea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    className="w-full bg-slate-900 text-white p-3 rounded border border-slate-600 focus:ring-1 focus:ring-blue-500 outline-none text-base"
                    rows="4"
                />
                <div className="flex justify-end gap-3 mt-2">
                    <button
                        onClick={() => setIsEditing(false)}
                        className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
                        disabled={saving}
                    >
                        İptal
                    </button>
                    <button
                        onClick={handleUpdate}
                        className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded font-medium disabled:opacity-50 transition-colors"
                        disabled={saving}
                    >
                        {saving ? "Kaydediliyor..." : "Kaydet"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-2 text-gray-100 whitespace-pre-wrap text-[15px] leading-relaxed break-words">
            {tweet.content}
        </div>
    );
}

export default TweetContent;
