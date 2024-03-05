package io.github.RazzaNoonan.messagingservice;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MessageController {

    @Autowired
    private KafkaProducer kafkaProducer;

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody MessageRequest messageRequest) {
        // Send message to Kafka
        kafkaProducer.sendMessage(messageRequest.getMessage());
        // Send message to WebSocket subscribers
        messagingTemplate.convertAndSend("/topic/public", messageRequest.getMessage());
        return ResponseEntity.ok().body(Map.of("message", "Message sent to Kafka and WebSocket"));
    }
}