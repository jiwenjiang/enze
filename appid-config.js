const fs = require("fs");
const path = require("path");

const { readFileSync, writeFileSync } = fs;

const AppConfig = {
  fushu: {
    appId: "wxc662de75e52ad4d5"
  },
  child: {
    appId: "wxb7471fee564e0831"
  },
  leibo: {
    appId: "wx45988ee03543eb16"
  }
};
// 配置文件路径
const configFilePath = path.join(__dirname, "./project.config.json");

// 读取样例文件，替换appid，生成正式project.config.json文件
const setAppId = env => {
  const option = { encoding: "utf-8" };
  const fileContent = readFileSync(configFilePath, option);
  const config = JSON.parse(fileContent.toString());
  const appId = AppConfig[env || "fushu"].appId;
  console.log("appId = ", appId);
  config.appid = appId;
  const newContent = JSON.stringify(config, null, 2);
  writeFileSync(configFilePath, newContent, option);
  return appId;
};

module.exports = setAppId;
