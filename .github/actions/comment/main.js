const core = require('@actions/core');
const {GitHub, context} = require('@actions/github');


async function run() {
  try {
    const token = core.getInput('repo-token');
    const octokit = new GitHub(token);
    // context.payload.sender.
    const comment = await octokit.issues.createComment({
      repo: context.repo.repo,
      owner: context.repo.owner,
      body: 'This is my comment ooo',
      issue_number: context.payload.pull_request.number
    });
    core.info(comment.data.body)
  } catch(error) {
    core.setFailed(error.message);
  }
}

run();