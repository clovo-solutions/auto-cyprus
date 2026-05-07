// Re-export from src/i18n/request.ts so next-intl can find it
// without the plugin. Both Webpack (via tsconfig paths) and Turbopack
// (via resolveAlias in next.config.mjs) will resolve this correctly.
export { default } from './src/i18n/request';