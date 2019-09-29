#!/usr/bin/env bash
CURRENT_DIR=$(dirname "$0")
NODE_VERSION="10.16"

source "$CURRENT_DIR"/loader.sh

function install_brew() {
  /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"  
}

function install_nvm() {
  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash

  # add to shell env
  if [[ "$SHELL" == "/bin/bash" ]]; then
    echo 'NVM_DIR="$HOME/.nvm"' >> ~/.bash_profile
    echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm' >> ~/.bash_profile
    source ~/.bash_profile
  elif [[ "$SHELL" == "/bin/zsh" ]]; then
    echo 'NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
    echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm' >> ~/.zshrc
  elif [ "$SHELL" == "/bin/fish" ]; then
    echo 'NVM_DIR="$HOME/.nvm"' >> ~/.config/fish/config.fish
    echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm' >> ~/.config/fish/config.fish
  fi
}

if [[ ! -f /usr/local/bin/brew ]]; then
  show-loader "install_brew" "Installing homebrew"
fi

if [[ ! -f $HOME/.nvm/nvm.sh ]]; then
  show-loader "install_nvm" "Installing nvm"
fi

NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . $NVM_DIR/nvm.sh

show-loader "nvm use $NODE_VERSION" "Switching to node version $NODE_VERSION"