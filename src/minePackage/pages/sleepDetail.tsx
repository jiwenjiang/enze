import request from "@/service/request";
import { Notify } from "@taroify/core";
import { Picker, Text, View } from "@tarojs/components";
import Taro, { navigateTo, useDidShow, useRouter } from "@tarojs/taro";
import { useEffect, useRef, useState } from "react";

import FieldInput from "@/comps/Field";
import ListItem from "@/comps/ListItem";
import dayjs from "dayjs";
import React from "react";
import { cls } from "reactutils";
import styles2 from "./sleep.module.scss";
import styles from "./vaccination.module.scss";

const customStyle = { padding: 12, backgroundColor: "#fff" };

export default function App() {
  const router = useRouter();
  const [weights, setWeights] = useState({ birthWeight: "", recordWeight: "" });
  const [growData, setGrowData] = useState<any>({
    weight: "",
    sleepTime: "",
    readyTime: "",
    nightAwakenings: "",
    fallBackAsleepAvgTime: "",
    longestSleepTime: "",
    wakeUpTime: "",
    recordDate: router.params.date ?? dayjs().format("YYYY-MM-DD"),
    daySleep: [],
  });
  const noHabit = useRef();

  const [lastDay, setLastDay] = useState(
    dayjs(router.params.date ?? "")
      .subtract(1, "day")
      .format("MM-DD")
  );

  useEffect(() => {
    setLastDay(
      dayjs(growData.recordDate)
        .subtract(1, "day")
        .format("MM-DD")
    );
  }, [growData.recordDate]);

  // 每次页面显示时获取儿童信息
  useDidShow(() => {
    if (router.params.id) {
      getGrowDetail();
    }
  });

  const getWeight = async (v) => {
    if (!router.params.id && v) {
      const res = await request({
        url: "/sleep/weight/get",
        data: { childrenId: v.id },
      });
      setWeights(res.data);
      setGrowData({ ...growData, weight: res.data.recordWeight });
    }
    // console.log("🚀 ~ getWeight ~ res:", res);
  };

  const getGrowDetail = async () => {
    const res = await request({
      url: "/sleep/record/get",
      data: { id: router.params.id },
    });
    setGrowData(res.data);
    console.log("🚀 ~ file: grow.tsx:58 ~ getGrowDetail ~ res:", res);
  };

  const onBirthdayChange = (e, k) => {
    // setBirthday(e.detail.value);
    setGrowData({ ...growData, [k]: e.detail.value });
  };

  const onSleepChange = (e, i, k) => {
    // setBirthday(e.detail.value);
    growData.daySleep[i][k] = e.detail.value;
    setGrowData({ ...growData });
    console.log(
      "🚀 ~ file: sleep.tsx:92 ~ onBirthdayChange ~ { ...growData, [k]: e.detail.value }:",
      { ...growData, [k]: e.detail.value }
    );
  };

  const onChange = (v, key) => {
    setGrowData({ ...growData, [key]: v });
  };

  const reqSave = async () => {
    const res = await request({
      url: "/sleep/record/save",
      method: "POST",
      data: {
        childrenId: router.params.childrenId,
        ...growData,
      },
    });
    if (res.code === 0) {
      Notify.open({ color: "success", message: "保存成功" });
      setGrowData({
        weight: "",
        sleepTime: "",
        readyTime: "",
        nightAwakenings: 0,
        fallBackAsleepAvgTime: "",
        longestSleepTime: "",
        wakeUpTime: "",
        recordDate: dayjs().format("YYYY-MM-DD"),
        daySleep: [],
      });
      navigateTo({
        url: `/minePackage/pages/sleepList?childrenId=${router.params.childrenId}`,
      });
    }
  };

  const save = async () => {
    if (noHabit.current) {
      Notify.open({ color: "warning", message: "请填写睡眠习惯" });
      return;
    }
    if (!/^\d+$/.test(growData.weight)) {
      Notify.open({ color: "warning", message: "请填写整数体重" });
      return;
    }
    if (!growData.readyTime) {
      Notify.open({ color: "warning", message: "请选择昨晚准备入睡时间" });
      return;
    }

    if (!growData.sleepTime) {
      Notify.open({ color: "warning", message: "请选择昨晚睡着时间" });
      return;
    }

    if (!/^\d+$/.test(growData.nightAwakenings)) {
      Notify.open({ color: "warning", message: "请正确填写夜醒次数" });
      return;
    }
    if (!/^\d+$/.test(growData.fallBackAsleepAvgTime)) {
      Notify.open({
        color: "warning",
        message: "请正确填写夜醒重新入睡平均时间",
      });
      return;
    }
    if (!/^\d+$/.test(growData.longestSleepTime)) {
      Notify.open({ color: "warning", message: "请正确填写最长睡眠时间" });
      return;
    }

    if (!growData.wakeUpTime) {
      Notify.open({ color: "warning", message: "请选择早上醒来时间" });
      return;
    }
    // if(growData.weight < weights.birthWeight){

    // }
    const checkRes = await request({
      url: "/sleep/record/check",
      method: "GET",
      data: {
        childrenId: router.params.childrenId,
        date: growData.recordDate,
      },
    });
    if (checkRes.data) {
      Taro.showModal({
        title: "提醒",
        content: "您记录的日期已经有睡眠日志，是否进行覆盖",
        confirmText: "覆盖",
        async success(res) {
          if (res.confirm) {
            reqSave();
          } else if (res.cancel) {
            console.log("用户点击了取消");
            // 在这里可以执行取消后的操作
          }
        },
      });
    } else {
      reqSave();
    }
  };

  const addItem = () => {
    const list = [...growData.daySleep];
    list.push({ start: null, end: null });
    console.log(
      "🚀 ~ file: sleep.tsx:159 ~ addItem ~ { ...growData, daySleep: list }:",
      { ...growData, daySleep: list }
    );

    setGrowData({ ...growData, daySleep: list });
  };

  const del = (c) => {
    const list = [...growData.daySleep].filter((v, i) => i !== c);
    console.log("🚀 ~ file: sleep.tsx:178 ~ del ~ list:", list);
    setGrowData({ ...growData, daySleep: list });
  };

  const gotoHabit = () => {
    navigateTo({
      url: `/minePackage/pages/sleepHabit?childrenId=${router.params.childrenId}`,
    });
  };

  return (
    <View>
      <View className={cls(styles.index, styles.indexDetail)}>
        <Notify id="notify" />

        <View className={styles.detailForm}>
          <View className={styles.row}>
            <ListItem
              left="睡眠习惯是否变化"
              customStyles={customStyle}
              right={
                <View className={styles.minibtnBox}>
                  <View className="mini-btn active-btn">无变化</View>
                  <View className="mini-btn" onClick={gotoHabit}>
                    有变化
                  </View>
                </View>
              }
            />
          </View>
          <View className={styles.row}>
            <Picker
              mode="date"
              value={growData.recordDate}
              onChange={(e) => onBirthdayChange(e, "recordDate")}
            >
              <ListItem
                left="记录日期"
                customStyles={customStyle}
                right={growData.recordDate}
              />
            </Picker>
          </View>
          <View className={styles.row}>
            <FieldInput
              label="体重"
              placeholder="请输入体重(整数)"
              value={growData.weight}
              onInput={(e: any) => onChange(e.target.value, "weight")}
              rootStyles={{ padding: "12px" }}
              labelStyles={{ width: 124 }}
            />
            <Text className={styles.unit}>克(g)</Text>
          </View>
          <View className={styles2.titlebg}>
            昨晚睡眠统计 {lastDay} 20:00 至{" "}
            {dayjs(growData.recordDate).format("MM-DD")} 08:00
          </View>
          <View className={styles.row}>
            <Picker
              mode="time"
              value={growData.readyTime}
              onChange={(e) => onBirthdayChange(e, "readyTime")}
            >
              <ListItem
                left="昨晚准备入睡时间"
                customStyles={customStyle}
                right={growData.readyTime || "请选择"}
              />
            </Picker>
          </View>
          <View className={styles.row}>
            <Picker
              mode="time"
              value={growData.sleepTime}
              onChange={(e) => onBirthdayChange(e, "sleepTime")}
            >
              <ListItem
                left="昨晚睡着时间"
                customStyles={customStyle}
                right={growData.sleepTime || "请选择"}
              />
            </Picker>
          </View>
          <View className={styles.row}>
            <FieldInput
              label="昨晚夜醒次数"
              placeholder="请输入夜醒次数"
              value={growData.nightAwakenings}
              onInput={(e: any) => onChange(e.target.value, "nightAwakenings")}
              rootStyles={{ padding: "12px" }}
              labelStyles={{ width: 124 }}
              type="number"
            />
            <Text className={styles.unit}>次</Text>
          </View>
          <View className={styles.row}>
            <FieldInput
              label="昨晚夜醒重新入睡平均所需时间"
              placeholder="请输入"
              value={growData.fallBackAsleepAvgTime}
              onInput={(e: any) =>
                onChange(e.target.value, "fallBackAsleepAvgTime")
              }
              rootStyles={{ padding: "12px" }}
              labelStyles={{ color: "#333", fontSize: 13 }}
              inputStyles={{ textAlign: "right" }}
              type="number"
            />
            <Text className={styles.unit}>分钟</Text>
          </View>
          <View className={styles.row}>
            <FieldInput
              label="昨晚连续最长睡眠时间（最长一觉）"
              placeholder="请输入"
              value={growData.longestSleepTime}
              onInput={(e: any) => onChange(e.target.value, "longestSleepTime")}
              rootStyles={{ padding: "12px" }}
              labelStyles={{ color: "#333", fontSize: 13 }}
              inputStyles={{ textAlign: "right" }}
              type="number"
            />
            <Text className={styles.unit}>分钟</Text>
          </View>
          <View className={styles.row}>
            <Picker
              mode="time"
              value={growData.wakeUpTime}
              onChange={(e) => onBirthdayChange(e, "wakeUpTime")}
            >
              <ListItem
                left="早上醒来时间"
                customStyles={customStyle}
                right={growData.wakeUpTime || "请选择"}
              />
            </Picker>
          </View>
          <View className={styles2.titlebg2}>
            今日 {dayjs(growData.recordDate).format("MM-DD")} 08:00 至{" "}
            {dayjs(growData.recordDate).format("MM-DD")} 20:00
          </View>
          <View className={styles2.titlebg3}>白天小睡统计（支持多次）</View>
          <View className={styles2.list}>
            {growData.daySleep.map((v, i) => (
              <View key={i} className={styles2.sleepItem}>
                <View className={styles2.sleepItemRow}>
                  <Picker
                    mode="time"
                    style={{ width: "100%" }}
                    value={v.start}
                    onChange={(e) => onSleepChange(e, i, "start")}
                  >
                    <ListItem
                      left="小睡入眠时间"
                      customStyles={{ padding: 12 }}
                      right={v.start || "请选择"}
                    />
                  </Picker>
                </View>
                <View className={styles2.sleepItemRow}>
                  <Picker
                    mode="time"
                    style={{ width: "100%" }}
                    value={v.end}
                    onChange={(e) => onSleepChange(e, i, "end")}
                  >
                    <ListItem
                      left="小睡醒来时间"
                      customStyles={{ padding: 12 }}
                      right={v.end || "请选择"}
                    />
                  </Picker>
                </View>
                <View className={styles2.btn} onClick={() => del(i)}>
                  删除
                </View>
              </View>
            ))}
            <View className={cls(styles2.btn2)} onClick={addItem}>
              添加一次小睡
            </View>
          </View>

          <View className={styles.actions}>
            <View className="primary-btn" onClick={save}>
              保存数据
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
