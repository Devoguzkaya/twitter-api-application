package com.workintech.twitter.service;

import com.workintech.twitter.entity.Like;
import com.workintech.twitter.exception.NotFoundException;
import com.workintech.twitter.repository.LikeRepository;
import com.workintech.twitter.service.LikeServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
// Begeni servisi testleri.
class LikeServiceTest {

    @Mock
    LikeRepository likeRepository;

    @InjectMocks
    LikeServiceImpl likeService;

    @Test
    // Begeni varsa dondur.
    void findById_whenExists_returnsLike() {
        Like like = new Like();
        like.setId(2L);
        when(likeRepository.findById(2L)).thenReturn(Optional.of(like));

        Like result = likeService.findById(2L);

        assertEquals(2L, result.getId());
        verify(likeRepository).findById(2L);
    }

    @Test
    // Begeni yoksa hata ver.
    void findById_whenNotExists_throwsNotFound() {
        when(likeRepository.findById(100L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> likeService.findById(100L));
    }
}