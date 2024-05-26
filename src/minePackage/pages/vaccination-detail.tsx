import Box from "@/comps/Box";
import request from "@/service/request";
import cardBg from "@/static/imgs/yimiaocard.png";
import { Text, View } from "@tarojs/components";
import { useRouter } from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import styles from "./vaccination.module.scss";

export default function App() {
  const router = useRouter();
  const [detail, setDetail] = useState<any>({});

  const getDetail = async () => {
    const res = await request({
      url: "/vaccination/detail",
      data: { id: router.params.id, childrenId: router.params.childrenId },
    });
    setDetail(res.data);
  };

  useEffect(() => {
    getDetail();
  }, []);

  return (
    <View className={styles.detail}>
      <Box
        styles={{
          marginTop: 10,
        }}
        titleStyles={{
          backgroundImage: `url(${cardBg})`,
          backgroundSize: "contain",
        }}
        title={
          <View
            style={{
              position: "relative",
            }}
          >
            <Text className="">基本信息</Text>
            <View className="linear-gradient"></View>
          </View>
        }
      >
        <View style={{ padding: "17px 29px" }}>
          <View>{detail.name}</View>
          <View className={styles.kv}>
            <Text className={styles.itemLabel}>接种月龄:</Text>
            <Text className={styles.itemVal}>{detail.timeToVaccinate}</Text>
          </View>
          <View className={styles.kv}>
            <Text className={styles.itemLabel}>建议接种时间:</Text>
            <Text className={styles.itemVal}>{detail.actualVaccinate}</Text>
          </View>
          <View className={styles.kv}>
            <Text className={styles.itemLabel}>预防疾病:</Text>
            <Text className={styles.itemVal}>{detail.preventDisease}</Text>
          </View>
          <View className={styles.kv}>
            <Text className={styles.itemLabel}>参考价格:</Text>
            <Text className={styles.itemVal}>{detail.price}</Text>
          </View>
          <View className={styles.kv}>
            <Text className={styles.itemLabel}>可替代疫苗:</Text>
            <Text className={styles.itemVal}>{detail.replace}</Text>
          </View>
        </View>
      </Box>
      <Box
        styles={{
          marginTop: 10,
        }}
        title={
          <View
            style={{
              position: "relative",
            }}
          >
            <Text className="">注意事项</Text>
            <View className="linear-gradient"></View>
          </View>
        }
      >
        <View style={{ padding: "12px" }} className={styles.zhuyi}>
          <View>(1)接种开放时间:以接种门诊实际情况决定，请咨询门诊医生.</View>
          <View>
            (2)根据浙江省物价局规定，每剂二类疫苗收取
            <Text className={styles.hignLight}>28元/支</Text>
            预防接种服务费(价目表已含).
          </View>
          <View>
            (3)标注有金额的为<Text className={styles.hignLight}>二类疫苗</Text>
            ，均为自费自愿接种.
          </View>
          <View>
            (4)如遇节假日或小孩发烧，感自严重，重度湿疹等特殊情况时接种时间可以延迟.
          </View>
          <View>
            (5)疫苗接种后请<Text className={styles.hignLight}>留观30分钟</Text>
            ，任何疫苗接种后部会有可能引发发烧、局部红肿、硬块等一些副反应，一般非常少，请家长放心接种，有问题请联系接种机构.
          </View>
          <View>
            (6)<Text className={styles.hignLight}>接种证</Text>
            入托，入园，入学，大学，出国，当兵必备请妥善保管，每次打针必带，
          </View>
        </View>
      </Box>
    </View>
  );
}
