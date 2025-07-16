package com.excelR.user_crud.service;

import com.excelR.user_crud.model.User;
import com.excelR.user_crud.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepo.findByUserName(username)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setUserName(username);
                    newUser.setPassword(""); 
                    newUser.setRole("USER");
                    newUser.setMobile(0L);
                    userRepo.save(newUser);
                    return newUser;
                });

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUserName())
                .password(user.getPassword())
                .roles(user.getRole()) 
                .build();
    }
}
