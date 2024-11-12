
# GitHub Best Practices

## Git Clone

```bash
git clone git@github.com:cse210-fa24-group2/cse210-fa24-group2.git
```

Clones the repo into your local directory (needs SSH auth keys to be added to git account).

1. Open a terminal.
2. Run `ssh-keygen`.
   - Don’t add any passphrase (press enter to leave everything empty).
   - SSH private-public key pair generated as `id_rsa`, `id_rsa.pub` respectively.
3. Open GitHub account, navigate to Settings page -> SSH and GPG keys.
4. Add the contents of the `id_rsa.pub` to SSH keys (name appropriately).

You should be able to clone using SSH keys (read/write won’t require user/password).

For more information on connecting to GitHub with SSH, see [GitHub Docs](https://docs.github.com/en/authentication/connecting-to-github-with-ssh).

## Git Commands

- **git branch**:  
  Lists all branches that have been checked out on your local repository.

- **git branch -D branch_name**:  
  Deletes `branch_name` from the local repo.

- **git checkout branch_name**:  
  Checks out the selected `branch_name` (if it exists).

- **git checkout -b branch_name**:  
  Creates a new branch from the selected branch (could be main or sub-branch) and checks it out too.

### Branch Naming Conventions

- **Feature Branch**:  
  `feature/name/id-short_feature_name`  
  Example: `feature/ib/0-auth-add`

- **Bugfix Branch**:  
  `bugfix/name/id-short_defect_name`  
  Example: `bugfix/sm/1-nav-bar-fix`

- **git status**:  
  Checks the status of all tracked / untracked / staged / unstaged files.

- **git add files_names**:  
  Add necessary files to stage for a commit (git commit will only commit the selected files).

- **git commit -m "Commit message should have some meaningful description"**

- **git push origin branch_name**:  
  Pushes changes to a selected `branch_name`. Never push changes straight to main / master.

- **git pull origin main**:  
  Fetches the latest main branch from the remote repository. Make it a habit to always pull the latest before branching out.

- **git rebase main**:  
  Rebases your current branch with the available local main branch. Try to do this once every day at least.  
  - Before running this command, checkout the main branch, pull the latest changes from remote, and then checkout your branch again before running this command.

## Learning Git

- **Tutorial** - [Git Tutorial](https://www.atlassian.com/git/tutorials)
- **Interactive** - [Learn Git Branching](https://learngitbranching.js.org/)
