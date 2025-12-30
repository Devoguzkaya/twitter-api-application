package com.workintech.twitter.exception;

// Kullanicinin yetkisi olmayan bir islem yapmaya calistiginda (orn. baskasinin tweetini silmek) firlatilan hata.
public class UnauthorizedActionException extends RuntimeException {
    public UnauthorizedActionException(String message) {
        super(message);
    }
}