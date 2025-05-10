const fs = require("fs");
const path = require("path");
const stream = require("stream");
const readline = require("readline");

const getCmdIdsSync = (datFile) => {
  const content = fs.readFileSync(datFile, "utf8");
  const lines = content.split(/\r?\n/); // 按行切割
  let menuIDs = {};

  for (const line of lines) {
    if (line.includes("$$$/AE/MenuID")) {
      const match = line.match(/MenuID\/.+?\/(.*)/)
      if (!match) continue
      let pureLine = match[1].slice(0, -1)
      const data = pureLine.match(/(.+?)(?:_(\d+))?=(.+)/);
      if (data) {
        const key = data[1] + (data[2] ? `_${data[2]}` : '');
        const value = data[2] || key;
        const label = data[3];
        if (!menuIDs[key] || !/^\d+$/.test(menuIDs[key].value))
          menuIDs[key] = { value: value, label: label };
      }
    }
  }

  return menuIDs;
}

const version = 2024;
const languages = ['de_DE', 'es_ES', 'fr_FR', 'it_IT', 'ja_JP', 'ko_KR', 'pt_BR', 'ru_RU', 'zh_CN']
const data = {}

languages.forEach(language => {
  const datFile = `D:/Software/Adobe/Adobe After Effects ${version}/Support Files/Dictionaries/${language}/after_effects_${language}.dat`;
  data[language] = getCmdIdsSync(datFile)
})

const txt = JSON.stringify(data, null, "\t");
const outFile = path.join(__dirname, `data.json`);
fs.writeFileSync(outFile, txt, {
  encoding: "utf-8",
});
console.log(`File written to: ${outFile}`);