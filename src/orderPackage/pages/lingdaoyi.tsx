import { categoryEnum } from "@/service/const";
import { navWithLogin } from "@/service/utils";
import { Tabbar } from "@taroify/core";
import { Completed, NotesOutlined, TodoListOutlined } from "@taroify/icons";
import { View } from "@tarojs/components";
import React from "react";
import styles from "./xianliti.module.scss";

export default function App() {
  const goto = url => {
    navWithLogin(url);
  };
  return (
    <View className={styles.index}>
      <View className={styles.gotoBox}>
        <View
          className={styles.goto2}
          onClick={() => goto("/pages/evaluate/list")}
        >
          智能评估
        </View>
        <View
          className={styles.goto2}
          onClick={() =>
            goto(
              `/orderPackage/pages/book/index?type=2&origin=${categoryEnum.isLingDaoYi}`
            )
          }
        >
          预约家庭康复指导
        </View>
      </View>

      <View className={styles.tabWrap}>
        <Tabbar fixed={true} value={null}>
          <Tabbar.TabItem
            icon={<TodoListOutlined />}
            onClick={() =>
              goto(
                `/orderPackage/pages/book/records?origin=${categoryEnum.isLingDaoYi}`
              )
            }
          >
            预约记录
          </Tabbar.TabItem>
          <Tabbar.TabItem
            icon={<Completed />}
            onClick={() =>
              goto(
                `/evaluatePackage/pages/recordList?origin=${categoryEnum.isLingDaoYi}`
              )
            }
          >
            评估报告
          </Tabbar.TabItem>
          <Tabbar.TabItem
            icon={<NotesOutlined />}
            onClick={() =>
              goto(
                `/evaluatePackage/pages/ganyuList?origin=${categoryEnum.isLingDaoYi}`
              )
            }
          >
            干预方案
          </Tabbar.TabItem>
        </Tabbar>
      </View>
    </View>
  );
}
