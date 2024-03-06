package io.github.RazzaNoonan.messagingservice;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaMessageListener {

    @KafkaListener(topics = "YourKafkaTopic", groupId = "yourGroupId")
    public void listen(String message) {
        // Logic to distribute messages to WebSocket clients
        // This might involve finding the right session(s) and sending the message
    }
}