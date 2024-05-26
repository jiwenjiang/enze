import { ChildContext } from "@/service/context";
import request, { envHost } from "@/service/request";
import femaleImg from "@/static/imgs/female.png";
import maleImg from "@/static/imgs/male.png";
import { Button, Notify, Popup } from "@taroify/core";
import { Checked, Exchange } from "@taroify/icons";
import { Image, Picker, Text, View } from "@tarojs/components";
import {
  getStorageSync,
  navigateTo,
  useDidShow,
  useRouter,
} from "@tarojs/taro";
import { useContext, useEffect, useState } from "react";

import FieldInput from "@/comps/Field";
import ListItem from "@/comps/ListItem";
import { Base64 } from "@/service/utils";
import dayjs from "dayjs";
import React from "react";
import styles from "./vaccination.module.scss";

const customStyle = { padding: 12, backgroundColor: "#fff" };

export default function App() {
  const router = useRouter();
  const [updateFlag, setUpdateFlag] = useState(Date.now());
  const [page, setPage] = useState({ pageNo: 1, pageSize: 10 });
  const [visible, setVisible] = useState(false);
  const [children, setChildren] = useState<any[]>([]);
  const [currentChildren, setCurrentChildren] = useState<any>({});
  const childContext = useContext(ChildContext);
  const [growData, setGrowData] = useState({
    weight: "",
    height: "",
    fillDate: dayjs().format("YYYY-MM-DD"),
    headCircumference: "",
  });

  // 页面加载时调用该方法获取儿童信息
  useEffect(() => {
    getChildrenList();
  }, [updateFlag]);

  // 每次页面显示时获取儿童信息
  useDidShow(() => {
    getChildrenList();
    if (router.params.id) {
      getGrowDetail();
    }
  });

  const getChildrenList = async () => {
    const res = await request({ url: "/children/list", data: page });
    setChildren(res.data.children);
    setCurrentChildren(res.data.children?.[0] ?? {});
    childContext.updateChild({ len: res.data.children.length });
  };

  const getGrowDetail = async () => {
    const res = await request({
      url: "/growth/get",
      data: { id: router.params.id },
    });
    setGrowData(res.data);
    console.log("🚀 ~ file: grow.tsx:58 ~ getGrowDetail ~ res:", res);
  };

  const onBirthdayChange = (e) => {
    // setBirthday(e.detail.value);
    setGrowData({ ...growData, fillDate: e.detail.value });
  };
  // 跳转至添加儿童页面，以添加儿童信息
  const add = () => {
    if (router.params.returnUrl) {
      navigateTo({
        url: `/childPackage/pages/edit?code=${router.params.code}&returnUrl=${router.params.returnUrl}`,
      });
    } else {
      navigateTo({
        url: `/childPackage/pages/edit?code=${router.params.code}`,
      });
    }
  };

  const goToList = () => {
    navigateTo({
      url: `/minePackage/pages/growList?childrenId=${currentChildren.id}`,
    });
  };

  const chooseChild = (v) => {
    setCurrentChildren(v);
    setVisible(false);
  };

  const onChange = (v, key) => {
    setGrowData({ ...growData, [key]: v });
  };

  const save = async () => {
    const res = await request({
      url: "/growth/save",
      method: "POST",
      data: {
        childrenId: currentChildren.id,
        ...growData,
      },
    });
    setGrowData({
      weight: "",
      height: "",
      fillDate: "",
      headCircumference: "",
    });
  };

  const toChart = () => {
    const url = `${envHost}?classify=${1}&token=${getStorageSync(
      "token"
    )}&childId=${currentChildren.id}`;
    navigateTo({
      url: `/pages/other/webView?url=${Base64.encode(url)}`,
    });
  };

  return (
    <View className={styles.index}>
      <Notify id="notify" />
      <View className={styles["list-wrap"]}>
        <View className={styles["list"]}>
          <View className={styles["child-info"]}>
            <View className={styles["left"]}>
              <Image
                src={currentChildren.gender === "男" ? maleImg : femaleImg}
                className={styles["gender"]}
              />
              <View className={styles["text-info"]}>
                <Text className={styles.name}>{currentChildren.name}</Text>
                <Text className={styles.birthday}>
                  {currentChildren.birthday}
                </Text>
              </View>
            </View>
            <View className={styles.actions}>
              <Exchange
                className={styles.action}
                onClick={() => setVisible(true)}
                color="#ffa200"
              />
            </View>
          </View>
        </View>

        <View className={styles.actions}>
          {children?.length === 0 && (
            <Button className={styles.btn} color="primary" onClick={add}>
              添加儿童
            </Button>
          )}
        </View>
        {currentChildren?.id && (
          <View className={styles.listBtnBox}>
            <Button size="small" onClick={goToList}>
              生长记录
            </Button>
            <Button size="small" style={{ marginLeft: 10 }} onClick={toChart}>
              生长曲线
            </Button>
          </View>
        )}
      </View>
      {currentChildren?.id && (
        <View className={styles.form}>
          <View style={{ marginBottom: 10 }}>
            <Picker
              mode="date"
              value={growData.fillDate}
              onChange={onBirthdayChange}
            >
              <ListItem
                left="评估日期"
                customStyles={customStyle}
                right={growData.fillDate}
              />
            </Picker>
          </View>
          <View className={styles.row}>
            <FieldInput
              label="体重"
              placeholder="请输入体重"
              value={growData.weight}
              onInput={(e: any) => onChange(e.target.value, "weight")}
              rootStyles={{ padding: "12px" }}
              labelStyles={{ color: "#333" }}
              inputStyles={{ textAlign: "right" }}
            />
            <Text className={styles.unit}>KG</Text>
          </View>

          <View className={styles.row}>
            <FieldInput
              label="体重身长"
              placeholder="请输入体重身长"
              value={growData.height}
              onInput={(e: any) => onChange(e.target.value, "height")}
              rootStyles={{ padding: "12px" }}
              labelStyles={{ color: "#333" }}
              inputStyles={{ textAlign: "right" }}
            />
            <Text className={styles.unit}>CM</Text>
          </View>
          <View className={styles.row}>
            <FieldInput
              label="头围"
              placeholder="请输入头围"
              value={growData.headCircumference}
              onInput={(e: any) =>
                onChange(e.target.value, "headCircumference")
              }
              rootStyles={{ padding: "12px" }}
              labelStyles={{ color: "#333" }}
              inputStyles={{ textAlign: "right" }}
            />
            <Text className={styles.unit}>CM</Text>
          </View>
          <View className={styles.actions}>
            <Button className={styles.btn} color="primary" onClick={save}>
              保存数据
            </Button>
          </View>
        </View>
      )}

      <Popup
        open={visible}
        onClose={() => setVisible(false)}
        placement="top"
        style={{ height: "70%" }}
      >
        <View className={styles["list-wrap"]}>
          <View className={styles["list"]}>
            {children.map((v, index) => (
              <View
                key={index}
                className={styles["child-info"]}
                onClick={() => chooseChild(v)}
              >
                <View className={styles["left"]}>
                  <Image
                    src={v.gender === "男" ? maleImg : femaleImg}
                    className={styles["gender"]}
                  />
                  <View className={styles["text-info"]}>
                    <Text className={styles.name}>{v.name}</Text>
                    <Text className={styles.birthday}>{v.birthday}</Text>
                  </View>
                </View>
                <View className={styles.actions}>
                  {currentChildren.id === v.id && (
                    <Checked className={styles.action} color="#ffa200" />
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      </Popup>
    </View>
  );
}
