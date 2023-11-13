if [ "$1" = "pre-deploy" ]; then
  echo "$RESOURCE_DIR"
  cd "$RESOURCE_DIR"
  echo "Cloud Functions pre-deploy script: Packing shared code..."
  rm -rf temp
  mkdir ./temp
  yarn workspace @the-discounters/firebase-shared run build
  yarn workspace @the-discounters/firebase-shared pack --out ./temp
  #npm pkg set 'dependencies.@the-discounters/firebase-shared'='file:./temp/the-discounters-shared-1.0.0.tgz'
  yarn config set dependencies.@the-discounters/firebase-shared file:./temp/the-discounters-shared-1.0.0.tgz
  echo "Cloud Functions pre-deploy script: Done!"
  exit
elif [ "$1" = "post-deploy" ]; then
  cd "$RESOURCE_DIR"
  echo "Cloud Functions post-deploy script: Cleaning up shared code..."
  #npm pkg set 'dependencies.@the-discounters/firebase-shared'='1.0.0'
  yarn config set dependencies.@the-discounters/firebase-shared "1.0.0"
  rm -rf temp
  echo "Cloud Functions post-deploy script: Done!"
  exit
else
  echo "Not a valid parameter. Must be one of: 'pre-deploy'|'post-deploy'."
  exit
fi