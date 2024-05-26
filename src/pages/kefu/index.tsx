import TabBar from "@/comps/TabBar";
import { Image, View } from "@tarojs/components";
import { getStorageSync } from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import styles from "./kefu.module.scss";

export default function App() {
  const [staticData, setStaticData] = useState<any>({});

  useEffect(() => {
    const res = getStorageSync("staticData");
    setStaticData(res);
  }, []);
  const preview = () => {
    console.log(staticData.customerQrCode);
    // wx.previewImage({
    //   urls: [staticData.customerQrCode], // 当前显示图片的 http 链接
    //   current: 0,
    // });
    wx.openCustomerServiceChat({
      extInfo: { url: "https://work.weixin.qq.com/kfid/kfc3a09902ab27c5ae3" },
      corpId: "wx8e0f1ae4262d5e44",
      success(res) {
        console.log("🚀 ~ file: index.tsx:38 ~ success ~ res:", res);
      },
    });
  };

  return (
    <View className="index">
      <View className={styles.ercodeBox}>
        <Image
          src={staticData.customerService}
          mode="widthFix"
          className={styles.ercode}
          onClick={preview}
        />
      </View>
      <TabBar current="kefu" />
    </View>
  );
}
