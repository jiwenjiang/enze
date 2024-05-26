import { Button } from "@taroify/core";
import { View } from "@tarojs/components";
import React from "react";
import styles from "./index.module.scss";

export default function Contact() {
  const preview = () => {
    wx.openCustomerServiceChat({
      extInfo: { url: "https://work.weixin.qq.com/kfid/kfc3a09902ab27c5ae3" },
      corpId: "wx8e0f1ae4262d5e44",
      success(res) {
        console.log("🚀 ~ file: index.tsx:38 ~ success ~ res:", res);
      },
    });
  };
  return (
    <View className={styles.contactBox}>
      <View>对报告有疑问？</View>
      <Button className={styles.contact} onClick={preview}>
        在线解答
      </Button>
    </View>
  );
}
