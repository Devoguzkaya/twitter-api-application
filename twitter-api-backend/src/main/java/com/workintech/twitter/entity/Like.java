package com.workintech.twitter.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="tweet_like")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(of ="id")
public class Like {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="user_id",nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name="tweet_id",nullable = false)
    private Tweet tweet;
}
