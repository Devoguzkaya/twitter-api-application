package com.workintech.twitter.controller;

import com.workintech.twitter.dto.CommentRequest;
import com.workintech.twitter.dto.CommentResponse;
import com.workintech.twitter.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comment")
public class CommentController {
    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/tweet/{tweetId}")
    public List<CommentResponse> findByTweet(@PathVariable Long tweetId) {
        return commentService.findByTweetId(tweetId);
    }

    @GetMapping("/user/{userId}")
    public List<CommentResponse> findByUserId(@PathVariable Long userId) {
        return commentService.findByUserId(userId);
    }

    @GetMapping("/{id}")
    public CommentResponse findById(@PathVariable Long id) {
        return commentService.findById(id);
    }

    @PostMapping("/{tweetId}")
    public CommentResponse save(@PathVariable Long tweetId,
                                @Valid @RequestBody CommentRequest commentRequest,
                                Authentication authentication) {
         return commentService.create(tweetId, commentRequest, authentication.getName());
    }

    @PutMapping("/{id}")
    public CommentResponse update(@PathVariable Long id,
                                  @Valid @RequestBody CommentRequest commentRequest,
                                  Authentication authentication) {
        CommentResponse existing = commentService.findById(id);
        String username = authentication.getName();

        if(!existing.getAuthorUsername().equals(username)) {
            throw new com.workintech.twitter.exception.UnauthorizedActionException("Baskasinin yorumunu guncelleyemezsin!");
        }
        return commentService.update(id, commentRequest);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Long id, Authentication authentication) {
        CommentResponse existing = commentService.findById(id);
        String username = authentication.getName();

        if(!existing.getAuthorUsername().equals(username)) {
            throw new com.workintech.twitter.exception.UnauthorizedActionException("Baskasinin yorumunu silemezsin!");
        }
        commentService.deleteById(id);
    }
}
