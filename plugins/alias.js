const fs = require("fs");
const path = require("path");
// vite 插件必须返回给 vite 一个配置对象；

/**
 * @return: plugin
 */
module.exports = function ({ prefix = "@" } = {}) {
  return {
    /**
     * @UserConfig: 当前配置文件参数d
     * @mode: 当前开发模式
     * @command: node 执行参数
     */
    config(UserConfig, env = { mode, command }) {
      // TODO 该方法返回一个对象 对象内的参数是可选的
      console.log("UserConfig:", UserConfig);
      console.log("env:", env);

      const aliasPath = getTotalScrDir(prefix);
      console.log(aliasPath);
      return {
        resolve: { alias: aliasPath },
      };
    },
  };
};

/**
 * @dirFileAry: 基础路径下的文件
 * @basePath: 基础路径
 */
const identifyFilesAndFolders = function (dirFileAry = [], basePath = "") {
  const fileData = {
    dirs: [],
    files: [],
  };

  dirFileAry.forEach((file) => {
    const currentFileStat = fs.statSync(
      path.resolve(__dirname, basePath + "/" + file)
    );
    const isDirectory = currentFileStat.isDirectory();
    // console.log("currentFilestat:", file, isDirectory);

    if (isDirectory) {
      fileData.dirs.push(file);
    } else {
      fileData.files.push(file);
    }
  });

  return fileData;
};

const getTotalScrDir = function (prefix) {
  const result = fs.readdirSync(path.resolve(__dirname, "../src"));
  const identifyResult = identifyFilesAndFolders(result, "../src");

  // console.log("identifyResult:", identifyResult);

  const resultArilas = [];
  identifyResult.dirs.forEach((fileName) => {
    let key_path = `${prefix}${fileName}`;
    let abs_path = path.resolve(__dirname, "../src" + "/" + fileName);

    resultArilas[key_path] = abs_path;
  });

  return resultArilas;
};
