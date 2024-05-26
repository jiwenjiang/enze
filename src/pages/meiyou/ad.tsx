import { EvaluateType, PaymentType } from "@/service/const";
import { ChildContext } from "@/service/context";
import { useChannel } from "@/service/hook";
import request from "@/service/request";
import { Base64, navWithLogin } from "@/service/utils";
import { ActionSheet, Notify } from "@taroify/core";
import { ChatOutlined } from "@taroify/icons";
import { Image, ScrollView, Text, View } from "@tarojs/components";
import { navigateTo, useDidShow } from "@tarojs/taro";
import React, { useContext, useState } from "react";
import styles from "./ad.module.scss";

enum Channel {
  fushu,
  anqier,
  quzhou,
  leibo,
  meiyou
}

export default function App() {
  const [staticData, setStaticData] = useState<any>({
    detail: "",
    button: ""
  });

  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState<any>({});
  const childContext = useContext(ChildContext);

  const channelJudge = async () => {
    const res = await request({
      url: "/promotion/get"
    });
    setStaticData(res.data);
  };

  useChannel(channelJudge);

  const preview = () => {
    wx.openCustomerServiceChat({
      extInfo: { url: "https://work.weixin.qq.com/kfid/kfc86155f0abef5c38b" },
      corpId: "ww47f31bbc9556c2ef",
      success(res) {
        console.log("🚀 ~ file: index.tsx:38 ~ success ~ res:", res);
      }
    });
  };

  const checkPay = id => {
    if (childContext.child.len) {
      navigateTo({
        url: `/childPackage/pages/choose?code=${price.scaleTableCode}&orderId=${id}`
      });
    } else {
      const returnUrl = Base64.encode("/pages/evaluate/list?key=1");
      navigateTo({
        url: `/childPackage/pages/manage?returnUrl=${returnUrl}`
      });
    }
  };

  const buy = async () => {
    const res = await request({
      url: "/reserve/unified",
      method: "POST",
      data: {
        category: 1,
        childrenId: 0,
        scaleCodes: [Number(price.scaleTableCode)],
        priceId: price.id,
        payment: PaymentType.ONLINE,
        invoiceId: [0],
        type: EvaluateType.ZHINENG,
        workScheduleId: 0
      }
    });
    if (!res.data.hasPaidOrder) {
      const payRes = await request({
        url: "/order/pay",
        data: { id: res.data.orderId, ip: "127.0.0.1" }
      });
      wx.requestPayment({
        timeStamp: payRes.data.timeStamp,
        nonceStr: payRes.data.nonceStr,
        package: payRes.data.packageValue,
        signType: payRes.data.signType,
        paySign: payRes.data.paySign,
        success(res2) {
          Notify.open({ color: "success", message: "支付成功" });
          checkPay(res.data.orderId);
        }
      });
    } else {
      checkPay(res.data.orderId);
    }
  };

  const preBuy = async () => {
    if (wx._unLogin) {
      navWithLogin(`/pages/meiyou/ad`);
    } else {
      const checkRes = await request({
        url: "/order/check",
        data: { scaleTableCode: price.scaleTableCode }
      });
      if (!checkRes.data.hasPaidOrder) {
        setOpen(true);
      } else {
        //   console.log(checkRes);
        checkPay(checkRes.data.orderId);
      }
    }
  };

  // 每次页面显示时获取儿童信息

  const getChildrenList = async () => {
    const res = await request({ url: "/children/list" });
    childContext.updateChild({ len: res.data.children.length });
  };

  useDidShow(() => {
    (async () => {
      getChildrenList();
      const res2 = await request({
        url: "/promotion/scale/price/get"
      });
      setPrice(res2.data);
      console.log("🚀 ~ file: ad.tsx:129 ~ res2.data:", res2.data);
    })();
  });

  return (
    <View className="index">
      <ScrollView className={styles.imgView}>
        <Image src={staticData.detail} mode="widthFix" className={styles.m1} />
        <View className={styles.action}>
          <View className={styles.kefu} onClick={preview}>
            <ChatOutlined size={20} />
            <Text className={styles.kefu}>客服</Text>
          </View>
          <View>
            <View className={styles.btn} onClick={() => preBuy()}>
              {price.salePrice && <Text>￥{price.salePrice}</Text>} 立即购买
            </View>
          </View>
        </View>
        <ActionSheet
          open={open}
          onSelect={() => setOpen(false)}
          onClose={setOpen}
        >
          <View className={styles.pop}>
            <View className={styles.title}>{price.scaleTableName}</View>
            <View className={styles.yuanjian}>原价：{price.listPrice}元</View>
            <View className={styles.youhui}>
              <View>
                限时优惠：<Text>{price.salePrice}元</Text>
              </View>
              <View className={styles.payBtn} onClick={buy}>
                立即支付
              </View>
            </View>
          </View>
        </ActionSheet>
      </ScrollView>
    </View>
  );
}
