import NavBar from "@/comps/NavBar";
import request from "@/service/request";
import Down from "@/static/icons/download.svg";
import { Image, View } from "@tarojs/components";
import { useRouter } from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import styles from "./brainDetail.module.scss";

export default function App() {
  return (
    <View className={styles.box}>
      <Card />
    </View>
  );
}

function Card() {
  const [data, setData] = useState<any>([]);
  const router = useRouter();

  useEffect(() => {
    downloadImg();
  }, []);

  const downloadImg = async () => {
    const res = await request({
      url: router.params.url ?? "/scaleRecord/report/picture",
      data: { id: router.params.id }
    });
    console.log("🚀 ~ file: previewReport.tsx:30 ~ downloadImg ~ res:", res)
    setData(res.data);
  };

  const preview = () => {
    console.log("🚀 ~ file: previewReport.tsx:38 ~ preview ~ data", data);

    wx.previewImage({
      urls: data, // 当前显示图片的 http 链接
      current: 0
    });
  };

  return (
    <View>
      <NavBar title={router.params.name || "评估详情"} />
      <View>
        <Image
          onClick={preview}
          src={data[0]}
          mode="widthFix"
          className={styles.reportImg}
        ></Image>
      </View>
      {data?.[0] && (
        <View className={styles.downLoadBox} onClick={preview}>
          下载报告&nbsp;
          <Image src={Down} className={styles.downLoad} />{" "}
        </View>
      )}
    </View>
  );
}
