package io.github.RazzaNoonan.messagingservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;


@RestController
public class MessageController {

    @Autowired
    private KafkaProducer kafkaProducer;

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody MessageRequest messageRequest) {
        kafkaProducer.sendMessage(messageRequest.getMessage());
        return ResponseEntity.ok().body(Map.of("message", "Message sent to Kafka"));
    }
}

