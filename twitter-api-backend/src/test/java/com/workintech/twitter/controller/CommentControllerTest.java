package com.workintech.twitter.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.workintech.twitter.dto.CommentRequest;
import com.workintech.twitter.dto.CommentResponse;
import com.workintech.twitter.dto.TweetResponse;
import com.workintech.twitter.dto.UserResponse;
import com.workintech.twitter.service.CommentService;
import com.workintech.twitter.service.TweetService;
import com.workintech.twitter.service.UserService;
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CommentController.class)
@Import(CommentControllerTest.TestConfig.class)
class CommentControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    CommentService commentService;

    @Autowired
    TweetService tweetService;

    @Autowired
    UserService userService;

    @Autowired
    ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "oguzhan")
    void getCommentsByTweet_shouldReturnOk() throws Exception {
        Mockito.when(commentService.findByTweetId(1L)).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/comment/tweet/1"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "oguzhan")
    void postComment_shouldReturnOk() throws Exception {
        UserResponse userResponse = new UserResponse(1L, "oguzhan", "oguzhan@example.com", Collections.emptyList());
        // Updated constructor with all 12 parameters including retweetCount (0), liked (false), isRetweeted (false)
        TweetResponse tweetResponse = new TweetResponse(1L, "Test content", LocalDateTime.now(), "oguzhan", 0, 0, 0, null, null, LocalDateTime.now(), false, false);
        
        CommentResponse commentResponse = new CommentResponse(10L, "selam", LocalDateTime.now(), "oguzhan", 1L);

        Mockito.when(userService.findByUsername("oguzhan")).thenReturn(userResponse);
        Mockito.when(tweetService.findById(1L)).thenReturn(tweetResponse);
        
        Mockito.when(commentService.create(Mockito.eq(1L), Mockito.any(CommentRequest.class), Mockito.eq("oguzhan"))).thenReturn(commentResponse);

        CommentRequest req = new CommentRequest("selam");
        mockMvc.perform(post("/comment/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req))
                        .with(SecurityMockMvcRequestPostProcessors.csrf()))
                .andExpect(status().isOk());
    }

    static class TestConfig {
        @Bean
        CommentService commentService() {
            return Mockito.mock(CommentService.class);
        }
        @Bean
        TweetService tweetService() {
            return Mockito.mock(TweetService.class);
        }
        @Bean
        UserService userService() {
            return Mockito.mock(UserService.class);
        }
    }
}