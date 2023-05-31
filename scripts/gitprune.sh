#!/bin/bash

merged=$(git branch --merged | grep -v "\*" | grep -v "master\|main\|trunk\|develop\|dev")

if [ -z "$merged" ]; then
  echo "No branches to prune."
  exit 0
fi

echo "The following branches will be removed:"
echo "$merged"
echo "Press enter to continue or ctrl+c to cancel."
read

echo "$merged" | xargs git branch -d
