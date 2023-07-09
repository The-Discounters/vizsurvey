#!/usr/bin/env bash
git push --delete origin $1
git tag --delete $1
git tag $2
git push