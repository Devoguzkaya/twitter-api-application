package com.workintech.twitter.repository;

import com.workintech.twitter.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like,Long> {
    Optional<Like> findByTweetIdAndUserId(Long tweetId, Long userId);
    List<Like> findByUserId(Long userId);
    List<Like> findByTweetId(Long tweetId);
}
