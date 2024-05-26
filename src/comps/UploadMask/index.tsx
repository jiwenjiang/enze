import { Loading } from "@taroify/core";
import { View } from "@tarojs/components";
import React from "react";
import { cls } from "reactutils";
import styles from "./index.module.scss";

export default function UploadMask({ process = 0 }: { process: number }) {
  return (
    <View className={cls(styles.box)}>
      <View className={styles.process}>
        <View>
          <Loading type="spinner" />
        </View>
        <View>上传进度 {process} %</View>
      </View>
    </View>
  );
}
