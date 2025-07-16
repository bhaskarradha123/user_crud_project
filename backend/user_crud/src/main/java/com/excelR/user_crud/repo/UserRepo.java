package com.excelR.user_crud.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.excelR.user_crud.model.User;

public interface UserRepo extends JpaRepository<User, Integer> {

	Optional<User> findByUserName(String username);
}
