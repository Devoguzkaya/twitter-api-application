import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import TweetItem from "../components/TweetItem";
import { useAuth } from "../context/AuthContext"; // useAuth hook'unu import et

function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { authHeader, loggedInUsername, apiUrl } = useAuth(); // AuthContext'ten çek

  const [profileTweets, setProfileTweets] = useState([]);
  const [message, setMessage] = useState(null);

  const fetchProfileTweets = async () => {
    if (!authHeader) {
      setMessage("Giriş yapmalısın.");
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/tweet/user/${username}`, { // Dinamik URL
        headers: { Authorization: authHeader },
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Bilinmeyen bir hata oluştu." }));
        throw new Error(errorData.message || "Profil tweetleri alınamadı.");
      }
      const data = await res.json();
      setProfileTweets(data);
      setMessage(null);
    } catch (err) {
      console.error("Profil tweetleri çekilirken hata:", err);
      toast.error(err.message);
      setMessage(err.message);
    }
  };

  useEffect(() => {
    fetchProfileTweets();
  }, [username, authHeader, apiUrl]); // apiUrl bağımlılıklara eklendi

  // TweetItem'dan tetiklenen eylemler sonrası listeyi güncellemek için
  const handleTweetAction = () => {
    fetchProfileTweets();
  };

  const handleDeleteSuccess = (deletedTweetId) => {
    setProfileTweets(prev => prev.filter(t => t.id !== deletedTweetId));
  };


  return (
    <div className="flex-1 w-full max-w-2xl border-x border-gray-700">
      <div className="sticky top-0 bg-slate-900/80 backdrop-blur-md px-4 py-3 border-b border-gray-700">
        <h2 className="text-xl font-bold">@{username} Profili</h2>
      </div>

      <div className="p-4">
        {message && <p className="text-sm text-red-400 mb-4">{message}</p>}
        {profileTweets.length === 0 && !message && (
          <p className="text-sm text-gray-400">@{username} henüz tweet atmamış.</p>
        )}
        <div className="flex flex-col gap-3">
            {profileTweets.map((t) => (
            <TweetItem 
                key={`${t.id}-${t.retweetId || "orig"}`} 
                tweet={t}
                authHeader={authHeader}
                loggedInUsername={loggedInUsername}
                onAction={handleTweetAction}
                onDelete={handleDeleteSuccess}
                apiUrl={apiUrl}
            />
            ))}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;