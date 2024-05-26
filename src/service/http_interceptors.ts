import { addInterceptor, Chain, getStorageSync } from "@tarojs/taro";
const projectConfig = require("../../project.config.json");

async function headerInterceptor(chain: Chain) {
  const req = chain.requestParams;
  req["header"] = {
    ...req["header"],
    "recovery-token": getStorageSync("token"),
    "app-id": projectConfig.appid,
    "org-id": getStorageSync("orgId") ?? "",
    channel: getStorageSync("channel") ?? ""
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
