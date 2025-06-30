
declare module 'yargs';
declare module 'yargs/helpers';

// Node.js require types for CLI detection
declare var require: {
  main: NodeModule | undefined;
};
