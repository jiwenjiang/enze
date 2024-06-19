import ChooseChild from "@/comps/ChooseChild";
import ListItem from "@/comps/ListItem";
import { ScaleTableCode } from "@/service/const";
import request from "@/service/request";
import { Notify, Popup } from "@taroify/core";
import { Arrow } from "@taroify/icons";
import { Image, View } from "@tarojs/components";
import { navigateTo } from "@tarojs/taro";
import dayjs from "dayjs";
import React, { CSSProperties, useEffect, useState } from "react";
import { cls } from "reactutils";
import styles from "../../minePackage/pages/vaccination.module.scss";
import styles2 from "./duoyuan.module.scss";

const cusStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  padding: "0 12px",
  width: "100%",
  height: "60px",
  position: "static" as any,
  justifyContent: "space-between",
};

const letStyle: CSSProperties = {
  whiteSpace: "nowrap",
};

export default function App() {
  const [tishiVisible, setTishiVisible] = useState(false);
  const [currentChildren, setCurrentChildren] = useState<any>({});
  const [intro, setIntro] = useState<any>({});

  const chooseChild = (v) => {
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

  const gotoQs = async (code) => {
    let age = dayjs().diff(dayjs(currentChildren.birthday), "year");
    if (age < 7) {
      Notify.open({ color: "warning", message: "该测评仅限7周岁以上儿童" });
    } else {
      const res = await request({
        url: "/order/check",
        data: { scaleTableCode: code },
      });
      if (res.data.hasPaidOrder) {
        if (code === ScaleTableCode.XUEXINENGLI) {
          navigateTo({
            url: `/evaluatePackage/pages/ability?childId=${currentChildren?.id}&age=${currentChildren?.birthdayDate}&code=${code}&orderId=${res.data.orderId}`,
          });
        } else {
          navigateTo({
            url: `/evaluatePackage/pages/concentration?childId=${currentChildren?.id}&age=${currentChildren?.birthdayDate}&code=${ScaleTableCode.ZHUANZHULI}&orderId=${res.data.orderId}`,
          });
        }
      } else {
        navigateTo({
          url: `/orderPackage/pages/order/gmsPay?code=${code}&returnUrl=${"/pages/index/index"}`,
        });
      }
    }
  };

  return (
    <View className={styles2.page}>
      <View className={cls(styles.index, "common-bg")}>
        <Notify id="notify" />
        <ChooseChild change={chooseChild} />
        {currentChildren.id && (
          <View>
            <View
              className={styles2.list}
              onClick={() => gotoQs(ScaleTableCode.ZHUANZHULI)}
            >
              <ListItem
                left="7分钟学习专注力测试"
                leftStyles={letStyle}
                right={
                  <View className={styles2["arrow-icon"]}>
                    <Arrow color="#fff" />
                  </View>
                }
                customStyles={cusStyle}
              />
            </View>

            <View
              className={styles2.list}
              onClick={() => gotoQs(ScaleTableCode.XUEXINENGLI)}
            >
              <ListItem
                left="学习能力测评"
                leftStyles={letStyle}
                right={
                  <View className={styles2["arrow-icon"]}>
                    <Arrow color="#fff" />
                  </View>
                }
                customStyles={cusStyle}
              />
            </View>
          </View>
        )}
      </View>

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
