// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const PostStatus = {
  "ACTIVE": "ACTIVE",
  "INACTIVE": "INACTIVE"
};

const { POST, Comment } = initSchema(schema);

export {
  POST,
  Comment,
  PostStatus
};