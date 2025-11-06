FROM ruby:3.2-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    procps \
    git \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir /myapp
WORKDIR /myapp
COPY Gemfile /myapp/Gemfile
COPY Gemfile.lock /myapp/Gemfile.lock

RUN gem install bundle --user-install

RUN bundle config set --local path "/$HOME/.local/share/gem"
RUN bundle install

RUN echo "export PATH=\"/$HOME/.local/share/gem/ruby/3.2.0/gems:$PATH\"" >> ~/.bashrc
RUN echo "export PATH=\"/$HOME/.local/share/gem/ruby/3.2.0/bin:$PATH\"" >> ~/.bashrc

RUN ln -s "$(bundle info jekyll | grep Path | (read s; echo ${s##*/myapp/}))" "/$HOME/.local/share/gem/ruby/3.2.0/gems/jekyll"

# Entrypoint shell script is necessary to make multiple arguments after `docker compose run` command work
COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
