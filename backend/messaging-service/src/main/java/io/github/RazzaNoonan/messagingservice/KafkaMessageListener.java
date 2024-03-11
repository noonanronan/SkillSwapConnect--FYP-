package io.github.RazzaNoonan.messagingservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class KafkaMessageListener {

    private final FirebaseService firebaseService;
    private final ObjectMapper objectMapper;

    @Autowired
    public KafkaMessageListener(FirebaseService firebaseService, ObjectMapper objectMapper) {
        this.firebaseService = firebaseService;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "YourKafkaTopic", groupId = "yourGroupId")
    public void listen(String messageJson) throws Exception {
        String chatId = extractChatIdFromMessageJson(messageJson);
        System.out.println("Received message from Kafka: " + messageJson);
        // Save the message to Firebase
        firebaseService.saveMessage(chatId, messageJson);
    }
    
    private String extractChatIdFromMessageJson(String messageJson) throws Exception {
        JsonNode jsonNode = objectMapper.readTree(messageJson);
        return jsonNode.get("chatId").asText(); 
    }
}