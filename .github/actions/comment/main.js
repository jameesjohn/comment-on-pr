const core = require('@actions/core');
const {GitHub, context} = require('@actions/github');


async function run() {
  try {
    const token = core.getInput('repo-token');
    const octokit = new GitHub(token);

    const comment = await octokit.pulls.createComment({
      repo: context.repo.repo,
      owner: context.repo.owner,
      body: 'This is my comment ooo',
      commit_id: context.sha,
      pull_number: context.payload.pull_request.number
    });
    core.infoconsole.log(comment.data.body)
  } catch(error) {
    core.setFailed(error.message);
  }
}

run();