package com.workintech.twitter.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TweetRequest {

    @NotBlank(message = "Tweet content cannot be blank.")
    @Size(max=280, message = "Tweet content cannot exceed 280 characters.")
    private String content;
}
