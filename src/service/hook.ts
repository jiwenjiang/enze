import Taro, {
  getCurrentPages,
  navigateTo,
  setStorageSync,
  useRouter,
} from "@tarojs/taro";
import { useEffect, useRef, useState } from "react";
import request from "./request";

export function triggerSubscrip(cb?) {
  const enzeTempId = "FnFpEHdWq0_wKZ70PMAy_Fbuu2YbYPNFKUZ9vf7FLAI";
  // const enzeTempId = "WazgebdTA_-hWtIvKM1b3c___7qjF6qRs-YkhJqfhGI";
  // wx.getSetting({
  //   withSubscriptions: true,
  //   success(res) {
  //     if (res.subscriptionsSetting && res.subscriptionsSetting.itemSettings) {
  //       const subscriptionStatus =
  //         res.subscriptionsSetting.itemSettings[enzeTempId];
  // if (!subscriptionStatus) {
  wx.requestSubscribeMessage({
    tmplIds: [enzeTempId],
    success(res) {
      console.log("🚀 ~ success ~ res:", res);
    },
    complete() {
      cb?.();
    },
  });
  //     } else {
  //       cb?.();
  //     }
  //   }
  // },
  // fail() {
  //   cb?.();
  // },
  // });
}

export function useReportBtnHandle() {
  const [price, setPrice] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  let payRes = useRef<any>();

  const checkPay = async (c, isSelf = false) => {
    if (c.resourceId || c.productId) {
      const checkRes = await request({
        url: "/order/video/check",
        data: {
          resourceId: c.resourceId,
        },
      });
      if (checkRes.data.hasPaidOrder) {
        if (isSelf) {
          navigateTo({
            url: `${c.content}?recordId=${router.params.id}&productId=${c.productId}`,
          });
        } else {
          Taro.navigateToMiniProgram({
            appId: checkRes.data.appId,
            path: checkRes.data.page,
            success(res) {
              // 打开成功
            },
          });
        }
      } else {
        if (checkRes.data.orderId) {
          payRes.current = await request({
            url: "/order/pay",
            data: {
              id: checkRes.data?.orderId,
              ip: "127.0.0.1",
            },
          });
          payRes.current.order = c;
          setPrice(payRes.current.data.price);
          setOpen(true);
        } else {
          const orderRes = await request({
            url: "/order/video/create",
            data: {
              resourceId: c.resourceId,
              productId: c.productId,
            },
          });
          payRes.current = await request({
            url: "/order/pay",
            data: {
              id: orderRes.data?.orderId,
              ip: "127.0.0.1",
            },
          });
          payRes.current.order = c;
          setPrice(payRes.current.data.price);
          setOpen(true);
        }
      }
    } else {
      Taro.navigateToMiniProgram({
        appId: c.appId,
        path: c.content,
        success(res) {
          // 打开成功
        },
      });
    }
  };

  const toPay = () => {
    setOpen(false);
    wx.requestPayment({
      timeStamp: payRes.current.data.timeStamp,
      nonceStr: payRes.current.data.nonceStr,
      package: payRes.current.data.packageValue,
      signType: payRes.current.data.signType,
      paySign: payRes.current.data.paySign,
      success(res) {
        checkPay(payRes.current.order, payRes.current.order?.type === "SELF");
      },
    });
  };
  return { checkPay, toPay, open, setOpen, price };
}

export function useAuth() {
  const getAuth = async (cb?: Function | string, options: any = {}) => {
    const login = await Taro.login();
    const userInfo = await Taro.getUserInfo();
    try {
      const res = await request({
        url: "/miniapp/wxLogin",
        data: {
          code: login.code,
          encryptedData: userInfo.encryptedData,
          iv: userInfo.iv,
          ...options,
        },
      });
      if (res.code === 0) {
        setStorageSync("token", res.data.token);
        setStorageSync("user", res.data.user);
        wx._frontPage = res.data.user.frontPage;
        wx._unLogin = false;
        // Taro.reLaunch({
        //   url: `/pages/index/index?channel=${wx._frontPage}`
        // });
        if (typeof cb === "function") {
          cb?.(res);
        }
      }
    } catch (res) {
      if (typeof cb === "string") {
        if (cb === "login") {
          const pages = getCurrentPages();
          const path = pages[pages.length - 1].route;
          navigateTo({
            url: `/pages/login/index?returnUrl=/${path}&channel=${options.channel}&orgid=${options.orgid}`,
          });
        }
      }
      if (typeof cb === "function") {
        cb?.(res);
      }
    }
    return true;
  };
  const getPortal = async (cb?: Function | string, options: any = {}) => {
    try {
      const res = await request({
        url: "/wx/portal/get",
        data: {
          ...options,
        },
        notLogin: true,
      });
      if (res.code === 0) {
        console.log("🚀 ~ file: hook.ts:145 ~ getPortal ~ res:", res);
        wx._frontPage = res.data.frontPage;
        // Taro.reLaunch({
        //   url: `/pages/index/index?channel=${wx._frontPage}`
        // });
        if (typeof cb === "function") {
          cb?.(res.data);
        }
      }
    } catch (res) {
      if (typeof cb === "string") {
        if (cb === "login") {
          const pages = getCurrentPages();
          const path = pages[pages.length - 1].route;
          navigateTo({
            url: `/pages/login/index?returnUrl=/${path}&channel=${options.channel}&orgid=${options.orgid}`,
          });
        }
      }
      // cb?.(res);
    }
  };
  return { getAuth, getPortal };
}

export function useChannel(cb?: Function) {
  const router = useRouter();

  useEffect(() => {
    if (router.params.scene) {
      const str = router.params.scene as string;
      // const orgId = str.split("orgId%3D")[1];
      // const channel = str.split("channel%3D")[1];
      const decodedStr = decodeURIComponent(str); // 解码字符串
      const matchArr1 = decodedStr.match(/orgId=([^&]*)/); // 使用正则表达式匹配 channel 参数
      const matchArr2 = decodedStr.match(/channel=([^&]*)/); // 使用正则表达式匹配 channel 参数
      const orgId = matchArr1?.[1]; // 获取匹配到的内容
      const channel = matchArr2?.[1]; // 获取匹配到的内容
      setStorageSync("orgId", orgId);
      setStorageSync("channel", channel);

      wx._orgId = orgId;
      wx._channel = channel;

      cb?.();
    }
    if (router.params.orgId) {
      setStorageSync("orgId", router.params.orgId);
      wx._orgId = router.params.orgId;
    }
    if (router.params.channel) {
      wx._channel = router.params.channel;
      setStorageSync("channel", router.params.channel);
      cb?.();
    }
    if (
      !router.params.orgId &&
      !router.params.channel &&
      !router.params.scene
    ) {
      // removeStorageSync("orgId");
      // removeStorageSync("channel");
    }
  }, []);
}
