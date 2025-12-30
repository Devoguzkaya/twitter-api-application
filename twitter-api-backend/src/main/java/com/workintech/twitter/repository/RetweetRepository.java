package com.workintech.twitter.repository;

import com.workintech.twitter.entity.Retweet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;
@Repository
public interface RetweetRepository extends JpaRepository<Retweet,Long> {
    Optional<Retweet> findByTweetIdAndUserId(Long tweetId, Long userId);
    List<Retweet> findByUser_Username(String username);
    List<Retweet> findByTweetId(Long tweetId);
}
