import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useAuth } from "../context/AuthContext";
import TweetItem from "../components/TweetItem"; // TweetItem'ı kullanmak için

function TweetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authHeader, loggedInUsername, apiUrl } = useAuth();
  const [tweet, setTweet] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchTweetDetails = async () => {
    if (!authHeader) {
      setMessage("Giriş yapmalısın.");
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/tweet/findById/${id}`, {
        headers: { Authorization: authHeader },
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Bilinmeyen bir hata oluştu." }));
        throw new Error(errorData.message || "Tweet detayları alınamadı.");
      }
      const data = await res.json();
      setTweet(data);
      setMessage(null);
    } catch (err) {
      console.error("Tweet detayları çekilirken hata:", err);
      toast.error(err.message);
      setMessage(err.message);
    }
  };

  useEffect(() => {
    fetchTweetDetails();
  }, [id, authHeader]);

  // TweetItem'dan tetiklenen eylemler sonrası listeyi güncellemek için
  const handleTweetAction = () => {
    fetchTweetDetails();
  };

  const handleDeleteSuccess = (deletedTweetId) => {
    toast.success("Tweet başarıyla silindi. Anasayfaya dönülüyor.");
    navigate("/");
  };


  if (message) {
    return <div className="p-4 text-center text-red-400">{message}</div>;
  }

  if (!tweet) {
    return <div className="p-4 text-center text-gray-400">Yükleniyor...</div>;
  }

  return (
    <div className="flex-1 w-full max-w-2xl border-x border-gray-700">
      <div className="sticky top-0 bg-slate-900/80 backdrop-blur-md px-4 py-3 border-b border-gray-700 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4 text-blue-400 hover:text-blue-300">
          ←
        </button>
        <h2 className="text-xl font-bold">Tweet Detayı</h2>
      </div>

      <div className="p-4">
        <TweetItem 
            tweet={tweet}
            authHeader={authHeader}
            loggedInUsername={loggedInUsername}
            onAction={handleTweetAction}
            onDelete={handleDeleteSuccess}
            apiUrl={apiUrl}
        />
      </div>
    </div>
  );
}

export default TweetDetail;