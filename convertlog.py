import re
import json
from datetime import datetime

def parse_log_line(line):
    # Padrão para timestamp
    timestamp_pattern = r'^\[(.*?)\]'
    # Padrão para erro
    error_pattern = r'Error moving file (.*?\.zip): (.*)$'
    # Padrão para movimento
    moved_pattern = r'Moved file (.*?\.zip) from (.*?) to (.*?)$'

    # Extrair timestamp
    timestamp_match = re.match(timestamp_pattern, line)
    if not timestamp_match:
        return None
    
    timestamp = timestamp_match.group(1)
    
    # Tentar match com erro
    error_match = re.search(error_pattern, line)
    if error_match:
        return {
            "timestamp": timestamp,
            "type": "error",
            "file": error_match.group(1),
            "error_message": error_match.group(2)
        }
    
    # Tentar match com movimento
    moved_match = re.search(moved_pattern, line)
    if moved_match:
        return {
            "timestamp": timestamp,
            "type": "moved",
            "file": moved_match.group(1),
            "from_path": moved_match.group(2),
            "to_path": moved_match.group(3)
        }
    
    return None

def convert_log_to_json(input_file, output_file):
    log_entries = []
    
    # Ler o arquivo de log
    with open(input_file, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line:  # Ignorar linhas vazias
                parsed_entry = parse_log_line(line)
                if parsed_entry:
                    log_entries.append(parsed_entry)
    
    # Ordenar do mais recente para o mais antigo
    log_entries.sort(key=lambda x: datetime.fromisoformat(x["timestamp"].rstrip('Z')), reverse=True)
    
    # Escrever no arquivo JSON
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(log_entries, f, indent=2, ensure_ascii=False)

# Uso do script
if __name__ == "__main__":
    input_log_file = "meu-sistema-logs.txt"  # Substitua pelo nome do seu arquivo de log
    output_json_file = "output.json"    # Nome do arquivo JSON de saída
    convert_log_to_json(input_log_file, output_json_file)
    print(f"Conversão concluída! Arquivo JSON salvo em: {output_json_file}")