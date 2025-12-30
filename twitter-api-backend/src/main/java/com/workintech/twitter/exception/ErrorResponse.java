package com.workintech.twitter.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
// Hata olustugunda Frontend'e donecegimiz standart cevap kalibi.
public class ErrorResponse {
    private int status;   // HTTP Durum Kodu (400, 404, 500 vb.)
    private String message; // Hatanin aciklamasi
    private long timestamp; // Hatanin oldugu zaman
}