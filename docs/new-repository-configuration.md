# New Repository Configuration

Most of this repository focuses on automatic configuration of a repository. However, there are some things that cannot be done automatically. This page will cover those things in checklist form and provide links to the relevant documentation.

## General

- [x] Template repository
- [x] Default branch
- [x] Feature choices: wikis, issues, sponsorships, archive, discussions, projects

### Pull Requests

- [x] Allow merge commits: Default to pull request title and description
- [x] Allow squash merging: Default to pull request title and commit details
- [x] Allow rebase merging
- [x] Always suggest updating pull request branches
- [x] Consider allowing auto-merging pull requests if you have a good test suite
- [x] Automatically delete head branches (pull request branches)
- [x] Pushes: Limit how many branches and tags can be updated in a single push

## Branches

Branch protection rules

### Main Branch

- [x] Require pull requests before merging  
  - [x] Dismiss stale pull request approvals when new commits are pushed  
- [x] Require status checks to pass before merging
  - [x] Require branches to be up to date before merging  
  - [x] Suggested checks: `build`, `test`, `lint`, `coverage`  
- [x] Require linear history
- [x] Require deployments to succeed before merging a pull request  
      Only name environment(s) if all pull requests deploy  
- [x] Do not allow bypassing branch protection

## Tags

- [x] Add protected tag rule for `v*` ([Learn more about protected tags](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/configuring-tag-protection-rules))

## Actions

### General

- [x] Allow owner, and select non-owner, actions and reusable workflows  
  - [x] Allow actions created by GitHub  
  - [x] Allow actions created by GitHub Marketplace verified creators  

## Pages

- [x] Build and deployment source: GitHub Actions

## Code Security and Analysis

- [x] Dependabot alerts
- [x] Code scanning
- [x] Secret scanning  
  - [x] Push protection  
