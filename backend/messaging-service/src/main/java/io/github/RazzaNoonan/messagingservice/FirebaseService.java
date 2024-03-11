package io.github.RazzaNoonan.messagingservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

@Service
public class FirebaseService {

    private final FirebaseDatabase firebaseDatabase;

    @Autowired
    public FirebaseService(FirebaseDatabase firebaseDatabase) {
        this.firebaseDatabase = firebaseDatabase;
    }

    public void saveMessage(String chatId, String messageJson) {
        DatabaseReference chatsRef = firebaseDatabase.getReference("messages").child(chatId);
        System.out.println("Saving message to Firebase under chatId " + chatId + ": " + messageJson);
        chatsRef.push().setValueAsync(messageJson);
    }
}