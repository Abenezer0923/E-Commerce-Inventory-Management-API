const kafka = require('kafka-node');
const { addNotification } = require('./notificationsStore'); // Assuming this handles storing notifications

// Kafka Configuration
const KAFKA_HOST = process.env.KAFKA_HOST || 'localhost:9092';

// Kafka Client Setup
const client = new kafka.KafkaClient({ kafkaHost: KAFKA_HOST });
const producer = new kafka.Producer(client);

// Kafka topic names
const LOW_STOCK_TOPIC = 'low-stock-alerts';
const OUT_OF_STOCK_TOPIC = 'out-of-stock-alerts';
const LARGE_STOCK_TOPIC = 'large-stock-alerts';

// Kafka Admin Client for creating topics
const admin = new kafka.Admin(client);

// Function to create topics if they don't exist
const createTopics = (topics) => {
  return new Promise((resolve, reject) => {
    admin.createTopics(topics, (err, result) => {
      if (err) {
        if (err[0]?.error !== "Topic already exists") {
          console.error('Error creating topics:', err);
          return reject(err);
        }
        console.log('Some topics already exist, skipping creation.');
        return resolve(result);
      }
      console.log('Topics created successfully:', result);
      resolve(result);
    });
  });
};

// Ensure producer is ready and topics are created
producer.on('ready', async () => {
  console.log('Kafka Producer is connected and ready.');

  try {
    await createTopics([
      { topic: LOW_STOCK_TOPIC, partitions: 1, replicationFactor: 1 },
      { topic: OUT_OF_STOCK_TOPIC, partitions: 1, replicationFactor: 1 },
      { topic: LARGE_STOCK_TOPIC, partitions: 1, replicationFactor: 1 },
    ]);
  } catch (err) {
    console.error('Error during Kafka topic creation:', err);
  }
});

producer.on('error', (err) => {
  console.error('Kafka Producer error:', err.message);
});

// Function to send a Kafka notification
const sendNotification = (topic, message) => {
  // Ensure producer is ready before sending a message
  if (!producer.ready) {
    console.error('Kafka Producer is not ready. Cannot send message.');
    return;
  }

  const payloads = [{ topic, messages: JSON.stringify(message) }];
  
  producer.send(payloads, (err, data) => {
    if (err) {
      console.error(`Error sending Kafka message to topic ${topic}:`, err.message);
    } else {
      console.log(`Kafka message sent to topic ${topic}:`, data);
    }
  });
};

// Kafka Consumer Setup
const consumer = new kafka.Consumer(
  client,
  [
    { topic: LOW_STOCK_TOPIC, partition: 0 },
    { topic: OUT_OF_STOCK_TOPIC, partition: 0 },
    { topic: LARGE_STOCK_TOPIC, partition: 0 },
  ],
  { autoCommit: true }
);

// Handle incoming messages from Kafka consumer
consumer.on('message', async (message) => {
  try {
    const alert = JSON.parse(message.value);
    console.log(`Received alert: ${JSON.stringify(alert)}`);

    // Store the notification
    await addNotification(alert);  // Assuming this stores the notification
    console.log(`Notification stored: ${JSON.stringify(alert)}`);

  } catch (error) {
    console.error('Error handling Kafka message:', error.message);
  }
});

// Kafka consumer error handling
consumer.on('error', (err) => {
  console.error('Kafka Consumer error:', err.message);
});

// Export the sendNotification function for external use
module.exports = { sendNotification };
