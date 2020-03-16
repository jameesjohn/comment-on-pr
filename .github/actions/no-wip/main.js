const core = require('@actions/core');
const {GitHub, context} = require('@actions/github');

async function run() {
  try {
    const token = core.getInput('repo-token');
    const octokit = new GitHub(token);

    const {data: PR} = await octokit.pulls.get({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: context.payload.pull_request.number,
    });
    if(PR.title.includes('WIP')) {
      await octokit.issues.createComment({
        repo: context.repo.repo,
        owner: context.repo.owner,
        body: 'WIP PRs are not allowed. Please modify the PR title or create a draft PR.',
        issue_number: context.payload.pull_request.number
      });
      // Test WIP
      core.setFailed('PR title contains WIP');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();