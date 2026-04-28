export default {
  // Only scan admin files
  content: [
    // './src/**/layoutbuilder.tsx', // Target your plugin file specifically
    './src/components/LayoutBuilder/LayoutPreview.tsx'
  ],
  theme: {
    extend: {
      screens: { 'lg': '800px' } // Your custom admin size
    }
  },
  corePlugins: { preflight: false }
}