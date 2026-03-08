package org.example.backendi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
class emailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendCancelMail(String to, Long orderId) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Order Cancelled");
        message.setText("Your order #" + orderId + " has been cancelled by the restaurant.");

        mailSender.send(message);
    }
}
