const fs = require('fs');
let content = fs.readFileSync('src/components/AssetLibraryPanel.tsx', 'utf8');

// Fix icon
content = content.replace(
  "id: 'imported-models',\n        label: 'Imported 3D Models',\n        color: 'text-purple-400',",
  "id: 'imported-models',\n        label: 'Imported 3D Models',\n        icon: Box,\n        color: 'text-purple-400',"
);

// Fix names: replace `label: '1 (x)'` with `label: 'Custom Model x'`
content = content.replace(/label: '1 \((.*?)\)'/g, "label: 'Custom Model $1'");

fs.writeFileSync('src/components/AssetLibraryPanel.tsx', content);
console.log("Fixed panel!");
