#!/bin/bash

echo 
echo 进入目录:`dirname $0`
cd `dirname $0`

git add .
git commit -m "cmd auto submit"
git pull
git push


