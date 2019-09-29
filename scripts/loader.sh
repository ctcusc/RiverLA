CURRENT_DIR=$(dirname "$0")

source "$CURRENT_DIR"/ansi.sh

function show-loader() {
  ($1) > /dev/null &
  local pid=$!
  [ -n "$2" ] && message="$2" || message='Please wait...'
  local i=0
  local loader='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
  ansi --hide-cursor --no-restore
  while(ps a | awk '{print $1}' | grep -q "${pid}");  do
    i=$(( (i+1) % 10 ))
    ansi --blue-intense "$(printf "\r%s" "${loader:$i:1}")"
    ansi --bold --no-restore
    if [ -n "$message" ]; then
      printf " %s" "$message"
    else
      printf ' Please wait...'
    fi
    ansi --reset-attrib
    sleep .02
  done

  ansi --green --bold --no-restore
  printf "\r✓ "
  ansi --white --faint --no-restore
  printf "%s\n" "$message"
  ansi --reset-attrib --reset-color
  ansi --show-cursor
}