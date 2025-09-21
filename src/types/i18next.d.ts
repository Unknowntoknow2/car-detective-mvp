import * as React from 'react';

import 'react-i18next';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    returnNull: false;
  }
}

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
  }
}

// Override the global React types to fix conflicts with i18n
declare global {
  namespace React {
    type ReactI18NextChild = React.ReactChild | React.ReactI18NextChildren;
    type ReactI18NextChildren = React.ReactChild | React.ReactFragment | React.ReactPortal | boolean | null | undefined | React.ReactI18NextChildren[];
  }
}
