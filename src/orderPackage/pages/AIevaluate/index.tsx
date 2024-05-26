import TabBar from "@/comps/TabBar";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React from "react";
import styles from "./index.module.scss";

export default function App() {
  const start = () => {
    Taro.navigateTo({ url: "/orderPackage/pages/book/index?type=2" });
  };
  return (
    <View className={styles.index}>
      <View className={styles.tagBox}>
        <View className={styles.tag}>特色服务</View>
        <View className={styles.descLi}>专家定制专属康复方案</View>
        <View className={styles.descLi}>
          40分钟训练1次（线上或线下均可，建议线下）
        </View>
        <View className={styles.descLi}>居家康复指导视频免费观看</View>
        <View className={styles.descLi}>
          40分钟督导1次（线上或线下均可，建议视频1对1）
        </View>
        <View className={styles.nextBtn} onClick={() => start()}>
          开始预约
        </View>
      </View>

      <TabBar current="index" />
    </View>
  );
}
