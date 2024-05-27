import TabBar from "@/comps/TabBar";
import request from "@/service/request";
import { navWithLogin } from "@/service/utils";
import ertongguanli from "@/static/imgs/ertongguanli.png";
import Head from "@/static/imgs/head.png";
import pinggudingdan from "@/static/imgs/pinggudingdan.png";
import { Image, Text, View } from "@tarojs/components";
import { getStorageSync, useDidShow } from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import "./index.scss";

const cusStyle = {
  display: "flex",
  alignItems: "center",
  padding: "0 12px",
  width: "100%",
};

export default function App() {
  const [user, setUser] = useState("");
  const [url, setUrl] = useState("");
  const [showGrowth, setShowGrowth] = useState(true);
  const [staticData, setStaticData] = useState<any>({});

  useEffect(() => {
    const res = getStorageSync("staticData");
    setStaticData(res);
  }, []);

  useDidShow(() => {
    (async () => {
      if (!wx._unLogin) {
        const res = await request({
          url: "/user/get",
          method: "GET",
        });
        console.log("🚀 ~ res.data:", res.data);
        setUser(res.data?.name);
        setUrl(res.data?.avatarUrl);
        const user = getStorageSync("user");
        setShowGrowth(user.showGrowth);
      }
    })();
    // setUser(getStorageSync("user"));
  });

  const goto = (url, e?) => {
    e?.stopPropagation();
    navWithLogin(url);
  };

  return (
    <View
      className="index"
      style={{ backgroundImage: `url(${staticData.myBackground})` }}
    >
      <View>
        <View
          className="avator"
          onClick={() => goto("/minePackage/pages/info")}
        >
          <Image className="ava" src={url || Head} />
          <Text>{user || "未登录"}</Text>
          {/* <Text
            className="doctor"
            onClick={(e) => goto("/minePackage/pages/doc-login", e)}
          >
            我是医生
          </Text> */}
        </View>
        <View className="function-region">
          {/* {showGrowth && (
            <View
              className="item"
              onClick={() => goto("/minePackage/pages/grow")}
            >
              <Image className="trade" src={fayuziping} />
              <Text className="sub-title">发育自评</Text>
            </View>
          )} */}
          {/* <View
            className="item"
            onClick={() => goto("/minePackage/pages/vaccination")}
          >
            <Image className="trade" src={yimiaotongzhi} />
            <Text className="sub-title">疫苗须知</Text>
          </View>
          <View
            className="item"
            onClick={() => goto("/minePackage/pages/sleep")}
          >
            <Image className="trade" src={shuimianrizhi} />
            <Text className="sub-title">睡眠日志</Text>
          </View>
          <View
            className="item"
            onClick={() => goto("/evaluatePackage/pages/duoyuan")}
          >
            <Image className="trade" src={duoyuan} />
            <Text className="sub-title">多元智能</Text>
          </View> */}
          <View
            className="item"
            onClick={() => goto("/orderPackage/pages/order/scale")}
          >
            <Image className="trade" src={pinggudingdan} />
            <Text className="sub-title">评估订单</Text>
          </View>
          <View
            className="item"
            onClick={() => goto("/childPackage/pages/manage")}
          >
            <Image className="trade" src={ertongguanli} />
            <Text className="sub-title">儿童管理</Text>
          </View>
        </View>
      </View>
      <TabBar current="mine" />
    </View>
  );
}
