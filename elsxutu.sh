#!/bin/bash
array=(vo pl eo jbo io fi tok)
for i in "${array[@]}"
do
  npm run gulp elŝuti:landoj -- --lingvo=$i
  sleep 60
  npm run gulp elŝuti:provincoj -- --lingvo=$i
  sleep 60
  npm run gulp elŝuti:urboj -- --lingvo=$i
  sleep 60
  npm run gulp elŝuti:lokoj -- --lingvo=$i
  sleep 60
  npm run gulp elŝuti:tero -- --lingvo=$i
  sleep 60
done
