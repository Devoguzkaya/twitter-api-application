package com.workintech.twitter.service;

import com.workintech.twitter.dto.CommentRequest;
import com.workintech.twitter.dto.CommentResponse;
import com.workintech.twitter.entity.Comment;

import java.util.List;

public interface CommentService {
    List<CommentResponse> findAll();

    CommentResponse findById(Long id);

    List<CommentResponse> findByTweetId(Long tweetId);

    List<CommentResponse> findByUserId(Long userId);

    CommentResponse create(Long tweetId, CommentRequest commentRequest, String username);
    
    CommentResponse update(Long id, CommentRequest commentRequest);

    void deleteById(Long id);
}
