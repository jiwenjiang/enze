import { ScaleTableCode } from "@/service/const";
import request from "@/service/request";
import Female from "@/static/icons/female.svg";
import Male from "@/static/icons/male.svg";
import Nanhai from "@/static/imgs/nanhai.png";
import Nvhai from "@/static/imgs/nvhai.png";
import Weixuanzhong from "@/static/imgs/weixuanzhong.png";
import Xuanzhong from "@/static/imgs/xuanzhong.png";
import { Notify } from "@taroify/core";
import { Image, Text, View } from "@tarojs/components";
import { navigateTo, useDidShow, useRouter } from "@tarojs/taro";
import dayjs from "dayjs";
import React, { useState } from "react";
import styles from "./choose.module.scss";

export default function App() {
  const router = useRouter();
  const [page, setPage] = useState({ pageNo: 1, pageSize: 1000 });
  const [active, setActive] = useState(0);
  const [data, setData] = useState<any>([]);

  const start = () => {
    let age = dayjs().diff(dayjs(data[active]?.birthday), "month");
    if (
      age > 12 &&
      [
        ScaleTableCode.GMS,
        ScaleTableCode.BRAIN_GMS,
        ScaleTableCode.LEIBO_GMS,
      ].includes(Number(router.params.code))
    ) {
      Notify.open({ color: "warning", message: "该测评仅限1岁内孩子评估" });
      return;
    }
    if (
      [
        ScaleTableCode.BRAIN,
        ScaleTableCode.GMS,
        ScaleTableCode.BRAIN_GMS,
      ].includes(Number(router.params.code))
    ) {
      navigateTo({
        url: `/pages/evaluate/index?childId=${data[active]?.id}&age=${data[active]?.birthdayDate}&code=${router.params.code}&orderId=${router.params.orderId}`,
      });
    } else if (
      [ScaleTableCode.ZHUANZHULI].includes(Number(router.params.code))
    ) {
      navigateTo({
        url: `/evaluatePackage/pages/concentration?childId=${data[active]?.id}&age=${data[active]?.birthdayDate}&code=${router.params.code}&orderId=${router.params.orderId}`,
      });
    } else if (
      [ScaleTableCode.XUEXINENGLI].includes(Number(router.params.code))
    ) {
      navigateTo({
        url: `/evaluatePackage/pages/ability?childId=${data[active]?.id}&age=${data[active]?.birthdayDate}&code=${router.params.code}&orderId=${router.params.orderId}`,
      });
    } else {
      navigateTo({
        url: `/pages/evaluate/step?childId=${data[active]?.id}&age=${data[active]?.birthdayDate}&code=${router.params.code}&orderId=${router.params.orderId}`,
      });
    }
  };

  const manage = () => {
    navigateTo({ url: "/childPackage/pages/manage" });
  };

  const choose = (_v, i) => {
    setActive(i);
  };

  useDidShow(() => {
    (async () => {
      const res = await request({ url: "/children/list", data: page });
      setData(res.data.children);
    })();
  });

  return (
    <View className={styles.index}>
      <View>
        <View className={styles.title1}>请选择患者信息</View>
        <View className={styles.title2}>
          以便医生给出更准确的资料，信息仅医生可见
        </View>
      </View>
      <View className={styles["list-wrap"]}>
        <View className="list">
          {data.map((v, i) => (
            <View key={i}>
              <View
                className={styles["child-info"]}
                onClick={() => choose(v, i)}
              >
                <View className={styles["left"]}>
                  <Image
                    src={v.gender === "男" ? Nanhai : Nvhai}
                    className={styles["head"]}
                  />
                  <View className={styles["text-info"]}>
                    <View className={styles.name}>
                      {v.name}{" "}
                      {v.gender === "男" ? (
                        <Image src={Male} className={styles.gender} />
                      ) : (
                        <Image src={Female} className={styles.gender} />
                      )}
                    </View>
                    <Text className={styles.birthday}>{v.birthday}</Text>
                  </View>
                </View>
                <View className={styles.actions}>
                  <Image
                    src={active === i ? Xuanzhong : Weixuanzhong}
                    className={styles.action}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
        {data.length > 0 && (
          <View className={styles.bottom}>
            <View onClick={start} className="primary-btn">
              开始评测
            </View>
          </View>
        )}
      </View>
      <Notify id="notify" />
    </View>
  );
}
