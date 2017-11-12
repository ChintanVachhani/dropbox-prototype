#!/bin/bash

#Run this script in the kakfa bin\windows folder for WindowsOS or in the kafka bin folder for other OS.

for topic in {responseTopic,userTopic,fileTopic,directoryTopic,activityTopic,sharedFileTopic,sharedDirectoryTopic}; do kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic $topic; done