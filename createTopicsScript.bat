@echo off
rem Run this script in the kakfa bin\windows folder for WindowsOS or in the kafka bin folder for other OS.

set topics=responseTopic userTopic fileTopic directoryTopic activityTopic sharedFileTopic sharedDirectoryTopic
(for %%t in (%topics%); do .\kafka-topics.bat --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic %%t)