import React from 'react';

import { render, cleanup } from '@testing-library/react';
import QueueLauncher from './queue-launcher.component';

describe('Test the queue launcher', () => {
  afterEach(cleanup);
  it(`renders without dying`, () => {
    render(<QueueLauncher />);
  });
});
