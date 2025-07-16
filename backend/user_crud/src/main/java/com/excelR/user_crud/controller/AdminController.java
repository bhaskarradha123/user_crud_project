package com.excelR.user_crud.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.excelR.user_crud.dao.UserDao;
import com.excelR.user_crud.model.User;
@CrossOrigin(origins = "*",methods = {RequestMethod.POST,RequestMethod.GET,RequestMethod.PUT,RequestMethod.DELETE})
@RestController
@RequestMapping("/admin")
public class AdminController {
	 @Autowired
	    private UserDao userDao;

	  
//	   http://localhost:8080/admin/fetchAllUsers
	    @GetMapping("/fetchAllUsers")
	    public ResponseEntity<List<User>> getAllUsers() {
	        List<User> users = userDao.fetchAllUser();
	        return ResponseEntity.ok(users);
	    }
	    
//		   http://localhost:8080/admin/delete/1
	    @DeleteMapping("/delete/{id}")
	    public ResponseEntity<?> deleteById(@PathVariable int id) {
	        User deleted = userDao.delete(id);
	        if (deleted != null) {
	            return ResponseEntity.ok("User with ID " + id + " deleted.");
	        } else {
	            return ResponseEntity.notFound().build();
	        }
	    }
//		   http://localhost:8080/update/update/1
	    @PutMapping("/update/{id}")
	    public ResponseEntity<?> updateUserById(@PathVariable long id, @RequestBody User updatedData) {
	        Optional<User> userOpt = userDao.fetchById((int) id);
	        if (userOpt.isPresent()) {
	            User user = userOpt.get();

	            user.setMobile(updatedData.getMobile());

	            if (updatedData.getPassword() != null && !updatedData.getPassword().isEmpty()) {
		            userDao.saveUser(user);

	            }


	            return ResponseEntity.ok(user);
	        } else {
	            return ResponseEntity.notFound().build();
	        }
	    }
}
