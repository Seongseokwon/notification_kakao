import  {Client} from '@notionhq/client';

const NotionClient = new Client({
  auth: process.env.NOTION_TOKEN
})

export default NotionClient;