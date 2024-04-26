# SkillSwapConnect--FYP-

**Title:** Skill Swap App  
**Name:** Ronan Noonan
**Student ID:** G00384824 

## Application Function

## How to Run the App

Follow these steps to run the app locally on your machine:

1. Clone the repository to your local machine using Git: 
    * Clone repo - git clone https://github.com/RazzaNoonan/SkillSwapConnect--FYP-.git

2. Change directory to the app - cd SkillSwapConnect
       
 #### Frontend
```
    3. npm install:
<<<<<<< HEAD
    * Make sure you have node installed - node -v or npm -v (Checks if installed)
    * npm install -g @angular/cli
    * npm install -g firebase-tools
    * npm install @angular/fire
    * npm install firebase
    * npm install firebase @angular/fire --force
    * npm install kafkajs
    * npm install @angular/fire/compat/firestore
    * npm install sockjs-client webstomp-client --save --legacy-peer-deps
    * npm install @capacitor/core @capacitor/cli
=======
    - Ensure you have Node.js installed: `node -v` or `npm -v` (to check if installed)
- Install Angular CLI globally: `npm install -g @angular/cli`
- Install Firebase tools globally: `npm install -g firebase-tools`
- Install Angular Firebase: `npm install @angular/fire`
- Install Firebase SDK: `npm install firebase`
- Force install Angular Firebase (if needed): `npm install firebase @angular/fire --force`
- Install KafkaJS: `npm install kafkajs`
- Install Angular Firestore compatibility package: `npm install @angular/fire/compat/firestore`
- Install WebSocket dependencies: `npm install sockjs-client webstomp-client --save --legacy-peer-deps`
>>>>>>> f293fc40b4802f23c2aa9750eb2e1e6c4060c47f

    4. ionic serve
```
 #### Backend
```
  3. * Make sure Kafka is installed on your machine
      # Start Zookeeper
  4. cd to kafka folder and run  ".\bin\windows\zookeeper-server-start.bat .\config\zookeeper.properties" 
      # Start Kafka Server
  5. cd to kafka folder and run ".\bin\windows\kafka-server-start.bat .\config\server.properties"
  6. cd backend/messaging-service "mvn spring-boot:run"
```



## Project Requirements
This project showcases the integration of advanced software development techniques and research methodologies to address a challenging computing problem. The solution involves a cohesive blend of technologies, including Angular, Firebase, Apache Kafka, and real-time web sockets, aiming to enhance the accessibility and effectiveness of digital education through peer-to-peer learning platforms. The dissertation critically evaluates the project's implementation, highlighting its strengths, weaknesses, and areas for future improvement. 

## Application Architecture
Skill Swap Connect utilizes a microservices architecture with a frontend built using Angular and Ionic for a responsive, cross-platform user experience. The backend, powered by Firebase, handles user authentication and data storage, ensuring real-time synchronization across user sessions. Apache Kafka is integrated to manage real-time messaging, crucial for the chat functionality, acting as a robust message broker among services. The system ensures data flows efficiently from the user interactions on the frontend, processed via backend logic, and updates are pushed back in real-time, maintaining a consistent and dynamic user experience.

## Contact Information
For more information, feedback, or inquiries about Skill Swap Connect, please feel free to contact me via email:

#### Ronan Noonan
Email: G00384824@atu.ie





