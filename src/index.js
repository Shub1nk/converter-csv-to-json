const fs = require("fs");
const CSVToJSON = require("csvtojson");

const pathDesktopJSON = __dirname + "/json/desktop/";
const pathMobileJSON = __dirname + "/json/mobile/";

const allFiles = fs.readdirSync(`${__dirname}/csv`);
const files = allFiles.filter((name) => name !== ".gitkeep");

const YEAR = 12;

const makeIfNotExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};

files.forEach((file) => {
  CSVToJSON()
    .fromFile(`${__dirname}/csv/${file}`)
    .then((source) => {
      const updatedDesktopSource = source.map((item) => {
        const paramDate = item["Дата"]
          .replace(/(\d{2}).(\d{2}).(\d{4})/, "$3-$2-$1")
          .split("-");

        return {
          p: Number(item["Стоимость"]),
          d: Date.UTC(paramDate[0], paramDate[1] - 1, paramDate[2]),
        };
      });

      const lastDate = new Date(updatedDesktopSource[updatedDesktopSource.length - 1].d);
      const yearAgo = new Date(lastDate).setMonth(lastDate.getMonth() - YEAR);
      const updatedMobileSource = updatedDesktopSource.filter((item) => item.d >= yearAgo);

      makeIfNotExists(pathDesktopJSON);
      makeIfNotExists(pathMobileJSON);
      fs.writeFileSync(
        `${pathDesktopJSON + file.split(".")[0]}.json`,
        JSON.stringify({ points: updatedDesktopSource })
      );
      fs.writeFileSync(
        `${pathMobileJSON + file.split(".")[0]}.json`,
        JSON.stringify({ points: updatedMobileSource })
      );
    });
});
