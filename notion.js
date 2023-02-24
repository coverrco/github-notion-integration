import { Client } from '@notionhq/client';

export async function updatePage(apiKey, pageId, prUrl) {
  const notion = new Client({ auth: apiKey });
  return notion.pages.update({
    page_id: pageId,
    properties: {
      // TODO: make the fields configurable
      Status: {
        status: {
          name: 'Completed'
        }
      },
      PR: {
        url: prUrl
      }
    },
  });
}
