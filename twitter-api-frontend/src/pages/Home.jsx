import { useState } from "react";
import TweetList from "../components/TweetList";
import TweetForm from "../components/TweetForm";
import { useAuth } from "../context/AuthContext"; // useAuth hook'unu import et

function Home() {
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const { authHeader, loggedInUsername, apiUrl } = useAuth(); // AuthContext'ten çek

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
          <TweetForm authHeader={authHeader} onTweetPosted={handleTweetPosted} apiUrl={apiUrl} />
        </div>
      )}

      <TweetList authHeader={authHeader} lastUpdated={lastUpdated} onAction={handleTweetPosted} loggedInUsername={loggedInUsername} endpoint={`${apiUrl}/tweet`} /> {/* apiUrl ilettik */}
    </div>
  );
}

export default Home;