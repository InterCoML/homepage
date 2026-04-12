#!/bin/bash
case "$1" in
  compile)
    bundle exec jekyll build --destination html
    ;;
  watch)
    echo "baseUrl: \"http://127.0.0.1:4000\"" > baseurl_config.yml
    bundle exec jekyll serve --livereload --config _config.yml,baseurl_config.yml
    ;;
  *)
    echo "Usage: ./updateWebsite [compile|watch]"
    ;;
esac
