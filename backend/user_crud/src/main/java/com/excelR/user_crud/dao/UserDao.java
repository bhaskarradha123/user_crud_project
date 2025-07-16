package com.excelR.user_crud.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;

import com.excelR.user_crud.model.User;
import com.excelR.user_crud.repo.UserRepo;


@Repository
public class UserDao {

	@Autowired
	UserRepo repo;

	@Autowired
	PasswordEncoder encoder;

	public User saveUser(User user) {
		user.setPassword(encoder.encode(user.getPassword()));
		return repo.save(user);
	}

	public List<User> fetchAllUser() {
		return repo.findAll();
	}

	public Optional<User> fetchById(int id) {
		return repo.findById(id);
	}
	
	public Optional<User> fetchByUserName(String username) {
		return repo.findByUserName(username);
	}

	public User delete(int id) {
		Optional<User> op = repo.findById(id);
		if (op.isPresent()) {
			User user = op.get();
			repo.delete(user);
			return user;
		} else
			return null;
	}
	
	
}
