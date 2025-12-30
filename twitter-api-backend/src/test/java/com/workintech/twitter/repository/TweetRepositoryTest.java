package com.workintech.twitter.repository;

import com.workintech.twitter.entity.Tweet;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TweetRepositoryTest {

    @Mock
    TweetRepository tweetRepository;

    @Test
    void findByUserId_returnsTweets() {
        Tweet tweet = new Tweet();
        tweet.setId(1L);
        when(tweetRepository.findByUserId(10L)).thenReturn(Collections.singletonList(tweet));

        List<Tweet> result = tweetRepository.findByUserId(10L);

        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getId());
        verify(tweetRepository).findByUserId(10L);
    }
}
