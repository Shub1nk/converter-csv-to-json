const fs = require("fs");
const CSVToJSON = require("csvtojson");

const pathJSON = __dirname + "/json/";

const allFiles = fs.readdirSync(`${__dirname}/csv`);
const files = allFiles.filter(name => name !== ".gitkeep");

files.forEach(file => {
  CSVToJSON()
    .fromFile(`${__dirname}/csv/${file}`)
    .then(source => {
      const updatedSource = source.map(item => {
        const paramDate = item["Дата"]
          .replace(/(\d{2}).(\d{2}).(\d{4})/, "$3-$2-$1")
          .split("-");

        return {
          p: Number(item["Стоимость"]),
          d: Date.UTC(paramDate[0], paramDate[1] - 1, paramDate[2])
        };
      });

      fs.writeFileSync(
        `${pathJSON + file.split(".")[0]}.json`,
        JSON.stringify(updatedSource)
      );
    });
});