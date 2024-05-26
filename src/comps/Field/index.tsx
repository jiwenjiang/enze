import { Input, InputProps, View } from "@tarojs/components";
import React, { CSSProperties, ReactNode } from "react";
import styles from "./index.module.scss";

export default function FieldInput({
  label,
  customCls,
  rootStyles,
  labelStyles,
  inputStyles,
  type,
  ...args
}: {
  label?: ReactNode;
  customCls?: string;
  rootStyles?: CSSProperties;
  labelStyles?: CSSProperties;
  inputStyles?: CSSProperties;
  type?: string;
} & InputProps) {
  return (
    <View className={styles.box} style={rootStyles}>
      {label && (
        <View className={styles.label} style={labelStyles}>
          {label}
        </View>
      )}
      <Input
        {...args}
        type={type}
        className={styles.input}
        style={inputStyles}
        placeholderClass={styles.placeholder}
      />
    </View>
  );
}
