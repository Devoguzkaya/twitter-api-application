package com.workintech.twitter.service;

import com.workintech.twitter.dto.CommentResponse;
import com.workintech.twitter.entity.Comment;
import com.workintech.twitter.exception.NotFoundException;
import com.workintech.twitter.repository.CommentRepository;
import com.workintech.twitter.repository.TweetRepository;
import com.workintech.twitter.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
// Yorum servisi testleri.
class CommentServiceTest {

    @Mock
    CommentRepository commentRepository;
    @Mock
    TweetRepository tweetRepository; // Yeni eklenen bagimlilik
    @Mock
    UserRepository userRepository; // Yeni eklenen bagimlilik

    @InjectMocks
    CommentServiceImpl commentService;

    @Test
    // Yorum varsa sorunsuz donmeli.
    void findById_whenExists_returnsCommentResponse() {
        Comment comment = new Comment();
        comment.setId(4L);
        comment.setContent("Test content");
        comment.setCreatedAt(LocalDateTime.now());
        // User ve Tweet set etmeliyiz ki convertToDto calissin
        comment.setUser(new com.workintech.twitter.entity.User()); // Sadece instance, icini doldurmaya gerek yok simdi
        comment.setTweet(new com.workintech.twitter.entity.Tweet()); // Sadece instance

        when(commentRepository.findById(4L)).thenReturn(Optional.of(comment));

        CommentResponse result = commentService.findById(4L);

        assertNotNull(result);
        assertEquals(4L, result.getId());
        assertEquals("Test content", result.getContent());
        verify(commentRepository).findById(4L);
    }

    @Test
    // Yorum yoksa hata vermeli.
    void findById_whenNotExists_throwsNotFound() {
        when(commentRepository.findById(400L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> commentService.findById(400L));
    }
}