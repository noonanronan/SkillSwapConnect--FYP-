 package io.github.RazzaNoonan.messagingservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketMessageController {

    private final KafkaProducer kafkaProducer;

    @Autowired
    public WebSocketMessageController(KafkaProducer kafkaProducer) {
        this.kafkaProducer = kafkaProducer;
    }

    @MessageMapping("/send") // Maps to WebSocket destination "/app/send"
    public void receiveWebSocketMessage(MessageRequest messageRequest) {
        // Forward the message to Kafka
        kafkaProducer.sendMessage(messageRequest.getMessage());
    }
}