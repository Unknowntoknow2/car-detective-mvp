#!/bin/bash
# Start the FastAPI server with the correct API key and run the test after the server is ready

export API_KEYS=expected_api_key

# Start the server in the background
/workspaces/ain-valuation-engine/venv/bin/uvicorn src.api_integrations.vin_decoder:app --port 8000 &
SERVER_PID=$!

# Wait for the server to be ready (simple check)
for i in {1..10}; do
  sleep 1
  curl -s http://localhost:8000/docs > /dev/null && break
  if [ $i -eq 10 ]; then
    echo "Server did not start in time."
    kill $SERVER_PID
    exit 1
  fi
done

# Run the test
/workspaces/ain-valuation-engine/venv/bin/python test_vin_lookup_flow.py

# Kill the server
kill $SERVER_PID
