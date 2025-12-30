package com.workintech.twitter.service;

import com.workintech.twitter.dto.TweetRequest;
import com.workintech.twitter.dto.TweetResponse;
import com.workintech.twitter.entity.Retweet;
import com.workintech.twitter.entity.Tweet;
import com.workintech.twitter.entity.User;
import com.workintech.twitter.exception.NotFoundException;
import com.workintech.twitter.repository.RetweetRepository;
import com.workintech.twitter.repository.TweetRepository;
import com.workintech.twitter.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TweetServiceImpl implements TweetService {

    private final TweetRepository tweetRepository;
    private final UserRepository userRepository;
    private final RetweetRepository retweetRepository;

    @Autowired
    public TweetServiceImpl(TweetRepository tweetRepository, UserRepository userRepository,
            RetweetRepository retweetRepository) {
        this.tweetRepository = tweetRepository;
        this.userRepository = userRepository;
        this.retweetRepository = retweetRepository;
    }

    @Override
    public List<TweetResponse> findAll(Pageable pageable) {
        Page<Tweet> tweetsPage = tweetRepository.findAll(pageable);
        Page<Retweet> retweetsPage = retweetRepository.findAll(pageable);

        List<TweetResponse> feed = new ArrayList<>();

        String currentUsername = getCurrentUsername();
        User currentUser = currentUsername != null ? userRepository.findByUsername(currentUsername).orElse(null) : null;

        feed.addAll(tweetsPage.getContent().stream()
                .map(tweet -> convertToDto(tweet, currentUser))
                .collect(Collectors.toList()));

        feed.addAll(retweetsPage.getContent().stream()
                .map(retweet -> convertRetweetToDto(retweet, currentUser))
                .collect(Collectors.toList()));

        feed.sort(Comparator.comparing(
                (TweetResponse tr) -> tr.getRetweetedAt() != null ? tr.getRetweetedAt() : tr.getCreatedAt(),
                Comparator.nullsLast(Comparator.reverseOrder())));

        int pageSize = pageable.getPageSize();
        if (feed.size() > pageSize) {
            return feed.subList(0, pageSize);
        }

        return feed;
    }

    @Override
    public TweetResponse findById(Long id) {
        Tweet tweet = tweetRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Tweet bulunamadi, ID:", id));

        String currentUsername = getCurrentUsername();
        User currentUser = currentUsername != null ? userRepository.findByUsername(currentUsername).orElse(null) : null;

        return convertToDto(tweet, currentUser);
    }

    @Override
    public List<TweetResponse> findByUserId(Long id) {
        String currentUsername = getCurrentUsername();
        User currentUser = currentUsername != null ? userRepository.findByUsername(currentUsername).orElse(null) : null;

        return tweetRepository.findByUserId(id).stream()
                .map(tweet -> convertToDto(tweet, currentUser))
                .collect(Collectors.toList());
    }

    @Override
    public List<TweetResponse> findByUsername(String username) {
        String currentUsername = getCurrentUsername();
        User currentUser = currentUsername != null ? userRepository.findByUsername(currentUsername).orElse(null) : null;

        return tweetRepository.findByUser_Username(username).stream()
                .map(tweet -> convertToDto(tweet, currentUser))
                .collect(Collectors.toList());
    }

    @Override
    public TweetResponse create(TweetRequest tweetRequest) {
        String username = getCurrentUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User not found: ", 0L));

        Tweet tweet = new Tweet();
        tweet.setContent(tweetRequest.getContent());
        tweet.setUser(user);

        Tweet savedTweet = tweetRepository.save(tweet);
        return convertToDto(savedTweet, user);
    }

    @Override
    public TweetResponse update(Long id, TweetRequest tweetRequest) {
        Tweet tweet = tweetRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Tweet bulunamadi, ID:", id));
        tweet.setContent(tweetRequest.getContent());
        Tweet updatedTweet = tweetRepository.save(tweet);

        String currentUsername = getCurrentUsername();
        User currentUser = currentUsername != null ? userRepository.findByUsername(currentUsername).orElse(null) : null;

        return convertToDto(updatedTweet, currentUser);
    }

    @Override
    public void deleteById(Long id) {
        tweetRepository.deleteById(id);
    }

    private String getCurrentUsername() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()
                && !authentication.getName().equals("anonymousUser")) {
            return authentication.getName();
        }
        return null;
    }

    private TweetResponse convertToDto(Tweet tweet, User currentUser) {
        boolean liked = false;
        boolean isRetweeted = false;

        if (currentUser != null) {
            String currentUsername = currentUser.getUsername();
            if (tweet.getLikes() != null) {
                liked = tweet.getLikes().stream()
                        .anyMatch(like -> like.getUser().getUsername().equals(currentUsername));
            }
            // Retweet check still hits DB, but we optimized the user fetch part.
            // Further optimization would require batch fetching retweets.
            isRetweeted = retweetRepository.findByTweetIdAndUserId(tweet.getId(), currentUser.getId()).isPresent();
        }

        return new TweetResponse(
                tweet.getId(),
                tweet.getContent(),
                tweet.getCreatedAt(),
                tweet.getUser().getUsername(),
                tweet.getLikes() != null ? tweet.getLikes().size() : 0,
                tweet.getComments() != null ? tweet.getComments().size() : 0,
                tweet.getRetweets() != null ? tweet.getRetweets().size() : 0,
                null,
                null,
                tweet.getCreatedAt(),
                liked,
                isRetweeted);
    }

    private TweetResponse convertRetweetToDto(Retweet retweet, User currentUser) {
        boolean liked = false;
        boolean isRetweeted = false;

        if (currentUser != null) {
            String currentUsername = currentUser.getUsername();
            if (retweet.getTweet().getLikes() != null) {
                liked = retweet.getTweet().getLikes().stream()
                        .anyMatch(like -> like.getUser().getUsername().equals(currentUsername));
            }
            isRetweeted = retweetRepository.findByTweetIdAndUserId(retweet.getTweet().getId(), currentUser.getId())
                    .isPresent();
        }

        return new TweetResponse(
                retweet.getTweet().getId(),
                retweet.getTweet().getContent(),
                retweet.getTweet().getCreatedAt(),
                retweet.getTweet().getUser().getUsername(),
                retweet.getTweet().getLikes() != null ? retweet.getTweet().getLikes().size() : 0,
                retweet.getTweet().getComments() != null ? retweet.getTweet().getComments().size() : 0,
                retweet.getTweet().getRetweets() != null ? retweet.getTweet().getRetweets().size() : 0,
                retweet.getId(),
                retweet.getUser().getUsername(),
                retweet.getRetweetedAt(),
                liked,
                isRetweeted);
    }
}