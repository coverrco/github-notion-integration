import { getInput, setOutput, setFailed } from '@actions/core';
import { context } from '@actions/github';

import { updatePage } from './notion';

try {
  console.log('Hello! Notion integration started.');

  const notionApiKey = getInput('notion-api-key');
  const payload = context.payload;
  console.log(`The event payload: ${payload}`);

  if (context.eventName === 'pull_request') {
    console.log('Processing pull request...');
    const pullRequest = payload.pull_request;
    const prUrl = pullRequest.html_url;

    if (pullRequest.merged == true) {
      console.log('Processing merged pull request...');
      const bodyLines = pullRequest.body?.split('\\r\\n');
      console.log(bodyLines);

      const pageIds = [];
      for (let line of bodyLines || []) {
        if (line.startsWith('closes')) {
          const segments = line.trim().split('-');
          let id = segments[segments.length - 1];
          id = id.split('?')[0];
          pageIds.push(id);
        }
      }

      console.log(pageIds)
      for (let pageId of pageIds) {
        await updatePage(notionApiKey, pageId, prUrl);
      }

      setOutput('pagesUpdated', pageIds.at.length.toString());
      console.log('processed merged pull request');
    }
  }
} catch (error) {
  setFailed(error.message);
}
