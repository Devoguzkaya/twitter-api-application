package com.workintech.twitter.exception;

// Aranan veri (User, Tweet vb.) bulunamadiginda firlatilan ozel hata sinifi.
public class NotFoundException extends RuntimeException {
    public NotFoundException(String resource, Object id) {
        super(resource + " bulunamadi, ID: " + id);
    }
}