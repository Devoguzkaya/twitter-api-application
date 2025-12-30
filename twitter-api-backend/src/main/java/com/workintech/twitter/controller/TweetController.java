package com.workintech.twitter.controller;

import com.workintech.twitter.dto.TweetRequest;
import com.workintech.twitter.dto.TweetResponse;
import com.workintech.twitter.service.RetweetService;
import com.workintech.twitter.service.TweetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/tweet")
public class TweetController {

    private final TweetService tweetService;
    private final RetweetService retweetService;

    @Autowired
    public TweetController(TweetService tweetService, RetweetService retweetService) {
        this.tweetService = tweetService;
        this.retweetService = retweetService;
    }

    @GetMapping
    public List<TweetResponse> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return tweetService.findAll(pageable);
    }

    @GetMapping("/findByUserId/{userId}")
    public List<TweetResponse> findByUserId(@PathVariable Long userId) {
        List<TweetResponse> tweets = tweetService.findByUserId(userId);
        tweets.sort(Comparator.comparing(TweetResponse::getCreatedAt).reversed());
        return tweets;
    }

    @GetMapping("/user/{username}")
    public List<TweetResponse> findByUsername(@PathVariable String username) {
        List<TweetResponse> feed = new ArrayList<>();

        feed.addAll(tweetService.findByUsername(username));
        feed.addAll(retweetService.findByUsername(username));

        feed.sort(Comparator.comparing(TweetResponse::getRetweetedAt).reversed());
        return feed;
    }

    @GetMapping("/findById/{id}")
    public TweetResponse findById(@PathVariable Long id) {
        return tweetService.findById(id);
    }

    @PostMapping
    public TweetResponse save(@Valid @RequestBody TweetRequest tweetRequest) {
        return tweetService.create(tweetRequest);
    }

    @PutMapping("/{id}")
    public TweetResponse update(@PathVariable Long id,
            @Valid @RequestBody TweetRequest tweetRequest,
            Authentication authentication) {
        TweetResponse existing = tweetService.findById(id);
        String username = authentication.getName();

        if (!existing.getAuthorUsername().equals(username)) {
            throw new com.workintech.twitter.exception.UnauthorizedActionException(
                    "Baskasinin tweetini guncelleyemezsin!");
        }

        return tweetService.update(id, tweetRequest);
    }

    @DeleteMapping("/{id}")

    public void delete(@PathVariable Long id, Authentication authentication) {
        TweetResponse existing = tweetService.findById(id);
        String username = authentication.getName();

        if (!existing.getAuthorUsername().equals(username)) {
            throw new com.workintech.twitter.exception.UnauthorizedActionException("Baskasinin tweetini silemezsin!");
        }
        tweetService.deleteById(id);
    }
}