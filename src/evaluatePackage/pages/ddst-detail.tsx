import request from "@/service/request";
import nanhai from "@/static/imgs/nanhai.png";
import nvhai from "@/static/imgs/nvhai.png";
import { Image, Text, View } from "@tarojs/components";
import { useRouter } from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import { cls } from "reactutils";
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
  const [plan, setPlan] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const res = await request({
        url: "/recovery/base",
        data: { id: router.params.id },
      });
      setReportData(res.data);
      const res2 = await request({
        url: "/ddst/report",
        data: { id: router.params.id },
      });
      setPlan(res2.data);
    })();
  }, []);

  return (
    <View>
      <View>
        <View className={styles.gapHead}>基本信息</View>
        <Info data={report} />
        <View className={styles.gapHead}>评估结果</View>
        <View className={styles.cardBox}>
          <View className={styles.newCard}>
            <View className={cls(styles.listItem, styles.list)}>
              <View className={styles.newkv}>
                <Text className={styles.k}>量表名称</Text>
                <Text className={styles.v}>{plan.scaleTableName}</Text>
              </View>
            </View>
            <View className={cls(styles.listItem, styles.list)}>
              <View className={styles.newkv}>
                <Text className={styles.k}>调查中表现</Text>
                <Text className={styles.v}>{plan.progressStatus}</Text>
              </View>
            </View>
            <View className={cls(styles.listItem, styles.list)}>
              <View className={styles.newkv}>
                <Text className={styles.k}>调查结果</Text>
                <Text className={styles.v}>{plan.scaleResult}</Text>
              </View>
            </View>
            <View className={cls(styles.listItem, styles.list)}>
              <View className={styles.newkv}>
                <Text className={styles.k}>评估人</Text>
                <Text className={styles.v}>{plan.doctorName}</Text>
              </View>
            </View>
            <View className={cls(styles.listItem, styles.list)}>
              <View className={styles.newkv}>
                <Text className={styles.k}>评估日期</Text>
                <Text className={styles.v}>{plan.evaluateDate}</Text>
              </View>
            </View>
            <View className={cls(styles.listItem, styles.list)}>
              <View className={styles.newkv}>
                <Text className={styles.k}>医生建议</Text>
                <Text className={styles.v}>{plan.conclusion}</Text>
              </View>
            </View>
            <View className={cls(styles.listItem, styles.list)}>
              <View className={styles.newkv}>
                <Text className={styles.k}>备注</Text>
                <Text className={styles.v}>{plan.conclusion}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function Info({ data }) {
  return (
    <View className={styles.cardBox}>
      <View className={styles.newCard}>
        <View className={styles.newTitle}>
          {data.gender === "男" ? (
            <Image src={nanhai} className={styles.imgIcon} />
          ) : (
            <Image src={nvhai} className={styles.imgIcon} />
          )}
          &nbsp;{data.childrenName}&emsp;{data.age}岁
        </View>

        <View className={cls(styles.listItem, styles.list)}>
          <View className={styles.newkv}>
            <Text className={styles.k}>编号</Text>
            <Text className={styles.v}>{data.id}</Text>
          </View>
          <View className={styles.newkv}>
            <Text className={styles.k}>性别</Text>
            <Text className={styles.v}>{data.gender}</Text>
          </View>
        </View>
        <View className={cls(styles.listItem, styles.list)}>
          <View className={styles.newkv}>
            <Text className={styles.k}>出生体重</Text>
            <Text className={styles.v}>{data.birthWeight}g</Text>
          </View>
          <View className={styles.newkv}>
            <Text className={styles.k}>出生日期</Text>
            <Text className={styles.v}>{data.birthday}</Text>
          </View>
        </View>
        <View className={cls(styles.listItem, styles.list)}>
          <View className={styles.newkv}>
            <Text className={styles.k}>出生孕周</Text>
            <Text className={styles.v}>{data.gestationalWeek}</Text>
          </View>
          <View className={styles.newkv}>
            <Text className={styles.k}>就诊卡号</Text>
            <Text className={styles.v}>{data.medicalCardNumber}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
