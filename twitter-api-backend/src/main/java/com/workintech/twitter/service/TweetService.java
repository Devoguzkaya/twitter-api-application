package com.workintech.twitter.service;

import com.workintech.twitter.dto.TweetResponse;
import com.workintech.twitter.entity.Tweet;

import java.util.List;

import org.springframework.data.domain.Pageable;

public interface TweetService {
    List<TweetResponse> findAll(Pageable pageable);

    TweetResponse findById(Long id);

    List<TweetResponse> findByUserId(Long id);

    List<TweetResponse> findByUsername(String username);

    TweetResponse create(com.workintech.twitter.dto.TweetRequest tweetRequest);

    TweetResponse update(Long id, com.workintech.twitter.dto.TweetRequest tweetRequest);

    void deleteById(Long id);
}
