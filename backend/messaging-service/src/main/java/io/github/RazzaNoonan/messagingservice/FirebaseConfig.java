package io.github.RazzaNoonan.messagingservice;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initialize() {
        try {
            String serviceAccountPath = System.getenv("FIREBASE_SERVICE_ACCOUNT_PATH");
            if (serviceAccountPath == null || serviceAccountPath.isEmpty()) {
                throw new IOException("Environment variable FIREBASE_SERVICE_ACCOUNT_PATH not set.");
            }

            FileInputStream serviceAccountStream = new FileInputStream(serviceAccountPath);

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccountStream))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }
        } catch (IOException e) {
            // Handle error
            e.printStackTrace();
        }
    }
}


