import request from "@/service/request";
import { Button, Dialog, Notify } from "@taroify/core";
import { QuestionOutlined } from "@taroify/icons";
import { Image, Picker, Text, View } from "@tarojs/components";
import { navigateTo, useDidShow, useRouter } from "@tarojs/taro";
import { useEffect, useRef, useState } from "react";

import Box from "@/comps/Box";
import ChooseChild from "@/comps/ChooseChild";
import Shuimianjilu from "@/static/imgs/shuimianjilu.png";
import ShuimianXiguan from "@/static/imgs/shuimianxiguan.png";
import Xiala from "@/static/imgs/xiala.png";
import Taro from "@tarojs/taro";
import dayjs from "dayjs";
import React from "react";
import { cls } from "reactutils";
import styles2 from "./sleep.module.scss";
import styles from "./vaccination.module.scss";

const heads = ["日", "一", "二", "三", "四", "五", "六"];

export default function App() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [currentChildren, setCurrentChildren] = useState<any>({});
  const [growData, setGrowData] = useState<any>({
    weight: "",
    sleepTime: "",
    readyTime: "",
    nightAwakenings: "",
    fallBackAsleepAvgTime: "",
    longestSleepTime: "",
    wakeUpTime: "",
    recordDate: dayjs().format("YYYY-MM-DD"),
    daySleep: [],
  });
  const [currentMonth, setCurrentMonth] = useState(dayjs().format("YYYY-MM"));
  const [currentDay, setCurrentDay] = useState(dayjs().format("YYYY-MM-DD"));
  const [tishiVisible, setTishiVisible] = useState(false);
  const [xiguanVisible, setXiguanVisible] = useState(false);
  const noHabit = useRef();
  const [ranges, setRanges] = useState<any>([]);

  const checkHabit = async () => {
    const res2 = await request({
      url: "/sleep/habits/answer/check",
      data: {
        childrenId: currentChildren.id,
      },
    });
    noHabit.current = res2.data;
    if (res2.data) {
      setXiguanVisible(true);
    }
  };

  const checkFirstEntry = async () => {
    const res = await request({ url: "/sleep/first/check" });
    if (res.data) {
      setTishiVisible(true);
    } else {
      setVisible(true);
    }
  };

  // 每次页面显示时获取儿童信息
  useDidShow(() => {
    checkFirstEntry();
    if (router.params.id) {
      getGrowDetail();
    }
  });

  const getMonthList = async (initDay?: boolean) => {
    const res = await request({
      url: "/sleep/record/month/check",
      data: {
        childrenId: currentChildren.id,
        month: dayjs(currentMonth).format("YYYY-MM"),
      },
    });
    const day = dayjs(res.data[0]?.date).day();
    const range: any = [...new Array(day).fill({}), ...res.data];
    setRanges(range);
    if (initDay) {
      setCurrentDay(res.data[0].date);
    }
  };

  useEffect(() => {
    if (currentChildren?.id) {
      checkHabit();
      getMonthList();
    }
  }, [currentChildren]);

  useEffect(() => {
    if (currentChildren?.id && currentMonth) {
      getMonthList(true);
    }
  }, [currentMonth]);

  const getGrowDetail = async () => {
    const res = await request({
      url: "/sleep/record/get",
      data: { id: router.params.id },
    });
    setGrowData(res.data);
    console.log("🚀 ~ file: grow.tsx:58 ~ getGrowDetail ~ res:", res);
  };

  const goToList = () => {
    navigateTo({
      url: `/minePackage/pages/sleepList?childrenId=${currentChildren.id}`,
    });
  };

  const chooseChild = (v) => {
    setCurrentChildren(v);
  };

  const toHabit = () => {
    navigateTo({
      url: `/minePackage/pages/sleepHabit?childrenId=${currentChildren.id}`,
    });
  };

  const confirmTip = () => {
    setTishiVisible(false);
    setVisible(true);
  };

  const changeMonth = (e) => {
    setCurrentMonth(dayjs(e.detail.value).format("YYYY-MM"));
  };

  const calcItem = () => {
    const res = ranges.find((v) => v.date === currentDay);
    return res;
  };

  const changeDay = (v) => {
    setCurrentDay(v.date);
  };

  const gotoSleepDetail = () => {
    let age = dayjs().diff(dayjs(currentChildren.birthday), "year");
    if (age >= 3) {
      Notify.open({ color: "warning", message: "该评估仅限3岁以下儿童" });
    } else {
      navigateTo({
        url: `/minePackage/pages/sleepDetail?id=${calcItem()?.sleepRecord?.id ??
          ""}&childrenId=${currentChildren.id}&date=${calcItem()?.date}`,
      });
    }
  };

  const del = async () => {
    Taro.showModal({
      title: "提醒",
      content: "确认删除本次记录?",
      async success(res) {
        if (res.confirm) {
          const res = await request({
            url: "/sleep/record/delete",
            data: { id: calcItem()?.sleepRecord?.id },
          });
          this.getMonthList();
        } else if (res.cancel) {
          console.log("用户点击了取消");
          // 在这里可以执行取消后的操作
        }
      },
    });
  };

  return (
    <View>
      <View className={cls(styles.index, "common-bg")}>
        <Notify id="notify" />
        {visible && <ChooseChild change={chooseChild} />}
        <View className={styles2.head} style={{ marginTop: 4 }}>
          <Image
            src={Shuimianjilu}
            onClick={goToList}
            className={styles2.rukouItem}
          />
          <Image
            src={ShuimianXiguan}
            onClick={toHabit}
            className={styles2.rukouItem}
          />
        </View>
        <Box noM styles={{ padding: 14 }}>
          <View className={styles2.head}>
            <Picker
              mode="date"
              value={currentMonth}
              fields="month"
              onChange={(e) => changeMonth(e)}
              start="1970-09-01"
              end="2030-09-01"
            >
              <View className={styles2.changeMonth}>
                {currentMonth}&nbsp;
                <Image src={Xiala} className={styles2.xiala} />
              </View>
            </Picker>
            <View
              className={styles2.jieshao}
              onClick={() => setTishiVisible(true)}
            >
              <Text>睡眠日志介绍</Text>&nbsp;
              <QuestionOutlined color="#666666" />
            </View>
          </View>
          <View className={styles2.body}>
            <View className={styles2.riliHeads}>
              {heads.map((v, i) => (
                <View style={{ textAlign: "center" }} key={i}>
                  {v}
                </View>
              ))}
            </View>
            <View className={styles2.riliBody}>
              {ranges.map((v, i) => (
                <View key={i}>
                  {v.date ? (
                    <View
                      className={cls(
                        styles2.riliItem,
                        v.status === 1 && styles2.weijilu,
                        v.status === 2 && styles2.yijilu,
                        currentDay === v.date && styles2.active
                      )}
                      onClick={() => changeDay(v)}
                    >
                      <View>{dayjs(v.date).format("MM.DD")}</View>
                      <View style={{ fontSize: 11 }}>
                        {v.status === 1
                          ? "未记录"
                          : v.status === 2
                          ? "已记录"
                          : "未到时间"}
                      </View>
                    </View>
                  ) : (
                    <View></View>
                  )}
                </View>
              ))}
            </View>
            <View
              className={cls(
                "primary-btn",
                calcItem()?.status === 3 && styles2.grayBtn
              )}
              onClick={gotoSleepDetail}
            >
              {calcItem()?.status === 1
                ? "您当天还没记录，去填写"
                : calcItem()?.status === 2
                ? "编辑今天睡眠日志"
                : "还未到记录时间"}
            </View>
          </View>
        </Box>
        {calcItem()?.sleepRecord && (
          <Box
            noM
            styles={{ padding: "12px 0", marginTop: 10, marginBottom: 20 }}
          >
            <View className={styles2.kvbox}>
              <View className={styles2.k}>记录日期</View>
              <View className={styles2.v}>
                {calcItem()?.sleepRecord?.recordDate}
              </View>
            </View>
            <View className={styles2.kvbox}>
              <View className={styles2.k}>昨晚入睡时间</View>
              <View className={styles2.v}>
                {calcItem()?.sleepRecord?.sleepTime}
              </View>
            </View>
            <View className={styles2.kvbox}>
              <View className={styles2.k}>早上醒来时间</View>
              <View className={styles2.v}>
                {calcItem()?.sleepRecord?.wakeUpTime}
              </View>
            </View>
            <View className={styles2.kvbox}>
              <View className={styles2.k}>白天小睡合计</View>
              <View className={styles2.v}>
                {calcItem()?.sleepRecord?.sleepCountDayTime} 分钟
              </View>
            </View>
            <View className={styles2.sleepBtnBox}>
              <View className={styles2.btn2} onClick={() => del()}>
                删除
              </View>
            </View>
          </Box>
        )}

        <Dialog open={tishiVisible} onClose={setTishiVisible}>
          <Dialog.Content>
            <View className={styles.tishi}>
              <View style={{ marginBottom: 12 }}>
                此睡眠日志适合0-2周岁婴幼儿(不到3周岁)。睡眠占去人一生三分之一的时间，良好的睡眠是身心理健康的基础。
              </View>
              <View style={{ marginBottom: 12 }}>
                0-3岁睡眠称为成长型睡眠，一旦出现问题，不仅可导致儿童生长发育迟缓、学习、记忆能力下降、多动、易怒等情绪行为问题，还会影响青少年及成年后的睡眠质量。
              </View>
              <View>
                如您有任何睡眠困扰，如睡前易哭闹、入睡时间长，需要摇睡或抱睡，晚上夜醒多，白天小睡无规律等，需要咨询医生，请先填写“睡眠日志”。
              </View>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onClick={() => confirmTip()}>确定</Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog open={xiguanVisible} onClose={setXiguanVisible}>
          <Dialog.Content>
            <View style={{ textAlign: "center" }}>
              <View>您的宝宝还没有填写睡眠习惯，否则无法保存数据</View>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onClick={() => setXiguanVisible(false)}>取消</Button>
            <Button onClick={() => toHabit()}>去填写</Button>
          </Dialog.Actions>
        </Dialog>
      </View>
    </View>
  );
}
