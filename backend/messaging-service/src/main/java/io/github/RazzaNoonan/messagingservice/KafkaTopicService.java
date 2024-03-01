package io.github.RazzaNoonan.messagingservice;

import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaAdmin;
import org.springframework.stereotype.Service; 
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class KafkaTopicService {

    @Autowired
    private KafkaAdmin kafkaAdmin;

    public void createTopic(String topicName, int partitions, short replicationFactor) {
        // Use KafkaAdmin to obtain the configurations in a different way
        Map<String, Object> configs = new HashMap<>(kafkaAdmin.getConfigurationProperties());
        try (AdminClient adminClient = AdminClient.create(configs)) {
            NewTopic newTopic = new NewTopic(topicName, partitions, replicationFactor);
            adminClient.createTopics(Collections.singletonList(newTopic)).all().get();
        } catch (Exception e) {
            // Handle exception
        }
    }
}
