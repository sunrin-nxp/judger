FROM golang:latest
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN go build -o solution solution.go
