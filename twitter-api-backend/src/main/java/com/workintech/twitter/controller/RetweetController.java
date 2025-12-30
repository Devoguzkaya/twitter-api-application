package com.workintech.twitter.controller;

import com.workintech.twitter.service.RetweetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/retweet")
public class RetweetController {

    private final RetweetService retweetService;

    @Autowired
    public RetweetController(RetweetService retweetService) {
        this.retweetService = retweetService;
    }

    @PostMapping("/{tweetId}")
    public void retweet(@PathVariable Long tweetId, Authentication authentication) {
        retweetService.retweet(tweetId, authentication.getName());
    }

    @DeleteMapping("/{tweetId}")
    public void unretweet(@PathVariable Long tweetId, Authentication authentication) {
        retweetService.unretweet(tweetId, authentication.getName());
    }
}
