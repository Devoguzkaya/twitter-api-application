package com.workintech.twitter.service;

import com.workintech.twitter.dto.TweetResponse;
import com.workintech.twitter.entity.Tweet;
import com.workintech.twitter.entity.User;
import com.workintech.twitter.exception.NotFoundException;
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
// Tweet servisinin birim testleri (Unit Tests).
// Repository bagimliligini Mockito ile taklit ediyoruz (Mock).
class TweetServiceTest {

    @Mock
    TweetRepository tweetRepository;
    @Mock
    UserRepository userRepository; // Yeni eklenen bagimlilik

    @InjectMocks
    TweetServiceImpl tweetService;

    @Test
    // Eger tweet varsa, dogru tweeti donmeli.
    void findById_whenExists_returnsTweetResponse() {
        User author = new User();
        author.setUsername("testuser");
        
        Tweet tweet = new Tweet();
        tweet.setId(1L);
        tweet.setContent("Test tweet content");
        tweet.setCreatedAt(LocalDateTime.now());
        tweet.setUser(author); // DTO conversion needs user info

        when(tweetRepository.findById(1L)).thenReturn(Optional.of(tweet));

        TweetResponse result = tweetService.findById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test tweet content", result.getContent());
        assertEquals("testuser", result.getAuthorUsername());
        verify(tweetRepository).findById(1L);
    }

    @Test
    // Eger tweet yoksa, NotFoundException hatasi firlatmali.
    void findById_whenNotExists_throwsNotFound() {
        when(tweetRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> tweetService.findById(99L));
    }
}