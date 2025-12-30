package com.workintech.twitter.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TweetResponse {

    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private String authorUsername;
    private int likeCount;
    private int commentCount;
    private int retweetCount; // Eklendi

    private Long retweetId;
    private String retweetedByUsername;
    private LocalDateTime retweetedAt;
    private boolean liked;
    private boolean isRetweeted; // Eklendi

}
