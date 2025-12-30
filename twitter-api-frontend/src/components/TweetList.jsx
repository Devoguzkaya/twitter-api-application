import { useEffect, useState } from "react";
import TweetItem from "./TweetItem";
import { useAuth } from "../context/AuthContext"; // useAuth hook'unu import et

function TweetList({ lastUpdated, onAction, endpoint }) { // authHeader ve loggedInUsername kaldırıldı
  const [tweets, setTweets] = useState([]);
  const [message, setMessage] = useState(null);
  const { authHeader, loggedInUsername, apiUrl } = useAuth(); // AuthContext'ten çek

  useEffect(() => {
    if (!authHeader) return;
    const fetchTweets = async () => {
      try {
        const url = endpoint || `${apiUrl}/tweet`; // Dinamik URL
        const res = await fetch(url, {
          headers: { Authorization: authHeader },
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Tweetler alınamadı");
        }
        const data = await res.json();
        setTweets(data);
        setMessage(null);
      } catch (err) {
        setMessage(err.message);
      }
    };
    fetchTweets();
  }, [authHeader, lastUpdated, endpoint, apiUrl]); // apiUrl bağımlılıklara eklendi

  const handleDeleteFromList = (tweetId) => {
    setTweets(prev => prev.filter(t => t.id !== tweetId));
  };

  return (
    <div className="bg-slate-800 rounded p-4 flex flex-col gap-2">
      {!authHeader && (
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
        {tweets.length === 0 && authHeader && (
          <p className="text-sm text-gray-300">Henüz tweet yok.</p>
        )}
      </div>
    </div>
  );
}

export default TweetList;