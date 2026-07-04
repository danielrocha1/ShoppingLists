const fs = require("fs");

const files = [
  "node_modules/expo/node_modules/@expo/cli/build/src/start/server/metro/externals.js",
  "node_modules/@expo/cli/build/src/start/server/metro/externals.js",
];

for (const filePath of files) {
  if (!fs.existsSync(filePath)) {
    console.log("NOT FOUND:", filePath);
    continue;
  }

  let content = fs.readFileSync(filePath, "utf8");

  if (content.includes('!x.includes')) {
    console.log("ALREADY PATCHED:", filePath);
    continue;
  }

  // Find: ],filter((x)=>...test(x) && ![\n"sys"\n].includes(x)
  const searchFor = 'filter((x)=>';
  const idx = content.indexOf(searchFor);
  if (idx === -1) {
    console.log("filter not found in:", filePath);
    continue;
  }

  // Find the end of this filter expression
  const rest = content.substring(idx);
  const endMarker = '].includes(x)';
  const endIdx = rest.indexOf(endMarker);
  if (endIdx === -1) {
    console.log("end marker not found in:", filePath);
    continue;
  }

  const filterExpr = rest.substring(0, endIdx + endMarker.length);
  console.log("Found filter in:", filePath);
  console.log("Filter length:", filterExpr.length);
  
  const replacement = filterExpr + ' && !x.includes(":")';
  content = content.replace(filterExpr, replacement);
  fs.writeFileSync(filePath, content);
  console.log("PATCHED:", filePath);
}

console.log("Done!");
