grep -i "@amazon" "$1" | awk -F, '{print $2, $3}' | tr "," " " > output.txt
