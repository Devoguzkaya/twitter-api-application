package com.workintech.twitter.controller;

import org.springframework.data.domain.Pageable;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.workintech.twitter.dto.TweetRequest;
import com.workintech.twitter.dto.TweetResponse;

import com.workintech.twitter.service.RetweetService;
import com.workintech.twitter.service.TweetService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;

import java.time.LocalDateTime;
import java.util.Collections;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TweetController.class)
@Import(TweetControllerTest.TestConfig.class)
class TweetControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    TweetService tweetService;

    @Autowired
    RetweetService retweetService;

    @Autowired
    ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "oguzhan")
    void getTweets_shouldReturnOk() throws Exception {
        Mockito.when(tweetService.findAll(Mockito.any(Pageable.class))).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/tweet"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "oguzhan")
    void createTweet_shouldReturnOk() throws Exception {
        TweetResponse tweetResponse = new TweetResponse(1L, "merhaba", LocalDateTime.now(), "oguzhan", 0, 0, 0, null,
                null, LocalDateTime.now(), false, false);

        Mockito.when(tweetService.create(Mockito.any(TweetRequest.class))).thenReturn(tweetResponse);

        TweetRequest request = new TweetRequest("merhaba");
        mockMvc.perform(post("/tweet")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .with(SecurityMockMvcRequestPostProcessors.csrf()))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "hacker")
    void deleteTweet_whenNotOwner_shouldReturnForbidden() throws Exception {
        TweetResponse tweetResponse = new TweetResponse(1L, "merhaba", LocalDateTime.now(), "oguzhan", 0, 0, 0, null,
                null, LocalDateTime.now(), false, false);

        Mockito.when(tweetService.findById(1L)).thenReturn(tweetResponse);

        mockMvc.perform(delete("/tweet/1")
                .with(SecurityMockMvcRequestPostProcessors.csrf()))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "oguzhan")
    void createTweet_whenContentIsInvalid_shouldReturnBadRequest() throws Exception {
        TweetRequest invalidRequest = new TweetRequest("");

        mockMvc.perform(post("/tweet")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest))
                .with(SecurityMockMvcRequestPostProcessors.csrf()))
                .andExpect(status().isBadRequest());
    }

    static class TestConfig {
        @Bean
        TweetService tweetService() {
            return Mockito.mock(TweetService.class);
        }

        @Bean
        RetweetService retweetService() {
            return Mockito.mock(RetweetService.class);
        }
    }
}
