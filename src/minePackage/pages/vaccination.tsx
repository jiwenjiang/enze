import ChooseChild from "@/comps/ChooseChild";
import request from "@/service/request";
import Weiguo from "@/static/imgs/weiguo.png";
import Yiguo from "@/static/imgs/yiguo.png";
import { Notify } from "@taroify/core";
import { Image, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, { useRef, useState } from "react";
import { cls } from "reactutils";
import styles from "./vaccination.module.scss";

export default function App() {
  const [list, setList] = useState<any>([]);
  const childrenId = useRef();

  const getList = async (id) => {
    const res = await request({
      url: "/vaccination/list",
      data: { childrenId: id },
    });
    childrenId.current = id;
    setList(res.data);
  };

  const changeChild = (child) => {
    if (child?.id) {
      getList(child?.id);
    }
  };

  const goto = (v) => {
    Taro.navigateTo({
      url: `/minePackage/pages/vaccination-detail?id=${v.id}&childrenId=${childrenId.current}`,
    });
  };

  return (
    <View className={styles.index}>
      <Notify id="notify" />
      <ChooseChild change={changeChild} />

      <View className={styles.listBox}>
        <View className={styles.list}>
          {list?.map((v) => (
            <View
              className={cls(styles.itemBox, v.expired && styles.expired)}
              onClick={() => goto(v)}
            >
              <View className={styles.itemName}>
                <Text className={styles.nameTxt}>{v.name}</Text>&nbsp;
                <Text
                  className={v.expired ? styles.expiredTag : styles.itemTag}
                >
                  {v.expired ? "已" : "未"}过建议时间
                </Text>
                &nbsp;
                <Image
                  className={styles.goIcon}
                  src={v.expired ? Weiguo : Yiguo}
                />
              </View>
              <View className={styles.bottomItem}>
                <View className={styles.kv}>
                  <Text className={styles.itemLabel}>接种月龄:</Text>
                  <Text className={styles.itemVal}>{v.timeToVaccinate}</Text>
                </View>
                <View className={styles.kv}>
                  <Text className={styles.itemLabel}>参考价格:</Text>
                  <Text className={styles.itemVal}>{v.price}</Text>
                </View>
                <View className={styles.kv}>
                  <Text className={styles.itemLabel}>建议接种时间:</Text>
                  <Text className={styles.itemVal}>{v.actualVaccinate}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
