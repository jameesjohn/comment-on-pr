const core = require('@actions/core');
const {GitHub, context} = require('@actions/github');
const fs = require('fs');


async function run() {
  try {
    const token = core.getInput('repo-token');

    const octokit = new GitHub(token);

    const {data: PR} = await octokit.pulls.get({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: context.payload.pull_request.number,
    });
    const changelogLabel = PR.labels.filter(label => {
      return label.name.includes('PR CHANGELOG');
    });

    if(changelogLabel.length === 0) {
      await octokit.issues.createComment({
        repo: context.repo.repo,
        owner: context.repo.owner,
        body: 'PR does not have a changelog label.',
        issue_number: context.payload.pull_request.number
      });
      core.setFailed('PR does not have a changelog label.');
      return;
    } else if(changelogLabel.length === 1) {
      let index = changelogLabel[0].name.indexOf('@');
      let username = changelogLabel[0].name.substring(index+1);
      core.info('User to be assigned: '+ username)
      await octokit.issues.addAssignees({
        repo: context.repo.repo,
        owner: context.repo.owner,
        issue_number: context.payload.pull_request.number,
        assignees: [username]
      })
      await octokit.issues.createComment({
        repo: context.repo.repo,
        owner: context.repo.owner,
        body: 'Assigning to @'+username+ ' for first pass review.',
        issue_number: context.payload.pull_request.number
      });
      // Adding a comment to test assigning based on changelog.
    } else {
      await octokit.issues.createComment({
        repo: context.repo.repo,
        owner: context.repo.owner,
        body: 'PR should only have one changelog label.',
        issue_number: context.payload.pull_request.number
      });
      core.setFailed('PR should only have one changelog label');
      return;
    }
  } catch(error) {
    console.error(error)
    core.setFailed(error.message);
  }
}

run()