import { ScaleTableCode } from "@/service/const";
import request, { envHost } from "@/service/request";
import { Base64 } from "@/service/utils";
import { Dialog, Notify, Popup } from "@taroify/core";
import { Button, Image, View } from "@tarojs/components";
import { getStorageSync, navigateTo } from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import { cls } from "reactutils";
import styles2 from "../../evaluatePackage/pages/duoyuan.module.scss";
import styles from "../../minePackage/pages/vaccination.module.scss";

export default function App() {
  const [tishiVisible, setTishiVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentChildren, setCurrentChildren] = useState<any>({});
  const [intro, setIntro] = useState<any>({});
  const [data, setData] = useState([]);

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

  const gotoDetail = (id) => {
    navigateTo({
      url: `/minePackage/pages/sleepv2step?childId=${currentChildren.id}&age=${currentChildren?.birthdayDate}&code=${ScaleTableCode.Shuimian3to12}&readonly=1&id=${id}`,
    });
  };

  const toReport = (v) => {
    const url = `${envHost}/sleepv2?token=${getStorageSync("token")}&id=${
      v.id
    }`;
    navigateTo({
      url: `/pages/other/webView?url=${Base64.encode(url)}`,
    });
  };

  return (
    <View className={styles2.page}>
      <View className={cls(styles.index, "common-bg")}>
        <Notify id="notify" />

          <View className={styles2.card}>
            <View className={styles2.item}>
              <View className={styles2.label}>个人社会</View>
            </View>
            <View className={styles2.item}>
              <View className={styles2.label}>躲猫猫</View>
            </View>
            <View className={styles2.status}>22</View>
          </View>
      </View>
      <Dialog open={open} onClose={setOpen}>
        <Dialog.Header>是否确认删除</Dialog.Header>
        <Dialog.Content></Dialog.Content>
        <Dialog.Actions>
          <Button onClick={() => setOpen(false)}>取消</Button>
          <Button>确认</Button>
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
