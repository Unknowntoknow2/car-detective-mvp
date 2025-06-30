
declare module 'yargs';
declare module 'yargs/helpers';

// Node.js require types for CLI detection
declare var require: {
  main: NodeModule | undefined;
  (id: string): any;
};

// Node.js module type
declare var module: {
  exports: any;
  require: any;
  id: string;
  filename: string;
  loaded: boolean;
  parent: any;
  children: any[];
};
