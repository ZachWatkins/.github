# New Repository Configuration

Most of this repository focuses on automatic configuration of a repository. However, there are some things that cannot be done automatically. This page will cover those things in checklist form and provide links to the relevant documentation.

## General

- [ ] Template repository
- [ ] Default branch
- [ ] Feature choices: wikis, issues, sponsorships, archive, discussions, projects

### Pull Requests

- [ ] Allow merge commits: Default to pull request title and description
- [ ] Allow squash merging: Default to pull request title and commit details
- [ ] Allow rebase merging
- [ ] Always suggest updating pull request branches
- [ ] Consider allowing auto-merging pull requests if you have a good test suite
- [ ] Automatically delete head branches (pull request branches)
- [ ] Pushes: Limit how many branches and tags can be updated in a single push

## Branches

Branch protection rules

### Main Branch

- [ ] Require pull requests before merging  
  - [ ] Dismiss stale pull request approvals when new commits are pushed  
- [ ] Require status checks to pass before merging
  - [ ] Require branches to be up to date before merging  
  - [ ] Suggested checks: `build`, `test`, `lint`, `coverage`  
- [ ] Require linear history
- [ ] Require deployments to succeed before merging a pull request  
      Only name environment(s) if all pull requests deploy  
- [ ] Do not allow bypassing branch protection

## Tags

- [ ] Add protected tag rule for `v*` ([Learn more about protected tags](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/configuring-tag-protection-rules))

## Actions

### General

- [ ] Allow owner, and select non-owner, actions and reusable workflows  
  - [ ] Allow actions created by GitHub  
  - [ ] Allow actions created by GitHub Marketplace verified creators  

## Pages

- [ ] Build and deployment source: GitHub Actions

## Code Security and Analysis

- [ ] Dependabot alerts
- [ ] Code scanning
- [ ] Secret scanning  
  - [ ] Push protection  
