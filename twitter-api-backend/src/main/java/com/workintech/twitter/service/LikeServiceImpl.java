package com.workintech.twitter.service;

import com.workintech.twitter.entity.Like;
import com.workintech.twitter.entity.Tweet;
import com.workintech.twitter.entity.User;
import com.workintech.twitter.exception.NotFoundException;
import com.workintech.twitter.repository.LikeRepository;
import com.workintech.twitter.repository.TweetRepository;
import com.workintech.twitter.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class LikeServiceImpl implements LikeService {

    private final LikeRepository likeRepository;
    private final TweetRepository tweetRepository;
    private final UserRepository userRepository;

    @Autowired
    public LikeServiceImpl(LikeRepository likeRepository, TweetRepository tweetRepository, UserRepository userRepository) {
        this.likeRepository = likeRepository;
        this.tweetRepository = tweetRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<Like> findAll() {
        return likeRepository.findAll();
    }

    @Override
    public Like findById(Long id) {
        return likeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Begeni bulunamadi, ID:", id));
    }

    @Override
    public List<Like> findByUserId(Long id) {
        return likeRepository.findByUserId(id);
    }

    @Override
    public List<Like> findByTweetId(Long id) {
        return likeRepository.findByTweetId(id);
    }

    @Override
    public Optional<Like> findByTweetIdAndUserId(Long tweetId, Long userId) {
        return likeRepository.findByTweetIdAndUserId(tweetId, userId);
    }

    @Override
    public Like save(Like like) {
        return likeRepository.save(like);
    }

    @Override
    public void deleteById(Long id) {
        likeRepository.deleteById(id);
    }

    @Override
    public void like(Long tweetId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User not found", 0L));
        Tweet tweet = tweetRepository.findById(tweetId)
                .orElseThrow(() -> new NotFoundException("Tweet not found", tweetId));

        Optional<Like> existing = likeRepository.findByTweetIdAndUserId(tweetId, user.getId());
        if (existing.isPresent()) {
            return;
        }

        Like like = new Like();
        like.setTweet(tweet);
        like.setUser(user);
        likeRepository.save(like);
    }

    @Override
    public void dislike(Long tweetId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User not found", 0L));

        Optional<Like> existing = likeRepository.findByTweetIdAndUserId(tweetId, user.getId());
        existing.ifPresent(like -> likeRepository.deleteById(like.getId()));
    }
}
