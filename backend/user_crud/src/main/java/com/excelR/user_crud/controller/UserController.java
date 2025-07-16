package com.excelR.user_crud.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.excelR.user_crud.dao.UserDao;
import com.excelR.user_crud.model.User;

@CrossOrigin(origins = "*",methods = {RequestMethod.POST,RequestMethod.GET,RequestMethod.PUT,RequestMethod.DELETE})
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserDao userDao;

   
//	   http://localhost:8080/user/profile
    @GetMapping("/profile")
    public ResponseEntity<User> getOwnProfile(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        Optional<User> user = userDao.fetchByUserName(username);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
//	   http://localhost:8080/user/update
    @PutMapping("/update")
    public ResponseEntity<User> updateOwnProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody User updatedData) {
        String username = userDetails.getUsername();
        Optional<User> userOpt = userDao.fetchByUserName(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setMobile(updatedData.getMobile());
            user.setPassword(updatedData.getPassword()); 
            User updatedUser = userDao.saveUser(user);
            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
//	   http://localhost:8080/user/delete
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteOwnProfile(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        Optional<User> userOpt = userDao.fetchByUserName(username);
        if (userOpt.isPresent()) {
            userDao.delete((int) userOpt.get().getId());
            return ResponseEntity.ok("Your account has been deleted.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

  
}
