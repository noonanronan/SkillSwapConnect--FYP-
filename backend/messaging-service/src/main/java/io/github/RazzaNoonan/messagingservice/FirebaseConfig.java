package io.github.RazzaNoonan.messagingservice;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.database.FirebaseDatabase;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;

@Component
public class FirebaseConfig {

    @PostConstruct
    public void initializeFirebase() throws IOException {
        FileInputStream serviceAccount =
                new FileInputStream("C:\\FYPimoportantFiles\\finalproject-398be-firebase-adminsdk-696bz-2a263bdddf.json");

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .setDatabaseUrl("https://finalproject-398be-default-rtdb.firebaseio.com/")
                .build();

        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp.initializeApp(options);
        }
    }

    @Bean
    public FirebaseDatabase firebaseDatabase() {
        return FirebaseDatabase.getInstance();
    }
}

