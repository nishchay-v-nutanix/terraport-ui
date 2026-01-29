import React from 'react';
import { FlexLayout, Title } from '@nutanix-ui/prism-reactjs';

export default function Welcome(): React.ReactElement {
  return (
    <FlexLayout
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      style={{ width: '100%', height: '100%' }}
    >
      <Title size={Title.TitleSizes.H1}>
        Welcome to Create React App Default template!
      </Title>
    </FlexLayout>
  );
}
