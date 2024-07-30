FROM openjdk:latest
RUN curl -s https://get.sdkman.io | bash \
    && bash -c "source $HOME/.sdkman/bin/sdkman-init.sh && sdk install kotlin"
COPY . /usr/src/app
WORKDIR /usr/src/app
