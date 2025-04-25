
import type { Config } from "tailwindcss";

// We need to create a separate config file since the main one is read-only
const extendedConfig = {
  theme: {
    extend: {
      colors: {
        navy: {
          '50': '#f0f4fa',
          '100': '#d0dff0',
          '200': '#a0bfdf',
          '300': '#709fcf',
          '400': '#407fbf',
          '500': '#2563a0',
          '600': '#1a4b82',
          '700': '#103464',
          '800': '#082746',
          '900': '#041a28',
        },
        charcoal: {
          '50': '#f5f5f6',
          '100': '#e1e2e4',
          '200': '#c3c5c8',
          '300': '#a5a8ae',
          '400': '#878b93',
          '500': '#6a6e79',
          '600': '#52555e',
          '700': '#403E43',
          '800': '#27282c',
          '900': '#18191b',
        },
      },
    },
  },
} as Partial<Config>;

export default extendedConfig;
