import Box from "@/comps/Box";
import NavBar from "@/comps/NavBar";
import request from "@/service/request";
import { Text, View } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import styles from "./stepDetail.module.scss";

export default function App() {
  return (
    <View className={styles.box}>
      <Card />
    </View>
  );
}

function Card() {
  const [report, setReportData] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const res2 = await request({
        url: "/learning/concentration/report",
        data: { id: router.params.id },
      });
      setReportData(res2.data);
    })();
  }, []);

  const back = () => {
    Taro.switchTab({ url: "/pages/index/index" });
  };

  return (
    <View className="common-bg">
      <NavBar title={"评估详情" || report?.scaleTableName} />

      <View>
        <Info data={report} />
        <Box
          title={
            <View
              style={{
                position: "relative",
                width: "100%",
              }}
            >
              <View
                style={{
                  position: "relative",
                  width: "fit-content",
                }}
              >
                <Text>评估结果</Text>
                <View className="linear-gradient"></View>
              </View>
            </View>
          }
          styles={{ marginTop: 10 }}
        >
          <View
            style={{ padding: 15, paddingTop: 0 }}
            className={styles.scoreBox}
          >
            {report.result}
          </View>
        </Box>
        <View className={styles.bottomBox}>
          <View className="primary-btn" onClick={() => back()}>
            返回首页
          </View>
        </View>
      </View>
    </View>
  );
}

function Info({ data }) {
  return (
    <View>
      <Box
        title={
          <View
            style={{
              position: "relative",
            }}
          >
            <Text>基本信息</Text>
            <View className="linear-gradient"></View>
          </View>
        }
        styles={{ marginTop: 10 }}
      >
        <View className={styles.kvbox}>
          <View className={styles.k}>姓名</View>
          <View className={styles.v}>{data.name}</View>
        </View>
        <View className={styles.kvbox}>
          <View className={styles.k}>年龄</View>
          <View className={styles.v}>{data.age}</View>
        </View>
        <View className={styles.kvbox}>
          <View className={styles.k}>性别</View>
          <View className={styles.v}>{data.gender}</View>
        </View>
        <View className={styles.kvbox}>
          <View className={styles.k}>测试日期</View>
          <View className={styles.v}>{data.testTime}</View>
        </View>
      </Box>
    </View>
  );
}
