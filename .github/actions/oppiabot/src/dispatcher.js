const core = require('@actions/core');
const issueLabelsModule = require('./issues/checkIssueLabels');

const EVENTS = {
  ISSUES: 'issues',
};
const ACTIONS = {
  LABELLED: 'labeled'
}
module.exports = {
  async dispatch(event, action) {
    core.info(`Received event:${event} action:${action}`);
    if(event === EVENTS.ISSUES) {
      if(action === ACTIONS.LABELLED) {
        await issueLabelsModule.checkLabels()
      }
    }
  }
}
