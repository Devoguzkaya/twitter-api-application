package com.workintech.twitter.service;

import com.workintech.twitter.dto.TweetResponse;
import com.workintech.twitter.entity.Retweet;
import com.workintech.twitter.entity.Tweet;
import com.workintech.twitter.entity.User;
import com.workintech.twitter.exception.NotFoundException;
import com.workintech.twitter.exception.UnauthorizedActionException;
import com.workintech.twitter.repository.RetweetRepository;
import com.workintech.twitter.repository.TweetRepository;
import com.workintech.twitter.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RetweetServiceImpl implements RetweetService {

    private final RetweetRepository retweetRepository;
    private final TweetRepository tweetRepository;
    private final UserRepository userRepository;

    @Autowired
    public RetweetServiceImpl(RetweetRepository retweetRepository, TweetRepository tweetRepository, UserRepository userRepository) {
        this.retweetRepository = retweetRepository;
        this.tweetRepository = tweetRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<TweetResponse> findAll() {
        return retweetRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Retweet findById(Long id) {
        return retweetRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Retweet bulunamadi, ID:", id));
    }

    @Override
    public Optional<Retweet> findByTweetIdAndUserId(Long tweetId, Long userId) {
        return retweetRepository.findByTweetIdAndUserId(tweetId, userId);
    }

    @Override
    public List<TweetResponse> findByUsername(String username) {
        return retweetRepository.findByUser_Username(username).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<Retweet> findByTweetId(Long id) {
        return retweetRepository.findByTweetId(id);
    }

    @Override
    public Retweet save(Retweet retweet) {
        return retweetRepository.save(retweet);
    }

    @Override
    public void deleteById(Long id) {
        retweetRepository.deleteById(id);
    }

    @Override
    public void retweet(Long tweetId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User not found", 0L));
        Tweet tweet = tweetRepository.findById(tweetId)
                .orElseThrow(() -> new NotFoundException("Tweet not found", tweetId));

        if (tweet.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedActionException("Kendi tweetini retweetleyemezsin!");
        }

        Optional<Retweet> existing = retweetRepository.findByTweetIdAndUserId(tweetId, user.getId());
        if (existing.isPresent()) {
            return;
        }

        Retweet retweet = new Retweet();
        retweet.setTweet(tweet);
        retweet.setUser(user);
        retweet.setRetweetedAt(LocalDateTime.now());
        retweetRepository.save(retweet);
    }

    @Override
    public void unretweet(Long tweetId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User not found", 0L));

        Optional<Retweet> existing = retweetRepository.findByTweetIdAndUserId(tweetId, user.getId());
        existing.ifPresent(r -> retweetRepository.deleteById(r.getId()));
    }

    private String getCurrentUsername() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !authentication.getName().equals("anonymousUser")) {
            return authentication.getName();
        }
        return null;
    }

    private TweetResponse convertToDto(Retweet retweet) {
        String currentUsername = getCurrentUsername();
        boolean liked = false;
        boolean isRetweeted = false;

        if (currentUsername != null) {
            User currentUser = userRepository.findByUsername(currentUsername).orElse(null);
            if (currentUser != null) {
                if (retweet.getTweet().getLikes() != null) {
                    liked = retweet.getTweet().getLikes().stream()
                            .anyMatch(like -> like.getUser().getUsername().equals(currentUsername));
                }
                isRetweeted = retweetRepository.findByTweetIdAndUserId(retweet.getTweet().getId(), currentUser.getId()).isPresent();
            }
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
                isRetweeted
        );
    }
}