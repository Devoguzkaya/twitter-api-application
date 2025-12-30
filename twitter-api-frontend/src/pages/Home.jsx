import { useState } from "react";
import TweetList from "../components/TweetList";
import TweetForm from "../components/TweetForm";
import { useAuth } from "../context/AuthContext";

function Home() {
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const { loggedInUsername } = useAuth(); // Sadece conditional rendering için username yeterli mi yoksa isAuthenticated mı?

  // TweetForm içeride isAuthenticated kontrolü yapıyor ama burada buttonu hiç göstermemek daha şık olabilir.
  // loggedInUsername varsa göster.

  const handleTweetPosted = () => {
    setLastUpdated(Date.now()); // Tweet gönderildikten sonra listeyi yenilemek için
  };

  return (
    <div className="flex-1 w-full max-w-2xl border-x border-gray-700">
      <div className="sticky top-0 bg-slate-900/80 backdrop-blur-md px-4 py-3 border-b border-gray-700">
        <h2 className="text-xl font-bold">Anasayfa</h2>
      </div>

      {loggedInUsername && (
        <div className="border-b border-gray-700 p-4">
          <TweetForm onTweetPosted={handleTweetPosted} />
        </div>
      )}

      <TweetList lastUpdated={lastUpdated} onAction={handleTweetPosted} endpoint="/tweet" />
    </div>
  );
}

export default Home;