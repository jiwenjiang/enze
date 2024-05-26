import request, { envHost } from "@/service/request";
import { Button, Notify } from "@taroify/core";
import { ChartTrendingOutlined } from "@taroify/icons";
import { View } from "@tarojs/components";
import {
  getStorageSync,
  navigateTo,
  useDidShow,
  useRouter
} from "@tarojs/taro";
import { useState } from "react";

import { Base64 } from "@/service/utils";
import React from "react";
import { cls } from "reactutils";
import styles from "./vaccination.module.scss";

export default function App() {
  const router = useRouter();
  const [currentChildren, setCurrentChildren] = useState<any>({});
  const [growData, setGrowData] = useState({
    weight: "",
    height: "",
    fillDate: "",
    weightForHeight: "",
    headCircumference: "",
    bmi: ""
  });

  // 每次页面显示时获取儿童信息
  useDidShow(() => {
    if (router.params.id) {
      getGrowDetail();
    }
  });

  const getGrowDetail = async () => {
    const res = await request({
      url: "/growth/get",
      data: { id: router.params.id }
    });
    setGrowData(res.data);
    console.log("🚀 ~ file: grow.tsx:58 ~ getGrowDetail ~ res:", res);
  };
  // 跳转至添加儿童页面，以添加儿童信息
  const add = () => {
    navigateTo({
      url: `/minePackage/pages/grow`
    });
  };

  const goToList = () => {
    navigateTo({
      url: `/minePackage/pages/growList?childrenId=${router.params.childrenId}`
    });
  };

  const nav = v => {
    const url = `${envHost}?classify=${v}&token=${getStorageSync(
      "token"
    )}&childId=${router.params.childrenId}`;
    navigateTo({
      url: `/pages/other/webView?url=${Base64.encode(url)}`
    });
  };

  return (
    <View className={styles.index}>
      <Notify id="notify" />
      <View className={styles["list-wrap"]}>
        <View className={styles.listTitle}>
          <View className={styles.title}>生长评估</View>
          <Button size="small" onClick={goToList}>
            生长记录
          </Button>
        </View>

        <View className={styles.detailList}>
          <View>测评日期：{growData.fillDate}</View>
          <View className={styles.listItem}>
            <View className={styles.val}>身高：{growData.height}</View>
            <View onClick={() => nav(1)}>
              <ChartTrendingOutlined color="#cd5555" />
            </View>
          </View>
          <View className={styles.listItem}>
            <View className={styles.val}>体重：{growData.weight}</View>
            <View onClick={() => nav(2)}>
              <ChartTrendingOutlined color="#cd5555" />
            </View>
          </View>
          <View className={styles.listItem}>
            <View className={styles.val}>
              头围：{growData.headCircumference}
            </View>
            <View onClick={() => nav(3)}>
              <ChartTrendingOutlined color="#cd5555" />
            </View>
          </View>
          <View className={styles.listItem}>
            <View className={styles.val}>
              身高别体重：{growData.weightForHeight}
            </View>
            <View onClick={() => nav(4)}>
              <ChartTrendingOutlined color="#cd5555" />
            </View>
          </View>
          <View className={styles.listItem}>
            <View className={styles.val}>BMI：{growData.bmi}</View>
            <View onClick={() => nav(5)}>
              <ChartTrendingOutlined color="#cd5555" />
            </View>
          </View>
        </View>
      </View>
      <View className={cls(styles.actions, styles.fixBottom)}>
        <Button className={styles.btn} color="primary" onClick={add}>
          继续添加评估
        </Button>
      </View>
    </View>
  );
}
