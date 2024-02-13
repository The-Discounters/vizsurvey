# answer inspired by https://github.com/firebase/firebase-tools/issues/653
script_dir=$(realpath $(dirname $0))
if [ "$1" = "pre-deploy" ]; then
  cd "$script_dir"
  echo "Cloud Functions pre-deploy script: Packing shared code..."
  rm -rf temp
  mkdir ./temp
  echo "Compressing firebase-shared into tgz file in ./temp".
  npm pack --workspace @the-discounters/firebase-shared --pack-destination ./temp
  npm pkg set 'dependencies.@the-discounters/firebase-shared'='file:./temp/the-discounters-firebase-shared-1.0.0.tgz'
  echo "Compressing types into tgz file in ./temp".
  npm pack --workspace @the-discounters/types --pack-destination ./temp
  npm pkg set 'dependencies.@the-discounters/types'='file:./temp/the-discounters-types-1.0.0.tgz'
  echo "Compressing prolific into tgz file in ./temp".
  npm pack --workspace @the-discounters/prolific --pack-destination ./temp
  npm pkg set 'dependencies.@the-discounters/prolific'='file:./temp/the-discounters-prolific-1.0.0.tgz'
  npm pack --workspace @the-discounters/util --pack-destination ./temp
  npm pkg set 'dependencies.@the-discounters/util'='file:./temp/the-discounters-util-1.0.0.tgz'
  echo "Cloud Functions pre-deploy script: Done!"
  exit
elif [ "$1" = "post-deploy" ]; then
  cd "$script_dir"
  echo "Cloud Functions post-deploy script: Cleaning up shared code..."
  npm pkg set 'dependencies.@the-discounters/firebase-shared'='*'
  npm pkg set 'dependencies.@the-discounters/types'='workspace:^'
  npm pkg set 'dependencies.@the-discounters/prolific'='workspace:^'
  npm pkg set 'dependencies.@the-discounters/util'='workspace:^'
  echo "Cloud Functions post-deploy script: Done!"
  exit
else
  echo "Not a valid parameter. Must be one of: 'pre-deploy'|'post-deploy'."
  exit
fi