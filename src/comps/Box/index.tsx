import { View } from "@tarojs/components";
import React, { CSSProperties } from "react";
import { cls } from "reactutils";
import "./index.scss";

export default function Box({
  title,
  children,
  styles,
  titleStyles,
  noM,
}: {
  title?: React.ReactNode;
  children: React.ReactNode;
  styles?: CSSProperties;
  titleStyles?: CSSProperties;
  noM?: boolean;
}) {
  return (
    <View className={cls("card",noM && 'noM')} style={styles}>
      {title && (
        <View className="title" style={titleStyles}>
          {title}
        </View>
      )}
      <View>{children}</View>
    </View>
  );
}
