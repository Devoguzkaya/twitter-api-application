import { useState } from "react";
import { toast } from 'react-toastify';
import { useAuth } from "../context/AuthContext";
import tweetService from "../services/tweetService";

function TweetForm({ onTweetPosted }) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth(); // Sadece giriş kontrolü için

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Tweet içeriği boş olamaz.");
      return;
    }
    if (!isAuthenticated) {
      toast.error("Giriş yapmalısın.");
      return;
    }

    setIsLoading(true);
    try {
      await tweetService.postTweet(content);

      setContent("");
      toast.success("Tweet başarıyla gönderildi!");
      if (onTweetPosted) {
        onTweetPosted();
      }
    } catch (err) {
      console.error("Tweet gönderilirken hata:", err);
      const errorMsg = err.response?.data?.message || err.message || "Tweet gönderilemedi.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4 border-b border-gray-700">
      <textarea
        className="w-full p-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="3"
        placeholder="Neler oluyor?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={280}
      />
      <div className="flex justify-between items-center text-sm text-gray-400">
        <span>{content.length}/280</span>
        <button
          type="submit"
          disabled={isLoading || !content.trim()}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full disabled:opacity-50"
        >
          {isLoading ? "Gönderiliyor..." : "Tweetle"}
        </button>
      </div>
    </form>
  );
}

export default TweetForm;