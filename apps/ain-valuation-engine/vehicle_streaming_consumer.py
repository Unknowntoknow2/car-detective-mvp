"""
Kafka Streaming Consumer for Real-Time Vehicle Data Ingestion and Enrichment
- Consumes vehicle data from Kafka topic
- Applies canonical mapping and enrichment
- Logs provenance and compliance
- Pushes to downstream pipeline or DB
"""
import os
import json
from kafka import KafkaConsumer, KafkaProducer
from vehicle_data_enrichment import enrich_vehicle_record

KAFKA_BROKER = os.getenv('KAFKA_BROKER', 'localhost:9092')
KAFKA_TOPIC_IN = os.getenv('KAFKA_TOPIC_IN', 'vehicle_raw')
KAFKA_TOPIC_OUT = os.getenv('KAFKA_TOPIC_OUT', 'vehicle_enriched')

consumer = KafkaConsumer(
    KAFKA_TOPIC_IN,
    bootstrap_servers=[KAFKA_BROKER],
    value_deserializer=lambda m: json.loads(m.decode('utf-8')),
    auto_offset_reset='earliest',
    enable_auto_commit=True
)
producer = KafkaProducer(
    bootstrap_servers=[KAFKA_BROKER],
    value_serializer=lambda m: json.dumps(m).encode('utf-8')
)

def process_stream():
    for message in consumer:
        record = message.value
        enriched = enrich_vehicle_record(record)
        enriched['provenance'] = {
            'source': 'kafka',
            'offset': message.offset,
            'timestamp': message.timestamp
        }
        producer.send(KAFKA_TOPIC_OUT, enriched)
        print(f"Enriched and forwarded VIN: {enriched.get('VIN')}")

if __name__ == "__main__":
    process_stream()
