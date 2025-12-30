package com.workintech.twitter.controller;

import com.workintech.twitter.dto.UserResponse;
import com.workintech.twitter.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/")
    // Kullanıcıları DTO olarak listeler
    public List<UserResponse> findAll(){
        return userService.findAll();
    }

    @GetMapping("/{id}")
    // Tek kullanıcı DTO döndürür
    public UserResponse findById(@PathVariable Long id){
        return userService.findById(id);
    }
}