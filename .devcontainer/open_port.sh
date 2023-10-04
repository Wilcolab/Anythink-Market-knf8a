#!/bin/bash

RETRY_COUNT=3
RETRY_INTERVAL=5
TARGET_PORTS=("3000" "3001")

sleep 5

for port in "${TARGET_PORTS[@]}"; do
    for ((try = 1; try <= RETRY_COUNT; try++)); do
        echo "Attempt $try: Making port $port public."

        gh codespace ports visibility $port:public -c $CODESPACE_NAME
        sleep 1

        ports_json=$(gh codespace ports -c $CODESPACE_NAME --json label,sourcePort,visibility)
        visibility=$(echo "$ports_json" | jq -r ".[] | select(.sourcePort == $port) | .visibility")

        if [ "$visibility" == "public" ]; then
            echo "Port $port is now public."
            break
        elif [ $try -lt $RETRY_COUNT ]; then
            echo "Port $port is still not public. Retrying in $RETRY_INTERVAL seconds..."
            sleep $RETRY_INTERVAL
        else
            echo "Failed to make port $port public after $RETRY_COUNT attempts."
        fi
    done
done
