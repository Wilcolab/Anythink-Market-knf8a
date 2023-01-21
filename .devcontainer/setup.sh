WILCO_ID="`cat .wilco`"
ENGINE_EVENT_ENDPOINT="${ENGINE_BASE_URL}/users/${WILCO_ID}/event"
CODESPACE_BACKEND_HOST="${CODESPACE_NAME}-3000.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
CODESPACE_BACKEND_URL="https://${CODESPACE_BACKEND_HOST}"

# Update engine that codespace started for user
curl -L -X POST "${ENGINE_EVENT_ENDPOINT}" -H "Content-Type: application/json" --data-raw "{ \"event\": \"github_codespace_started\" }"

# Export backend envs when in codespaces
echo "export CODESPACE_BACKEND_HOST=\"${CODESPACE_BACKEND_HOST}\"" >> ~/.bashrc
echo "export CODESPACE_BACKEND_URL=\"${CODESPACE_BACKEND_URL}\"" >> ~/.bashrc
echo "export CODESPACE_WDS_SOCKET_PORT=443" >> ~/.bashrc

# Export welcome prompt in bash:
echo "printf \"\n\n☁️☁️☁️️ Anythink: Develop in the Cloud ☁️☁️☁️\n\"" >> ~/.bashrc
echo "printf \"\n=============================================\n\"" >> ~/.bashrc
echo "gh codespace ports -c $CODESPACE_NAME" >> ~/.bashrc
echo "printf \"=============================================\n\"" >> ~/.bashrc
echo "printf \"(Once docker-compose is up and running, you can access the frontend and backend using the above urls)\n\"" >> ~/.bashrc
echo "printf \"\n\x1b[31m \x1b[1m👉 Type: \\\`docker-compose up\\\` to run the project. 👈\n\n\"" >> ~/.bashrc

# Change backend port visibility to public
echo "(&>/dev/null .devcontainer/open_port.sh &)" >> ~/.bashrc
