package io.github.RazzaNoonan.messagingservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumer {

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @KafkaListener(topics = "my-topic", groupId = "my-group")
    public void listenGroupFoo(String message) {
        messagingTemplate.convertAndSend("/topic/public", message);
    }
}