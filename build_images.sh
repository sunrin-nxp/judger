#!/bin/bash

# Dockerfiles 디렉토리 경로
DOCKERFILES_DIR="./src/docker"

# 언어별 Docker 이미지 빌드
build_image() {
  local language=$1
  local dockerfile="$DOCKERFILES_DIR/Dockerfile.$language"
  local image_name="nxp-judger-$language"

  echo "Building Docker Judger image for $language..."
  docker build -t $image_name -f $dockerfile $DOCKERFILES_DIR
  if [ $? -ne 0 ]; then
    echo "Failed to build Docker image for $language"
    exit 1
  fi
  echo "Docker image for $language built successfully"
}

# 언어 목록
languages=("c" "cpp" "py" "js" "rs" "java" "go")

# 각 언어별 Docker 이미지 빌드
for language in "${languages[@]}"; do
  build_image $language
done
export RUST_BACKTRACE=1
echo "All Docker images built successfully"
