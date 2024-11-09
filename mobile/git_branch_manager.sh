#!/bin/bash

# Function to display usage information
usage() {
  echo "Usage: $0 [-d [--force] | -u]"
  echo "  -d        Delete local branches that do not exist on remote"
  echo "  --force   Force delete local branches (without checking if they are merged)"
  echo "  -u        Update local branches to match remote"
  echo "  -h        Show this help message"
}

# Function to delete local branches not present on remote
delete_local_branches() {
  local force_flag=false

  # Check if the force option is set
  if [ "$1" == "--force" ]; then
    force_flag=true
  fi

  echo "Deleting local branches that do not exist on remote..."
  # Fetch the latest changes from the remote
  git fetch -p

  # Get a list of local branches
  local branches=$(git branch | sed 's/^..//')

  for branch in $branches; do
    # Check if the branch exists on the remote
    if ! git show-ref --verify --quiet refs/remotes/origin/"$branch"; then
      if [ "$force_flag" = true ]; then
        echo "Force deleting branch: $branch"
        git branch -D "$branch"
      else
        echo "Deleting branch: $branch"
        git branch -d "$branch" || echo "Failed to delete branch: $branch (may not be fully merged)"
      fi
    fi
  done
}

# Function to update local branches to match remote
update_local_branches() {
  echo "Updating local branches to match remote..."
  # Fetch the latest changes from the remote
  git fetch

  # Get a list of remote branches
  remote_branches=$(git branch -r | sed 's/origin\///')

  for remote_branch in $remote_branches; do
    # Check if the local branch exists
    if git show-ref --verify --quiet refs/heads/"$remote_branch"; then
      echo "Updating branch: $remote_branch"
      git checkout "$remote_branch" && git pull
    else
      echo "Local branch $remote_branch does not exist. Creating it..."
      git checkout -b "$remote_branch" origin/"$remote_branch"
    fi
  done

  # Checkout back to the original branch if needed
  git checkout -
}

# Main script logic
if [ "$#" -lt 1 ]; then
  usage
  exit 1
fi

case $1 in
  -d)
    if [ "$#" -eq 2 ] && [ "$2" == "--force" ]; then
      delete_local_branches --force
    else
      delete_local_branches
    fi
    ;;
  -u)
    update_local_branches
    ;;
  -h)
    usage
    ;;
  *)
    echo "Invalid option: $1"
    usage
    exit 1
    ;;
esac
