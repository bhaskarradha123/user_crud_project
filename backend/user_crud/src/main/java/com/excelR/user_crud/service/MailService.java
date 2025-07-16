package com.excelR.user_crud.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {
	@Autowired
	private JavaMailSender sender;
	@Value("${spring.mail.username}")
	private String senderEmail;

	public void sendMsg(String userEmail) {
		try {
			SimpleMailMessage msg = new SimpleMailMessage();
			msg.setFrom(senderEmail);
			msg.setTo(userEmail);
			msg.setSubject("Registration success");
			msg.setText("Hi " + userEmail + "\n happy to announce .....!!!!");
			sender.send(msg);
		} catch (Exception e) {
			System.err.println(e.getMessage());
		}

	}
}
