import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, { useEffect } from "react";

export default function App() {
  useEffect(() => {
    const options = Taro.getCurrentPages()[Taro.getCurrentPages().length - 1]
      .options;
    console.log(options.amount);

    var res = JSON.parse(options.amount); //打开⽀付⻚⾯时，传过来的信息
    //callbackUrl是收银台完成⻚地址
    console.log(1111111, res);
    wx.requestPayment({
      timeStamp: res.data.timeStamp, //时间戳
      nonceStr: res.data.nonceStr, //随机字符串
      package: `prepay_id=${res.data.package}`,
      signType: res.data.signType,
      paySign: res.data.sign,
      success: function(res) {
        console.log("⽀付接⼝调⽤成功", res);
        wx.redirectTo({
          url: wx._paySuccUrl,
        });
      },
      fail: function(res) {
        console.log("⽀付接⼝调⽤失败", res);
        wx.redirectTo({
          url: wx._payFailUrl,
        });
      },
      complete: function(res1) {
        console.log(res1, res.data);
      },
    });
  }, []);

  return <View></View>;
}
