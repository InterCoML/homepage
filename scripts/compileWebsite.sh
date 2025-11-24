#!/bin/bash

. ./scripts/util.sh

VALID_ARGS="p"
PRODUCTION=0

jekyllGuideMsg() {
  error "Please refer to 'https://jekyllrb.com/docs/installation/#guides' for an installation guide for your distribution"
}

installJekyll() {
  checkJekyll && return 0
  [ $? -eq 0 ] || installJekyllRubyPresent && checkJekyll || error "jekyll could not be installed. Exiting." && jekyllGuideMsg
}

installJekyllRubyPresent() {
  [ -x "$(command -v ruby)" ] || ( error "This script currently assumes that prerequisites are installed." && jekyllGuideMsg )
  info "This will install 'jekyll' for your current user."
  while true; do
    read -p "Do you wish to continue? [y|n]" yn
    case $yn in
      [Yy]* )
        warning "Assuming you're using bash as your standard shell."
        echo '# Install Ruby Gems to ~/gems'      >> ~/.bashrc
        echo 'export GEM_HOME="$HOME/gems"'       >> ~/.bashrc
        echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
        source ~/.bashrc
        break
        ;;
      [Nn]* )
        info "Exiting."
        exit
        ;;
      * ) indent "Please answer [y]es or [n]o.";;
    esac
  done
  info "Installing jekyll and bundler"
  gem install jekyll bundler
  bundle install
  info "Adding webrick for local development"
  bundle add webrick
}

checkJekyll() {
  [ -x "$(command -v jekyll)" ] && (info "jekyll is installed! Version:"; indent "$(jekyll -v)") || return 1
}

prepareOutputDir() {
  mkdir -p $OUTPUT_DIR_ABS
}

mvSite() {
  local pwd="$(pwd)"
  local source=${pwd}/$1
  local dest=$2
  cd $source
  if [[ $3 -eq 0 ]]; then
    find . -type d -exec mkdir -p ${dest}/{} \;
    find . -type f -exec mv {} ${dest}//{} \;
  else
    find . -not \( -path "*assets*" -prune \)\
           -not \( -path "*favicon*" -prune \)\
           -not \( -path "*$OUTPUT_DIR_ABS*" -prune \)\
           -type d -exec mkdir -p ${dest}/{} \;
    find . -not \( -path "*assets*" -prune \)\
           -not \( -path "*favicon*" -prune \)\
           -not \( -path "*$OUTPUT_DIR_ABS*" -prune \)\
           -type f -exec mv {} ${dest}//{} \;
  fi
  cd $pwd
}

buildRootWithJekyll() {
  cfg="$MAIN_CONFIG"
  [ $PRODUCTION -eq 1 ] || cfg="$cfg,$BASEURL_CONFIG"
  info "Processing webpage"
  bundle exec jekyll build --config $cfg | grep "done"
  mvSite ${pwd}/_site $OUTPUT_DIR_ABS 0
}

while getopts $VALID_ARGS arg
do case $arg in
  p)
    PRODUCTION=1 ;;
  esac
done

# check jekyll installation
installJekyll

prepareOutputDir

buildRootWithJekyll
