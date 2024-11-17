// const fs = require("fs");
import fs from 'fs';
export async function convertTranslationsToTextFile(data: any) {
  // Convert to a JSON string
  // const fileContent = JSON.stringify(data, null, 2);
  const fileContent = data.map((row:any)=> `${row.sentence}\n${row.translation}\n`).join('\n');

  // Create a blob and a URL for the file
  const blob = new Blob([fileContent], { type: 'application/text' });
  const url = URL.createObjectURL(blob);

  // Create a download link and trigger it
  const a = document.createElement('a');
  a.href = url;
  a.download = 'translations.txt'; // Filename
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


