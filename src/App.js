import React from 'react';
import { Paragraph } from '@nutanix-ui/prism-reactjs';

export default function App() {
  return (
    <div style={{ padding: '20px' }}>
      <Paragraph data-test-id="type-primary">
        This is a single line paragraph text.
        By design single line has 10px line height.
      </Paragraph>
    </div>
  );
}
