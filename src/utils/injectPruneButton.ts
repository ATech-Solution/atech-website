// export const withPruning = (items: any[]) => items.map(item => {
//   if (item.versions) {
//     return {
//       ...item,
//       fields: [
//         {
//           name: 'pruneVersionsUI',
//           type: 'ui',
//           admin: {
//             position: 'sidebar',
//             components: { 
//               // Use a string path to avoid Node trying to parse the CSS during init
//               Field: '../components/UniversalPruneButton#UniversalPruneButton', 
//             },
//           },
//         },
//         ...item.fields,
//       ],
//     }
//   }
//   return item
// })
