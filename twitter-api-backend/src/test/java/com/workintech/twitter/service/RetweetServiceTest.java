package com.workintech.twitter.service;

import com.workintech.twitter.entity.Retweet;
import com.workintech.twitter.exception.NotFoundException;
import com.workintech.twitter.repository.RetweetRepository;
import com.workintech.twitter.service.RetweetServiceImpl;
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
// Retweet servisi testleri.
class RetweetServiceTest {

    @Mock
    RetweetRepository retweetRepository;

    @InjectMocks
    RetweetServiceImpl retweetService;

    @Test
    // Retweet varsa dogru getir.
    void findById_whenExists_returnsRetweet() {
        Retweet retweet = new Retweet();
        retweet.setId(3L);
        when(retweetRepository.findById(3L)).thenReturn(Optional.of(retweet));

        Retweet result = retweetService.findById(3L);

        assertEquals(3L, result.getId());
        verify(retweetRepository).findById(3L);
    }

    @Test
    // Retweet yoksa hata firlat.
    void findById_whenNotExists_throwsNotFound() {
        when(retweetRepository.findById(200L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> retweetService.findById(200L));
    }
}