#!/bin/bash

set -e

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Prompt user for custom rules paths
echo -e "${YELLOW}Enter custom rules paths (comma-separated):${NC}"
echo "Paths can be .ts/.js files or directories"
read -r PATHS_INPUT

# Remove spaces and split by comma
IFS=',' read -ra PATHS <<< "${PATHS_INPUT// /}"

# Validate paths exist
VALID_PATHS=()
for path in "${PATHS[@]}"; do
  # Trim leading/trailing whitespace
  path=$(echo "$path" | xargs)
  
  if [ -e "$path" ]; then
    VALID_PATHS+=("$path")
    echo -e "${GREEN}✓${NC} Valid path: $path"
  else
    echo -e "${RED}✗${NC} Path does not exist: $path"
    exit 1
  fi
done

# Check if we have valid paths
if [ ${#VALID_PATHS[@]} -eq 0 ]; then
  echo -e "${RED}No valid paths provided${NC}"
  exit 1
fi

# Scripts to run
SCRIPTS=(
  "new-rule-format.ts"
  "replace-current-statement.ts"
  "replace-context-method.ts"
)

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to determine language based on file extension
get_language() {
  local file="$1"
  case "${file##*.}" in
    ts|tsx)
      echo "typescript"
      ;;
    js|jsx|cjs|mjs)
      echo "javascript"
      ;;
    *)
      echo "javascript" # default to javascript
      ;;
  esac
}

# Function to process a single file
process_file() {
  local file="$1"
  local script_path="$2"
  local language=$(get_language "$file")
  
  echo -e "      ${file} (${language})"
  
  if npx codemod jssg run --language "${language}" "${script_path}" --target "${file}"; then
    echo -e "        ${GREEN}✓${NC} Success"
    return 0
  else
    echo -e "        ${RED}✗${NC} Failed"
    return 1
  fi
}

# Function to process a directory
process_directory() {
  local dir="$1"
  local script_path="$2"
  
  # Find all .js, .ts files (excluding .d.ts)
  local files=$(find "$dir" -type f \( -name "*.js" -o -name "*.ts" -o -name "*.cjs" -o -name "*.mjs" -o -name "*.jsx" -o -name "*.tsx" \) ! -name "*.d.ts")
  
  if [ -z "$files" ]; then
    echo -e "      ${YELLOW}No JavaScript/TypeScript files found${NC}"
    return 0
  fi
  
  while IFS= read -r file; do
    if ! process_file "$file" "$script_path"; then
      return 1
    fi
  done <<< "$files"
  
  return 0
}

echo -e "\n${YELLOW}Starting transformations...${NC}\n"

# Run each script on each path
for script in "${SCRIPTS[@]}"; do
  SCRIPT_PATH="${SCRIPT_DIR}/${script}"
  
  if [ ! -f "$SCRIPT_PATH" ]; then
    echo -e "${RED}✗${NC} Script not found: $SCRIPT_PATH"
    exit 1
  fi
  
  echo -e "${YELLOW}Running ${script}...${NC}"
  
  for path in "${VALID_PATHS[@]}"; do
    echo -e "  Processing: ${path}"
    
    if [ -f "$path" ]; then
      # It's a file
      if ! process_file "$path" "$SCRIPT_PATH"; then
        exit 1
      fi
    elif [ -d "$path" ]; then
      # It's a directory
      if ! process_directory "$path" "$SCRIPT_PATH"; then
        exit 1
      fi
    fi
  done
  
  echo ""
done

echo -e "${GREEN}All transformations completed successfully!${NC}"

