package com.workintech.twitter.service;

import com.workintech.twitter.entity.Like;

import java.util.List;
import java.util.Optional;

public interface LikeService {
    List<Like> findAll();

    Like findById(Long id);

    List<Like> findByUserId(Long id);

    List<Like> findByTweetId(Long id);

    Optional<Like> findByTweetIdAndUserId(Long tweetId, Long userId);

    Like save(Like like);

    void deleteById(Long id);

    void like(Long tweetId, String username);

    void dislike(Long tweetId, String username);
}
