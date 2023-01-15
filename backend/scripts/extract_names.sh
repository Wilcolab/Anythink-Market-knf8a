grep -i "@amazon" "$1" | awk -F, '{print $3, $2}' | tr "," " " > output_names.txt
cat output_names.txt
