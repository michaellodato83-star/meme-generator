import { init } from '@instantdb/react';

const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID || 'fda6ef94-6b35-4f00-aa6b-741cde16c47b';

// InstantDB React may not require a schema, or uses a different approach
// Try without schema first - InstantDB is schema-less by default
export const db = init({
  appId: APP_ID,
});

