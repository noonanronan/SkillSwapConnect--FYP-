package io.github.RazzaNoonan.messagingservice;

import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.kafka.core.KafkaTemplate;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;

public class MyHandler extends TextWebSocketHandler {

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("New WebSocket connection established");

        // Extract the token from the query parameters
        String token = getTokenFromSession(session);
        if (token != null) {
            verifyToken(token, session);
        } else {
            System.out.println("Token not found in session parameters.");
            // Optionally close the session if no token is provided
            session.close();
        }
    }

    private String getTokenFromSession(WebSocketSession session) {
        String query = session.getUri().getQuery();
        if (query != null) {
            String[] params = query.split("&");
            for (String param : params) {
                String[] keyValue = param.split("=");
                if ("token".equals(keyValue[0])) {
                    return keyValue.length > 1 ? keyValue[1] : null;
                }
            }
        }
        return null;
    }

    private void verifyToken(String token, WebSocketSession session) {
        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdTokenAsync(token).get();
            String uid = decodedToken.getUid();
            // Here, associate the WebSocket session with the UID
            session.getAttributes().put("uid", uid);
            System.out.println("Token verified successfully for UID: " + uid);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            try {
                System.out.println("Invalid token, closing the session.");
                session.close();
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        System.out.println("New message received: " + message.getPayload());

        // Instead of just echoing the message back, publish it to a Kafka topic
        publishMessageToKafka("YourKafkaTopic", message.getPayload());

        // If need construct a JSON response or handle the message differently
        // String jsonResponse = "{\"text\":\"Echo: " + message.getPayload() + "\"}";
        // session.sendMessage(new TextMessage(jsonResponse));
    }

    private void publishMessageToKafka(String topic, String message) {
        kafkaTemplate.send(topic, message);
        System.out.println("Message published to Kafka topic: " + topic);
    }
}
