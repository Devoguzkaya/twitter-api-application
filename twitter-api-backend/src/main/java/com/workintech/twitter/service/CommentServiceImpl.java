package com.workintech.twitter.service;

import com.workintech.twitter.dto.CommentRequest;
import com.workintech.twitter.dto.CommentResponse;
import com.workintech.twitter.entity.Comment;
import com.workintech.twitter.entity.Tweet;
import com.workintech.twitter.entity.User;
import com.workintech.twitter.exception.NotFoundException;
import com.workintech.twitter.repository.CommentRepository;
import com.workintech.twitter.repository.TweetRepository;
import com.workintech.twitter.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final TweetRepository tweetRepository;
    private final UserRepository userRepository;

    @Autowired
    public CommentServiceImpl(CommentRepository commentRepository, TweetRepository tweetRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.tweetRepository = tweetRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<CommentResponse> findAll() {
        return commentRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public CommentResponse findById(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Yorum bulunamadi, ID:", id));
        return toDto(comment);
    }

    @Override
    public List<CommentResponse> findByTweetId(Long tweetId) {
        return commentRepository.findByTweetId(tweetId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<CommentResponse> findByUserId(Long userId) {
        return commentRepository.findByUserId(userId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public CommentResponse create(Long tweetId, CommentRequest commentRequest, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User not found", 0L));
        Tweet tweet = tweetRepository.findById(tweetId)
                .orElseThrow(() -> new NotFoundException("Tweet not found", tweetId));

        Comment comment = new Comment();
        comment.setContent(commentRequest.getContent());
        comment.setUser(user);
        comment.setTweet(tweet);
        comment.setCreatedAt(LocalDateTime.now());

        Comment saved = commentRepository.save(comment);
        return toDto(saved);
    }

    @Override
    public CommentResponse update(Long id, CommentRequest commentRequest) {
        Comment existing = commentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Comment not found", id));
        existing.setContent(commentRequest.getContent());
        Comment updated = commentRepository.save(existing);
        return toDto(updated);
    }

    @Override
    public void deleteById(Long id) {
        commentRepository.deleteById(id);
    }

    private CommentResponse toDto(Comment comment) {
        return new CommentResponse(
                comment.getId(),
                comment.getContent(),
                comment.getCreatedAt(),
                comment.getUser().getUsername(),
                comment.getTweet().getId()
        );
    }
}
