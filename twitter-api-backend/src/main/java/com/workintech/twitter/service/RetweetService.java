package com.workintech.twitter.service;

import com.workintech.twitter.dto.TweetResponse;
import com.workintech.twitter.entity.Retweet;

import java.util.List;
import java.util.Optional;

public interface RetweetService {
    List<TweetResponse> findAll();

    Retweet findById(Long id);

    Optional<Retweet> findByTweetIdAndUserId(Long tweetId, Long userId);

    List<TweetResponse> findByUsername(String username);

    List<Retweet> findByTweetId(Long id);

    Retweet save(Retweet retweet);

    void deleteById(Long id);

    void retweet(Long tweetId, String username);

    void unretweet(Long tweetId, String username);
}
