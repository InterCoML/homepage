#!/bin/bash

PWD="$(pwd)"
OUTPUT_DIR=html
OUTPUT_DIR_ABS=${PWD}/$OUTPUT_DIR

MAIN_CONFIG="${PWD}/_config.yml"
BASEURL_CONFIG="${PWD}/baseurl_config.yml"

DEFAULT_JEKYLL_PORT=4000
LIVERELOAD_PORT=35729

if test -t 1; then
  if [ $(command -v tput) ]; then
    ncolors=$(tput colors)
    if test -n "$ncolors" && test $ncolors -ge 8; then
      bold="$(tput bold)"
      underline="$(tput smul)"
      standout="$(tput smso)"
      normal="$(tput sgr0)"
      black="$(tput setaf 0)"
      red="$(tput setaf 1)"
      green="$(tput setaf 2)"
      yellow="$(tput setaf 3)"
      blue="$(tput setaf 4)"
      magenta="$(tput setaf 5)"
      cyan="$(tput setaf 6)"
      white="$(tput setaf 7)"
    fi
  fi
fi

info() {
  printf "${green}[INFO   ]${white}  $1\n"
}

warning() {
  printf "${red}[WARNING]${white}  $1\n"
}

error() {
  printf "${standout}${red}[ERROR  ]${white}${normal}  $1\n"
}

indent() {
  printf "           $1\n"
}
