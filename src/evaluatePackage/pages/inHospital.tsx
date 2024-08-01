import noticeIcon from "@/static/icons/notice.svg";
import { Image, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React from "react";
import styles from "./stepDetail.module.scss";

export default function App() {
  return (
    <View className={styles.box}>
      <Card />
    </View>
  );
}

function Card() {
  const back = () => {
    Taro.switchTab({ url: "/pages/index/index" });
  };
  return (
    <View className="common-bg">
      <View style={{ paddingBottom: 20 }}>
        <View className={styles.cardBox}>
          <View className={styles.card}>
            <View className={styles.title}>
              <Image src={noticeIcon} className={styles.imgIcon} />
              &nbsp; 温馨提示
            </View>
            <View className={styles.noEvaluete}>
              <View>您已完成数据提交，请等待下一步院内视频拍摄，以及手机报告获取。</View>
            </View>
          </View>
        </View>

        <View className={styles.cardBox}>
          <View className={styles.preBtn} onClick={() => back()}>
            返回首页
          </View>
        </View>
      </View>
    </View>
  );
}
