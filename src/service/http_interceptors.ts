import { addInterceptor, Chain, getStorageSync } from "@tarojs/taro";
const projectConfig = require("../../project.config.json");
const accountInfo = wx.getAccountInfoSync();
const env = accountInfo.miniProgram.envVersion;

async function headerInterceptor(chain: Chain) {
  const req = chain.requestParams;
  req["header"] = {
    ...req["header"],
    "recovery-token": getStorageSync("token"),
    "app-id": projectConfig.appid,
    "org-id": getStorageSync(`${env}_orgId`) ?? "",
    channel: getStorageSync(`${env}_channel`) ?? ""
  };
  let res;
  try {
    res = await chain.proceed(req);
  } catch (error) {
    handleErr(error);
  }
  return res;
}

function handleErr(err) {
  console.log(
    "🚀 ~ file: http_interceptors.ts ~ line 19 ~ handleErr ~ err",
    err
  );
}

addInterceptor(headerInterceptor);
