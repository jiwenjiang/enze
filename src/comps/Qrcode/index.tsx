import { Image, View } from "@tarojs/components";
import React from "react";
import "./index.scss";

export default function Qrcode({ url }: { url: string }) {
  const preview = () => {
    wx.previewImage({
      urls: [url], // 当前显示图片的 http 链接
      current: 0,
    });
  };
  return (
    <View className="qr-box">
      <View className="title">点击图片预览，长按识别加入</View>
      <View onClick={preview}>
        <Image showMenuByLongpress src={url} mode="widthFix" />
      </View>
    </View>
  );
}
