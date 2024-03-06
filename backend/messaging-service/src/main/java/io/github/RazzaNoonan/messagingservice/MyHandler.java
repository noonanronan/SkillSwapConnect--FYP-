package io.github.RazzaNoonan.messagingservice;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class MyHandler extends TextWebSocketHandler {

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        // Handle new session established actions

        System.out.println("*****************************");
        System.out.println("NEW CONNECTION");
        String username = session.getAttributes().get("username").toString();
        System.out.println("*****************************");
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        // Handle incoming messages
        System.out.println("*****************************");
        System.out.println("NEW MESSAGE");
        System.out.println(message);
        System.out.println("*****************************");
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) {
        System.out.println(exception.getStackTrace());
        // Log the error and handle it
    }

//    @Override
//    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
//        // Handle session close actions
//    }

    // Additional methods for error handling, etc.
}
