import TabBar from "@/comps/TabBar";
import { ScaleTableCode } from "@/service/const";
import { ChildContext } from "@/service/context";
import { triggerSubscrip, useAuth } from "@/service/hook";
import request from "@/service/request";
import { Base64, navWithLogin } from "@/service/utils";
import duoyuan from "@/static/imgs/zhuyeduoyuan.png";
import fengxian from "@/static/imgs/zhuyefengxian.png";
import baogao from "@/static/imgs/zhuyepinggu.png";
import shuimian1 from "@/static/imgs/zhuyeshuimian.png";
import shuimian2 from "@/static/imgs/zhuyeshuimian2.png";
import { Notify } from "@taroify/core";
import { Image, Video, View } from "@tarojs/components";
import Taro, { navigateTo, setStorageSync, useDidShow } from "@tarojs/taro";
import React, { useContext, useEffect, useState } from "react";
import styles from "./index.module.scss";

export default function App() {
  const { getAuth } = useAuth();
  const childContext = useContext(ChildContext);

  const [staticData, setStatic] = useState({
    background: "",
    banner: "",
    carousel: [],
    problemPhone: "",
    supportPhone: "",
    logo: "",
    aiEvaluation: "",
    record: "",
    footer: "",
    cover: "",
  });

  // useChannel(channelJudge);

  const goto = (url) => {
    triggerSubscrip(() => {
      navWithLogin(url);
    });
    // getAuth(() => getChild(url));
  };

  const waitOpen = () => {
    Notify.open({
      color: "warning",
      message: "敬请期待",
    });
  };

  useEffect(() => {
    // const timer = setInterval(() => {
    //   const user = getStorageSync("user");
    //   if (user) {
    //     setModules(user?.modules);
    //     clearInterval(timer);
    //   }
    // }, 1000);
  }, []);

  useDidShow(() => {
    // getPortal(res => {
    //   if (wx._frontPage === "xaaqer") {
    //     setChannel(Channel.anqier);
    //     request({
    //       url: "/wx/portal/angle",
    //       method: "GET"
    //     }).then(res => {
    //       setAnqierStatic(res.data);
    //     });
    //   }
    //   if (wx._frontPage === "qzxfybjy") {
    //     setChannel(Channel.quzhou);
    //     request({
    //       url: "/wx/portal/quzhou",
    //       method: "GET"
    //     }).then(res => {
    //       setQuzhouStatic(res.data);
    //     });
    //   }
    //   setModules(res.modules);
    // });
    getAuth((res) => {
      wx._unLogin = res.code === 2;
      // setUnLogin(wx._unLogin);
    });
    request({
      url: "/wx/portal/v2/youbaoshanyu",
      method: "GET",
    }).then((res) => {
      console.log("🚀 ~ useDidShow ~ res:", res);
      setStatic(res.data);
      setStorageSync("staticData", res.data);
    });
  });

  const check = async (scaleTableCode) => {
    if (wx._unLogin) {
      navigateTo({
        url: `/pages/login/index?returnUrl=${"/pages/index/index"}`,
      });
    } else {
      triggerSubscrip(async () => {
        const res = await request({
          url: "/order/check",
          data: { scaleTableCode },
        });
        if (!res.data.hasPaidOrder) {
          navigateTo({
            url: `/orderPackage/pages/order/gmsPay?code=${scaleTableCode}&returnUrl=${"/pages/index/index"}`,
          });
        } else {
          if (childContext.child.len) {
            navigateTo({
              url: `/childPackage/pages/choose?code=${scaleTableCode}&orderId=${res.data.orderId}`,
            });
          } else {
            const returnUrl = Base64.encode(
              `/childPackage/pages/choose?code=${scaleTableCode}&orderId=${res.data.orderId}`
            );

            navigateTo({
              url: `/childPackage/pages/manage?code=${scaleTableCode}&returnUrl=${returnUrl}`,
            });
          }
        }
      });
    }
  };

  useEffect(() => {
    Taro.showShareMenu({
      // 可选的分享参数，如显示分享的按钮
      withShareTicket: true,
    });
    // Taro.useShareTimeline(() => {
    //   return {
    //     title: "婴幼儿发育风险评估",
    //     path: "/pages/index", // 分享的页面路径
    //     imageUrl: staticData.banner, // 分享的图片 URL
    //     success: function(res) {
    //       // 分享成功
    //     },
    //     fail: function(res) {
    //       // 分享失败
    //     },
    //   };
    // });
  }, []);

  return (
    <View>
      <View
        className={styles.index}
        style={{ backgroundImage: `url(${staticData.background})` }}
      >
        <View className={styles.section}>
          <View
            className={styles.banner}
            style={{ marginTop: 0, marginBottom: 10 }}
          >
            <Video
              src={staticData.banner}
              id={`video`}
              loop={false}
              autoplay={false}
              controls={true}
              direction={90}
              poster={staticData.cover}
              style={{
                width: "100%",
                height: 121,
                margin: "0 18px",
                borderRadius: 14,
              }}
              objectFit="contain"
            ></Video>
          </View>
          <View className={styles.card} style={{ marginTop: 0 }}>
            <View className={styles.cardTitle}>发育风险评估</View>
            <View className={styles.bannerImgBox}>
              <Image
                className={styles.cardImg}
                src={fengxian}
                mode="widthFix"
                onClick={() => check(ScaleTableCode.LEIBO_GMS)}
              ></Image>
              <Image
                className={styles.cardImg}
                src={baogao}
                mode="widthFix"
                onClick={() => goto("/evaluatePackage/pages/recordList")}
              ></Image>
            </View>
          </View>
          <View className={styles.card} style={{ marginTop: 0 }}>
            <View className={styles.cardTitle}>睡眠管理</View>
            <View className={styles.bannerImgBox}>
              <Image
                className={styles.cardImg}
                src={shuimian2}
                mode="widthFix"
                onClick={() => goto("/minePackage/pages/sleep")}
              ></Image>
              <Image
                className={styles.cardImg}
                src={shuimian1}
                mode="widthFix"
                onClick={() => goto("/minePackage/pages/sleepv2")}
              ></Image>
            </View>
          </View>

          <View className={styles.card} style={{ marginTop: 0 }}>
            <View className={styles.cardTitle}>其它工具</View>
            <View>
              <Image
                className={styles.cardImg}
                src={duoyuan}
                mode="widthFix"
                onClick={() => goto("/evaluatePackage/pages/duoyuan")}
              ></Image>
            </View>
          </View>
        </View>
        <View className={styles.footer}></View>
        <TabBar current="index" />
      </View>
    </View>
  );
}
