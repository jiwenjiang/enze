import { triggerSubscrip } from "@/service/hook";
// import Kefu from "@/static/icons/kefu.svg";
// import Kefu2 from "@/static/icons/kefu2.svg";
import Kefu from "@/static/imgs/kefu.png";
import Shouye from "@/static/imgs/shouye.png";
import Shouye2 from "@/static/imgs/shouye2.png";
import Wode from "@/static/imgs/wode.png";
import Wode2 from "@/static/imgs/wode2.png";
import { Image, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import "./index.scss";

const pageList = [
  {
    page: "index",
    url: "/pages/index/index",
  },
  {
    page: "kefu",
    url: "/pages/kefu/index",
  },
  {
    page: "mine",
    url: "/pages/mine/index",
  },
];

export default function TabBar({ current }) {
  const [kefuData, setKefuData] = useState({});
  const handleClick = (e) => {
    triggerSubscrip(() => {
      const page = pageList[e];
      Taro.switchTab({ url: page.url });
    });

    // setCurrent(e);
  };

  const open = () => {
    wx.openCustomerServiceChat({
      extInfo: { url: "https://work.weixin.qq.com/kfid/kfc3a09902ab27c5ae3" },
      corpId: "wx8e0f1ae4262d5e44",
      success(res) {
        console.log("🚀 ~ file: index.tsx:38 ~ success ~ res:", res);
      },
    });
  };

  useEffect(() => {
    // async () => {
    //   await request({
    //     url: "/org/customerService/get",
    //     method: "GET"
    //   });
    // };
  }, []);

  return (
    <View className="tab-wrap">
      <View className="tab-item">
        {current === "index" ? (
          <View className="tab-active-item">
            <Image src={Shouye2} className="tab-item-img-active"></Image>
            <View>首页</View>
          </View>
        ) : (
          <View onClick={() => handleClick(0)}>
            <Image src={Shouye} className="tab-item-img"></Image>
            <View>首页</View>
          </View>
        )}
      </View>
      <View className="tab-item" onClick={() => open()}>
        <Image src={Kefu} className="tab-item-img"></Image>
        <View>客服</View>
      </View>

      <View className="tab-item">
        {current === "mine" ? (
          <View className="tab-active-item">
            <Image src={Wode} className="tab-item-img-active"></Image>
            <View>我的</View>
          </View>
        ) : (
          <View onClick={() => handleClick(2)}>
            <Image src={Wode2} className="tab-item-img"></Image>
            <View>我的</View>
          </View>
        )}
      </View>

      {/* <Tabbar
        value={pageList.findIndex((v) => v.page === current)}
        fixed={true}
      >
        <Tabbar.TabItem icon={<HomeOutlined />} onClick={() => handleClick(0)}>
          首页
        </Tabbar.TabItem>
        <Tabbar.TabItem
          icon={
            <Image
              src={current === "kefu" ? Kefu2 : Kefu}
              style={{ width: 16, height: 16 }}
            />
          }
          // onClick={() => handleClick(1)}
          onClick={() => open()}
        >
          客服
        </Tabbar.TabItem>
        <Tabbar.TabItem
          icon={<UserCircleOutlined />}
          onClick={() => handleClick(2)}
        >
          我的
        </Tabbar.TabItem>
      </Tabbar> */}
    </View>
  );
}
