import { toast } from "react-toastify";
import tweetService from "../../services/tweetService";
import { useAuth } from "../../context/AuthContext";

function TweetActions({ tweet, onTweetUpdated, onReplyClick, onTimelineUpdate }) {
    const { loggedInUsername } = useAuth();
    const isAuthor = loggedInUsername === tweet.authorUsername;

    const handleLike = async (e) => {
        e.stopPropagation();
        // Optimistic UI update
        const newLikedState = !tweet.liked;
        const newLikeCount = newLikedState ? tweet.likeCount + 1 : tweet.likeCount - 1;

        // Anlık olarak parent'a bildirip arayüzü güncelle
        onTweetUpdated({ ...tweet, liked: newLikedState, likeCount: newLikeCount });

        try {
            await tweetService.toggleLike(tweet.id, tweet.liked);
        } catch (err) {
            // Hata olursa geri al
            onTweetUpdated(tweet);
            toast.error("İşlem başarısız.");
        }
    };

    const handleRetweet = async (e) => {
        e.stopPropagation();

        // Optimistic UI update (Anlık renk değişimi için)
        // tweet.retweeted backendden gelen boolean değer.
        const alreadyRetweeted = tweet.retweeted;
        const newRetweetedState = !alreadyRetweeted;
        const newRetweetCount = newRetweetedState ? tweet.retweetCount + 1 : tweet.retweetCount - 1;

        onTweetUpdated({ ...tweet, retweeted: newRetweetedState, retweetCount: newRetweetCount });

        try {
            await tweetService.toggleRetweet(tweet.id, alreadyRetweeted);

            // Başarılı olursa listeyi yenile (retweet en üste gelsin veya unretweet silinsin)
            if (onTimelineUpdate) {
                onTimelineUpdate();
            }
        } catch (err) {
            onTweetUpdated(tweet);
            toast.error("İşlem başarısız.");
        }
    };

    const ActionButton = ({ icon, count, colorClass, hoverBgClass, active, onClick, activeColorClass }) => (
        <div className={`flex items-center group cursor-pointer ${active ? activeColorClass : "text-gray-500"}`} onClick={onClick}>
            <div className={`p-2 rounded-full transition-colors ${hoverBgClass} relative`}>
                <span className="w-[18px] h-[18px] block fill-current">{icon}</span>
            </div>
            <span className={`text-xs ml-1 transition-colors ${active ? activeColorClass : "group-hover:" + colorClass}`}>
                {count > 0 ? count : ""}
            </span>
        </div>
    );

    return (
        <div className="flex items-center justify-between w-full max-w-[300px]">
            {/* REPLY */}
            <ActionButton
                icon={<svg viewBox="0 0 24 24" className="fill-current"><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></svg>}
                count={tweet.commentCount}
                colorClass="text-[#1d9bf0]"
                hoverBgClass="hover:bg-[#1d9bf0]/10 group-hover:text-[#1d9bf0]"
                onClick={onReplyClick}
            />

            {/* RETWEET - Kendi tweetinde gizli */}
            <div className="w-[50px]"> {/* Boşluk korumak için wrapper, veya tamamen gizle */}
                {!isAuthor && (
                    <ActionButton
                        icon={<svg viewBox="0 0 24 24" className="fill-current"><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path></svg>}
                        count={tweet.retweetCount}
                        active={tweet.retweeted}
                        activeColorClass="text-[#00ba7c]"
                        colorClass="text-[#00ba7c]"
                        hoverBgClass="hover:bg-[#00ba7c]/10 group-hover:text-[#00ba7c]"
                        onClick={handleRetweet}
                    />
                )}
                {isAuthor && tweet.retweetCount > 0 && (
                    <div className="flex items-center text-gray-500 cursor-default opacity-50">
                        <div className="p-2">
                            <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current"><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path></svg>
                        </div>
                        <span className="text-xs ml-1">{tweet.retweetCount}</span>
                    </div>
                )}
                {isAuthor && tweet.retweetCount === 0 && <div className="w-[34px]"></div>}
            </div>

            {/* LIKE */}
            <ActionButton
                icon={tweet.liked
                    ? <svg viewBox="0 0 24 24" className="fill-current"><path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.505.3-.505-.3c-4.378-2.55-7.028-5.19-8.379-7.67-1.06-1.94-1.114-4.63.88-6.84 1.83-2.12 4.515-1.97 6.16-1.33C12.19 6.55 12 10 12 10s.19-3.46 1.844-4.98c1.645-.64 4.33-0.79 6.16 1.33 1.995 2.21 1.94 4.9.88 6.84z"></path></svg>
                    : <svg viewBox="0 0 24 24" className="fill-current"><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.505.3-.505-.3c-4.378-2.55-7.028-5.19-8.379-7.67-1.06-1.94-1.114-4.63.88-6.84 1.83-2.12 4.515-1.97 6.16-1.33C12.19 6.55 12 10 12 10s.19-3.46 1.844-4.98c1.645-.64 4.33-0.79 6.16 1.33 1.995 2.21 1.94 4.9.88 6.84z"></path></svg>
                }
                count={tweet.likeCount}
                active={tweet.liked}
                activeColorClass="text-[#f91880]"
                colorClass="text-[#f91880]"
                hoverBgClass="hover:bg-[#f91880]/10 group-hover:text-[#f91880]"
                onClick={handleLike}
            />

            {/* Boş div share butonu yerine, layout bozulmasın diye */}
            <div className="w-[34px]"></div>
        </div>
    );
}

export default TweetActions;
