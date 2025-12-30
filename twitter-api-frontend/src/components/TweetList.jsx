import { useEffect, useState } from "react";
import TweetItem from "./TweetItem";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../api/axiosClient";

function TweetList({ lastUpdated, onAction, endpoint }) {
  const [tweets, setTweets] = useState([]);
  const [message, setMessage] = useState(null);
  const { isAuthenticated } = useAuth(); // Sadece giriş kontrolü

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchTweets = async () => {
      try {
        // endpoint relative path olmalı (örn: '/tweet')
        const url = endpoint || '/tweet';
        const res = await axiosClient.get(url);
        setTweets(res.data);
        setMessage(null);
      } catch (err) {
        console.error("Tweet listesi alınamadı:", err);
        setMessage(err.response?.data?.message || err.message || "Tweetler alınamadı");
      }
    };
    fetchTweets();
  }, [isAuthenticated, lastUpdated, endpoint]);

  const handleDeleteFromList = (tweetId) => {
    setTweets(prev => prev.filter(t => t.id !== tweetId));
  };

  return (
    <div className="bg-slate-800 rounded p-4 flex flex-col gap-2">
      {!isAuthenticated && (
        <p className="text-sm text-gray-300">Tweetleri görmek için giriş yap.</p>
      )}
      {message && <p className="text-sm text-red-300">{message}</p>}
      <div className="flex flex-col gap-3">
        {tweets.map((t) => (
          <TweetItem
            key={`${t.id}-${t.retweetId || "orig"}`}
            tweet={t}
            onAction={onAction}
            onDelete={handleDeleteFromList}
          />
        ))}
        {tweets.length === 0 && isAuthenticated && (
          <p className="text-sm text-gray-300">Henüz tweet yok.</p>
        )}
      </div>
    </div>
  );
}

export default TweetList;