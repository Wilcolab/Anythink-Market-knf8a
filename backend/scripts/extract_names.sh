grep -i "@amazon" "$1" | awk -F, '{print $2, $3}' | tr "," " " > output_names.txt
cat output_name.txt
