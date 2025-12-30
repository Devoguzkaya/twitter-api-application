package com.workintech.twitter.controller;

import com.workintech.twitter.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/like")
public class LikeController {

    private final LikeService likeService;

    @Autowired
    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @PostMapping("/{tweetId}")
    public void like(@PathVariable Long tweetId, Authentication authentication) {
        likeService.like(tweetId, authentication.getName());
    }

    @PostMapping("/dislike/{tweetId}")
    public void dislike(@PathVariable Long tweetId, Authentication authentication) {
        likeService.dislike(tweetId, authentication.getName());
    }
}
