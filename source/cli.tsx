#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import App from './app.js';
import cliConfig from './config.js';

const cli = cliConfig();

render( <App
    room={cli.flags.room}
    nickname={cli.flags.nickname}
    supaBaseKey={cli.flags.supaBaseKey}
    supaBaseUrl={cli.flags.supaBaseUrl}
  />);
