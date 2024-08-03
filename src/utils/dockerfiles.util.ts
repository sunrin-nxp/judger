let dockerfiles = {
    c: `FROM gcc:latest
COPY . /usr/src/app
WORKDIR /usr/src/app
    `,
    cpp: `FROM gcc:latest
COPY . /usr/src/app
WORKDIR /usr/src/app
`,
    go: `FROM golang:latest
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN go build -o solution solution.go
`,
    java: `FROM openjdk:latest
COPY . /usr/src/app
WORKDIR /usr/src/app
`,
    js: `FROM node:latest
COPY . /usr/src/app
WORKDIR /usr/src/app
`,
    py: `FROM python:3.8
COPY . /usr/src/app
WORKDIR /usr/src/app
`,
    rs: `FROM rust:latest
COPY . /usr/src/app
WORKDIR /usr/src/app
`,
}

export { dockerfiles };