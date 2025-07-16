package com.excelR.user_crud.service;

import com.excelR.user_crud.model.User;
import com.excelR.user_crud.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepo userRepo;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        Map<String, Object> attributes = oAuth2User.getAttributes();

        String email = (String) attributes.get("email");

        if (email == null || email.isBlank()) {
            String login = (String) attributes.get("login");
            email = login + "@github.local";
        }

        Optional<User> userOpt = userRepo.findByUserName(email);

        if (userOpt.isEmpty()) {
            User newUser = new User();
            newUser.setUserName(email);
            newUser.setPassword(" ");
            newUser.setRole("USER");
            newUser.setMobile(0L);
            userRepo.save(newUser);
        } else {
        }

        return oAuth2User;
    }

}
