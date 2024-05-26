import Box from "@/comps/Box";
import ChooseChild from "@/comps/ChooseChild";
import { ScaleTableCode } from "@/service/const";
import request, { envHost } from "@/service/request";
import { Base64 } from "@/service/utils";
import Duoyuan1 from "@/static/imgs/duoyuan1.png";
import Duoyuan2 from "@/static/imgs/duoyuan2.png";
import { Dialog, Notify, Popup } from "@taroify/core";
import { QuestionOutlined } from "@taroify/icons";
import { Button, Image, Text, View } from "@tarojs/components";
import Taro, { getStorageSync, navigateTo } from "@tarojs/taro";
import React, { useEffect, useRef, useState } from "react";
import { cls } from "reactutils";
import styles from "../../minePackage/pages/vaccination.module.scss";
import styles2 from "./duoyuan.module.scss";

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
      url: "/mi/intro",
    });
    setIntro(res.data);
    console.log("🚀 ~ getIntro ~ res:", res);
  };

  const getList = async (v) => {
    const res = await request({
      url: "/mi/list",
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
    const res = await request({
      url: "/mi/check",
      data: {
        childrenId: currentChildren.id,
      },
    });
    if (res.data) {
      Taro.showModal({
        title: "提醒",
        content: "该儿童3个月内有测试，是否继续测试？",
        async success(res) {
          if (res.confirm) {
            navigateTo({
              url: `/evaluatePackage/pages/questions?childrenId=${currentChildren.id}&code=${ScaleTableCode.Duoyuan}`,
            });
          } else if (res.cancel) {
            console.log("用户点击了取消");
            // 在这里可以执行取消后的操作
          }
        },
      });
    } else {
      navigateTo({
        url: `/evaluatePackage/pages/questions?childrenId=${currentChildren.id}&code=${ScaleTableCode.Duoyuan}`,
      });
    }
    console.log("🚀 ~ gotoQs ~ res:", res);
    return;
  };

  const del = async (id) => {
    setOpen(true);
    delId.current = id;
  };

  const confirmDel = async () => {
    setOpen(false);
    await request({
      url: "/mi/delete",
      data: {
        id: delId.current,
      },
    });
    getList(currentChildren);
  };

  const gotoDetail = (id) => {
    navigateTo({
      url: `/evaluatePackage/pages/questions?childrenId=${currentChildren.id}&code=${ScaleTableCode.Duoyuan}&readonly=1&id=${id}`,
    });
  };

  const toReport = (v) => {
    const url = `${envHost}/duoyuan-report?token=${getStorageSync(
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
              <Text className="">多元智能测试介绍</Text>
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
        <View className={styles2.head} style={{ marginTop: 14 }}>
          <Image src={Duoyuan1} className={styles2.rukouItem} />
          <Image
            src={Duoyuan2}
            onClick={toChart}
            className={styles2.rukouItem}
          />
        </View>
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
