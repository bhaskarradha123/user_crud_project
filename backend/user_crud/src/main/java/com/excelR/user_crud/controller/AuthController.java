package com.excelR.user_crud.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.excelR.user_crud.dao.UserDao;
import com.excelR.user_crud.model.User;
import com.excelR.user_crud.security.JwtUtil;
import com.excelR.user_crud.service.MailService;

@CrossOrigin(origins = "*",methods = {RequestMethod.POST})
@RestController
@RequestMapping("/auth")
public class AuthController {
	
	@Autowired
	private AuthenticationManager manager;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	@Autowired
	private MailService mailService;
	
	@Autowired
	private UserDao dao;
	
//	http://localhost:8080/auth/register
	@PostMapping("/register")
	public ResponseEntity<User>register(@RequestBody User user){
		mailService.sendMsg(user.getUserName());
		return new ResponseEntity<User>(dao.saveUser(user),HttpStatus.CREATED);
	}
// http://localhost:8080/auth/login
	  @PostMapping("/login")
	    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
	        try {
	            String userName = loginRequest.get("userName");
	            String password = loginRequest.get("password");

	            Authentication authentication = manager.authenticate(
	                    new UsernamePasswordAuthenticationToken(userName, password)
	            );

	            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
	            String token = jwtUtil.generateToken(userDetails);

	            User user = dao.fetchByUserName(userName).orElseThrow();

	            Map<String, Object> response = new HashMap<>();
	            response.put("token", token);
	            response.put("role", user.getRole());
	            response.put("userName", user.getUserName());

	            return ResponseEntity.ok(response);
	        } catch (Exception e) {
	            e.printStackTrace();
	            return ResponseEntity.status(401).body("Invalid username or password");
	        }
	    }

	
}
