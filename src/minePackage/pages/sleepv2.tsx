import Box from "@/comps/Box";
import ChooseChild from "@/comps/ChooseChild";
import { ScaleTableCode } from "@/service/const";
import request, { envHost } from "@/service/request";
import { Base64 } from "@/service/utils";
import { Dialog, Notify, Popup } from "@taroify/core";
import { QuestionOutlined } from "@taroify/icons";
import { Button, Image, Text, View } from "@tarojs/components";
import { getStorageSync, navigateTo } from "@tarojs/taro";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { cls } from "reactutils";
import styles2 from "../../evaluatePackage/pages/duoyuan.module.scss";
import styles from "./vaccination.module.scss";

export default function App() {
  const [tishiVisible, setTishiVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentChildren, setCurrentChildren] = useState<any>({});
  const [intro, setIntro] = useState<any>({});
  const [data, setData] = useState([]);
  const delId = useRef();

  const chooseChild = (v) => {
    getList(v);
    setCurrentChildren(v);
  };

  useEffect(() => {
    getIntro();
  }, []);

  const getIntro = async () => {
    const res = await request({
      url: "/sleep/assessment/intro",
    });
    setIntro(res.data);
    console.log("🚀 ~ getIntro ~ res:", res);
  };

  const getList = async (v) => {
    const res = await request({
      url: "/sleep/assessment/list",
      data: {
        childrenId: v.id,
        pageNo: 1,
        pageSize: 1000,
      },
    });
    setData(res.data.list);
    console.log("🚀 ~ getList ~ res:", res);
  };

  const toChart = () => {
    const url = `${envHost}/duoyuan-trend?token=${getStorageSync(
      "token"
    )}&childId=${currentChildren.id}`;
    navigateTo({
      url: `/pages/other/webView?url=${Base64.encode(url)}`,
    });
  };

  const gotoQs = async () => {
    console.log(currentChildren);
    let age = dayjs().diff(dayjs(currentChildren.birthday), "year");
    if (age < 3 || age > 12) {
      Notify.open({ color: "warning", message: "该评估仅限3-12周岁" });
    } else {
      navigateTo({
        url: `/minePackage/pages/sleepv2step?childId=${currentChildren?.id}&age=${currentChildren?.birthdayDate}&code=${ScaleTableCode.Shuimian3to12}`,
      });
    }
  };

  const del = async (id) => {
    setOpen(true);
    delId.current = id;
  };

  const confirmDel = async () => {
    setOpen(false);
    await request({
      url: "/sleep/assessment/delete",
      data: {
        id: delId.current,
      },
    });
    getList(currentChildren);
  };

  const gotoDetail = (id) => {
    navigateTo({
      url: `/minePackage/pages/sleepv2step?childId=${currentChildren.id}&age=${currentChildren?.birthdayDate}&code=${ScaleTableCode.Shuimian3to12}&readonly=1&id=${id}`,
    });
  };

  const toReport = (v) => {
    const url = `${envHost}/sleepv2?token=${getStorageSync(
      "token"
    )}&id=${v.id}`;
    navigateTo({
      url: `/pages/other/webView?url=${Base64.encode(url)}`,
    });
  };

  return (
    <View className={styles2.page}>
      <View className={cls(styles.index, "common-bg")}>
        <Notify id="notify" />
        <ChooseChild change={chooseChild} />
        <Box
          styles={{ marginTop: 15 }}
          noM
          title={
            <View
              style={{
                position: "relative",
              }}
            >
              <Text className="">3-12岁睡眠评估</Text>
              <View className="linear-gradient"></View>
              <QuestionOutlined onClick={() => setTishiVisible(true)} />
            </View>
          }
        >
          <View style={{ padding: 14 }}>
            <View className={cls(styles2.btn)} onClick={gotoQs}>
              + 开始测试
            </View>
          </View>
        </Box>
        {data?.map((c: any, i) => (
          <View key={i} className={styles2.card}>
            <View className={styles2.item}>
              <View className={styles2.label}>测试时间</View>
              <View className={styles2.value}>{c.time}</View>
            </View>
            <View className={styles2.item}>
              <View className={styles2.label}>年龄</View>
              <View className={styles2.value}>{c.age}</View>
            </View>
            <View className={styles2.line}></View>
            <View className={styles2.btnBox}>
              <View className={styles2.btn1} onClick={() => toReport(c)}>
                查看报告
              </View>
              <View className={styles2.btn2} onClick={() => gotoDetail(c.id)}>
                测试详情
              </View>
              <View className={styles2.btn3} onClick={() => del(c.id)}>
                删除
              </View>
            </View>
          </View>
        ))}
      </View>
      <Dialog open={open} onClose={setOpen}>
        <Dialog.Header>是否确认删除</Dialog.Header>
        <Dialog.Content></Dialog.Content>
        <Dialog.Actions>
          <Button onClick={() => setOpen(false)}>取消</Button>
          <Button onClick={() => confirmDel()}>确认</Button>
        </Dialog.Actions>
      </Dialog>
      <Popup
        placement="bottom"
        style={{ height: "80%" }}
        onClose={() => setTishiVisible(false)}
        open={tishiVisible}
      >
        <View className={styles2.popContent}>
          <View>{intro.first}</View>
          <View style={{ textAlign: "center" }}>
            <Image
              src={intro.picture}
              style={{ height: 100 }}
              mode="widthFix"
            ></Image>
          </View>
          <View>{intro.second}</View>
        </View>
      </Popup>
    </View>
  );
}
