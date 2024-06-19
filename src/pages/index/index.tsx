import TabBar from "@/comps/TabBar";
import { ScaleTableCode } from "@/service/const";
import { ChildContext } from "@/service/context";
import { triggerSubscrip, useAuth } from "@/service/hook";
import request from "@/service/request";
import { Base64, navWithLogin } from "@/service/utils";
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
    learningDisability: "",
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
      url: "/wx/portal/teyangxinxi",
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
                height: 160,
                margin: "0 18px",
                borderRadius: 14,
              }}
              objectFit="contain"
            ></Video>
          </View>
          <View className={styles.bannerImgBox}>
            <Image
              className={styles.cardImg}
              src={staticData.aiEvaluation}
              style={{ height: 160, width: 375 }}
              onClick={() => check(ScaleTableCode.LEIBO_GMS)}
            ></Image>
          </View>
          <View className={styles.bannerImgBox}>
            <Image
              className={styles.cardImg}
              src={staticData.learningDisability}
              style={{ height: 160, width: 375 }}
              onClick={() => goto("/evaluatePackage/pages/obstacle")}
            ></Image>
          </View>
          <View className={styles.bannerImgBox}>
            <Image
              className={styles.cardImg}
              src={staticData.record}
              style={{ height: 160, width: 375 }}
              onClick={() => goto("/evaluatePackage/pages/recordList")}
            ></Image>
          </View>
        </View>
        <View className={styles.footer}></View>
        <TabBar current="index" />
      </View>
    </View>
  );
}
