import { useState } from "react";
import { toast } from 'react-toastify';
import { useAuth } from "../context/AuthContext"; // useAuth hook'unu import et

function TweetForm({ onTweetPosted }) { // authHeader prop'u kaldırıldı
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { authHeader, apiUrl } = useAuth(); // AuthContext'ten çek

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Tweet içeriği boş olamaz.");
      return;
    }
    if (!authHeader) {
      toast.error("Giriş yapmalısın.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/tweet`, { // Dinamik URL
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Bilinmeyen bir hata oluştu." }));
        throw new Error(errorData.message || "Tweet gönderilemedi.");
      }

      setContent("");
      toast.success("Tweet başarıyla gönderildi!");
      if (onTweetPosted) {
        onTweetPosted();
      }
    } catch (err) {
      console.error("Tweet gönderilirken hata:", err);
      toast.error(err.message);
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