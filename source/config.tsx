import meow from 'meow';
import { nanoid } from 'nanoid';

const cliConfig = () => meow(
  `
  Usage
    $ react-cli-app

  Options
    --room  room id, anyone who has the room id can join
    --nickname your nickname, can be emoji
    --supaBaseUrl URL of your supaBase project
    --supaBaseKey The public anon key of the supaBaseUrl project

  Examples
    $ chat-cli --room=room1 --nickname=john --supaBaseUrl="https://supabase" --supaBaseKey="xxx"
  `,
  {
    importMeta: import.meta,
    flags: {
      room: {
        type: 'string',
        default: `room-${nanoid()}`,
      },
      nickname: {
        type: 'string',
        default: `user-${nanoid()}`,
        alias: 'name',
      },
      supaBaseUrl: {
        type: 'string',
        alias: 'url',
        isRequired: true,
      },
      supaBaseKey: {
        type: 'string',
        alias: 'key',
        isRequired: true,
      },
    },
  }
);

export default cliConfig;
