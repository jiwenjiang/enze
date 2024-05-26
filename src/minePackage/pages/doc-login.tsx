import FieldInput from "@/comps/Field";
import { Button, Notify } from "@taroify/core";
import { Canvas, Text, View } from "@tarojs/components";
import Taro, { getStorageSync } from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import styles from "./vaccination.module.scss";

export default function App() {
  const generateCaptcha = () => {
    // 实际应用中，这里应该是生成验证码的逻辑，可以是后端接口返回的验证码
    const newCaptcha = Math.random()
      .toString(36)
      .substring(2, 6);
    return newCaptcha;
  };
  const [growData, setGrowData] = useState({
    phone: "",
    password: "",
    checkCode: "",
  });
  const [captcha, setCaptcha] = useState(generateCaptcha());

  const save = async () => {};

  const onChange = (v, k) => {
    setGrowData({ ...growData, [k]: v });
  };

  const genCode = () => {
    setCaptcha(generateCaptcha());
  };

  useEffect(() => {
    const user = getStorageSync("user");
    setGrowData({ ...growData, phone: user.phone });
  }, []);

  const drawCaptcha = () => {
    setTimeout(() => {
      Taro.createSelectorQuery()
        .select("#captchaCanvas")
        .fields({ node: true, size: true })
        .exec((res) => {
          console.log("🚀 ~ .exec ~ res:", res);
          const canvas = res[0].node;
          const ctx = canvas.getContext("2d");
          // 清空画布
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // 设置字体样式
          ctx.font = "80px Arial";
          ctx.fillStyle = "#000";

          // 绘制验证码
          ctx.fillText(captcha, 80, 100);

          // 添加干扰线
          for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(
              Math.random() * canvas.width,
              Math.random() * canvas.height
            );
            ctx.lineTo(
              Math.random() * canvas.width,
              Math.random() * canvas.height
            );
            ctx.strokeStyle = "#888";
            ctx.stroke();
          }
        });
    });
  };

  useEffect(() => {
    if (captcha) {
      drawCaptcha();
    }
  }, [captcha]);

  return (
    <View className={styles.index}>
      <Notify id="notify" />

      <View className={styles.form} style={{ overflow: "hidden" }}>
        <View style={{ margin: "10px 0" }}>
          <View className={styles.info}>
            <Text className={styles.label}>用户名</Text>
            <Text className={styles.value}>{growData.phone}</Text>
          </View>
        </View>
        <View className={styles.row}>
          <FieldInput
            label="密码"
            placeholder="请输入密码"
            value={growData.password}
            type="safe-password"
            onInput={(e: any) => onChange(e.target.value, "password")}
          />
        </View>
        <View className={styles.row}>
          <FieldInput
            label="校验码"
            placeholder="请输入校验码"
            value={growData.password}
            type="safe-password"
            onInput={(e: any) => onChange(e.target.value, "password")}
          />
          <Canvas
            canvasId="captchaCanvas"
            type="2d"
            onClick={genCode}
            id="captchaCanvas"
            style={{ width: "80px", height: "40px" }}
          />
        </View>

        <View className={styles.actions}>
          <Button className={styles.btn} color="primary" onClick={save}>
            登录
          </Button>
        </View>
      </View>
    </View>
  );
}
