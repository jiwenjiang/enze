import { ScaleTableCode } from "@/service/const";
import request from "@/service/request";
import { Base64 } from "@/service/utils";
import Female from "@/static/icons/female.svg";
import Male from "@/static/icons/male.svg";
import Nanhai from "@/static/imgs/nanhai.png";
import Nvhai from "@/static/imgs/nvhai.png";
import Tianjia from "@/static/imgs/tianjiaertong.png";
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
  const [ignoreEvaluate, setIgnoreEvaluate] = useState("");
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

  const submit = async () => {
    if (ignoreEvaluate?.includes("1")) {
      let params: any = {
        childrenId: data[active]?.id,
        scaleTableCode: router.params.code ?? 9,
        answers: [],
        orderId: router.params.orderId,
      };
      await request({
        url: "/scaleRecord/withoutAnswer/save",
        data: params,
        method: "POST",
      });
      navigateTo({ url: "/evaluatePackage/pages/inHospital" });
    } else {
      start();
    }
  };

  const manage = () => {
    navigateTo({ url: "/childPackage/pages/manage" });
  };
  const add = () => {
    const returnUrl = Base64.encode(
      `/childPackage/pages/choose?code=${router.params.code}&orderId=${
        router.params.orderId
      }&ignoreEvaluate=${router.params.ignoreEvaluate ?? ""}`
    );
    navigateTo({
      url: `/childPackage/pages/edit?code=${router.params.code}&returnUrl=${returnUrl}`,
    });
  };

  const choose = (_v, i) => {
    setActive(i);
  };

  useDidShow(() => {
    (async () => {
      const res = await request({ url: "/children/list", data: page });
      setData(res.data.children);
      setIgnoreEvaluate(router.params.ignoreEvaluate ?? "");
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
      <Image src={Tianjia} className={styles.add} onClick={add} />

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
        {data?.length > 0 && (
          <View className={styles.bottom}>
            <View onClick={submit} className="primary-btn">
              {ignoreEvaluate?.includes("1") ? "提交数据" : "开始评测"}
            </View>
          </View>
        )}
      </View>
      <Notify id="notify" />
    </View>
  );
}
