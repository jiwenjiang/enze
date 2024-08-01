import TabBar from "@/comps/TabBar";
import { ScaleTableCode } from "@/service/const";
import { ChildContext } from "@/service/context";
import { triggerSubscrip, useAuth, useChannel } from "@/service/hook";
import request from "@/service/request";
import { Base64, navWithLogin } from "@/service/utils";
import { Image, Video, View } from "@tarojs/components";
import Taro, { navigateTo, setStorageSync, useDidShow } from "@tarojs/taro";
import React, { useContext, useEffect, useState } from "react";
import styles from "./index.module.scss";

export default function App() {
  const { getAuth, getPortal } = useAuth();

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
    showInHospital: "",
  });

  const channelJudge = () => {
    if (wx._orgId === "hzsdyrmyy") {
      request({
        url: "/wx/portal/hzsdyrmyy",
        method: "GET",
      }).then((res) => {
        setStatic(res.data);
        setStorageSync("staticData", res.data);
      });
    }
    if (wx._orgId === "hzsfckyy") {
      request({
        url: "/wx/portal/hzsfckyy",
        method: "GET",
      }).then((res) => {
        setStatic(res.data);
        setStorageSync("staticData", res.data);
      });
    }
  };
  useChannel(channelJudge);

  const goto = (url) => {
    triggerSubscrip(() => {
      navWithLogin(url);
    });
    // getAuth(() => getChild(url));
  };

  useDidShow(() => {
    // wx.
    getPortal((res) => {
      if (wx._frontPage === "hzsdyrmyy") {
        request({
          url: "/wx/portal/hzsdyrmyy",
          method: "GET",
        }).then((res) => {
          setStatic(res.data);
          setStorageSync("staticData", res.data);
        });
      }
      if (wx._frontPage === "hzsfckyy") {
        request({
          url: "/wx/portal/hzsfckyy",
          method: "GET",
        }).then((res) => {
          setStatic(res.data);
          setStorageSync("staticData", res.data);
        });
      }
    });
    getAuth("login");
  });

  const check = async (scaleTableCode, ignoreEvaluate?: number) => {
    if (wx._unLogin) {
      navigateTo({
        url: `/pages/login/index?returnUrl=${"/pages/index/index"}`,
      });
    } else {
      triggerSubscrip(async () => {
        const res = await request({
          url: "/order/check",
          data: {
            scaleTableCode,
            useWay: ignoreEvaluate ? 2 : 1,
          },
        });
        if (!res.data.hasPaidOrder) {
          navigateTo({
            url: `/orderPackage/pages/order/gmsPay?code=${scaleTableCode}&returnUrl=${"/pages/index/index"}&ignoreEvaluate=${ignoreEvaluate}`,
          });
        } else {
          if (childContext.child.len) {
            navigateTo({
              url: `/childPackage/pages/choose?code=${scaleTableCode}&orderId=${res.data.orderId}&ignoreEvaluate=${ignoreEvaluate}`,
            });
          } else {
            const returnUrl = Base64.encode(
              `/childPackage/pages/choose?code=${scaleTableCode}&orderId=${res.data.orderId}&ignoreEvaluate=${ignoreEvaluate}`
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
          {staticData.showInHospital && (
            <View className={styles.bannerImgBox}>
              <Image
                className={styles.cardImg}
                src={staticData.showInHospital}
                style={{ height: 160, width: 375 }}
                onClick={() => check(ScaleTableCode.LEIBO_GMS, 1)}
              ></Image>
            </View>
          )}

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
