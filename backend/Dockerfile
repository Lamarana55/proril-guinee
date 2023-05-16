# Base Image and name stage as "builder"
FROM maven:3-openjdk-15 AS builder
# Create App Directory inside our container
WORKDIR /backend
# Copy files
ADD . .
EXPOSE 8081