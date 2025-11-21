import { i } from '@instantdb/react';

const schema = i.schema({
  entities: {
    memes: i.entity({
      imageUrl: i.string(),
      text: i.string(),
      textConfig: i.json(), // Stores text positions, colors, sizes as JSON
      createdAt: i.number(),
      userId: i.string(),
      upvoteCount: i.number().optional(),
    }),
    votes: i.entity({
      memeId: i.string(),
      userId: i.string(),
      createdAt: i.number(),
    }),
  },
  links: {},
  rooms: {},
});

export default schema;

