import Box from "@/comps/Box";
import NavBar from "@/comps/NavBar";
import request from "@/service/request";
import { Popup } from "@taroify/core";
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
  const [tishiVisible, setTishiVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const res2 = await request({
        url: "/learning/ability/report",
        data: { id: router.params.id },
      });
      setReportData(res2.data);
    })();
  }, []);

  const back = () => {
    Taro.switchTab({ url: "/pages/index/index" });
  };

  const calcColor = (v) => {
    const color = {
      优秀: "#11BD8C",
      较好: "#206cd6",
      中等: "#e5cf2c",
      差: "#e5352c",
    }[v];
    return color;
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
            style={{ padding: 15, paddingTop: 0, alignItems: "baseline" }}
            className={styles.scoreBox}
          >
            <View
              className={styles.abilityIntro}
              onClick={() => setTishiVisible(true)}
            >
              基本学习能力介绍
            </View>
            <View className={styles.table}>
              <View className={styles.head}>
                <View className={styles.col1}>基本学习能力</View>
                <View className={styles.col2}>评价</View>
              </View>
              <View className={styles.body}>
                {report.result?.map((v, i) => (
                  <View key={i} className={styles.li}>
                    <View className={styles.col1}>{v.item}</View>
                    <View
                      className={styles.col2}
                      style={{ color: calcColor(v.result) }}
                    >
                      {v.result}
                    </View>
                  </View>
                ))}
              </View>
            </View>
            <View className={styles.bottomBox}>
              <View className="primary-btn" onClick={() => back()}>
                返回首页
              </View>
            </View>
          </View>
        </Box>
        <Popup
          placement="bottom"
          style={{ height: "80%" }}
          onClose={() => setTishiVisible(false)}
          open={tishiVisible}
        >
          <View className={styles.popContent}>
            <View>（1）视知觉能力：视知觉是指个体对视觉材料的整体把握。</View>
            <View>
              （2）言语能力：言语能力是孩子学习能力的一个重要组成部分，它受听知觉能力的影响，进而影响其语文学习。
            </View>
            <View>
              （3）社交能力：社交能力是孩子未来成功的一个重要技能。社交能力的发展有赖于孩子认知水平的成熟。
            </View>
            <View>
              （4）理解能力：理解能力是孩子学习过程中不可或缺的能力，它和孩子的智力水平和思维能力息息相关。
            </View>
            <View>
              （5）行为问题：行为问题的产生与孩子的周围环境相关。这个环境不仅是指家庭条件、社会环境，和教育态度、教育方式周围的影响。
            </View>
            <View>
              （6）大运动：大运动能力是孩子最早发展起来的运动机能，也是孩子从事学习活动的基础。
            </View>
            <View>
              （7）精细动作：是孩子从事抄写、计算等活动的重要技能，它需要适当而充分的后天练习来获得良好的发展机会。
            </View>
            <View>
              （8）注意分散：注意力是孩子学习的门户，也是家长最为重视的学习能力的一方面。
            </View>
            <View>
              （9）多动-冲动行为：多动-冲动是注意障碍的另一个表现形式。
            </View>
          </View>
        </Popup>
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
