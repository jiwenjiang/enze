import request from "@/service/request";
import nanhai from "@/static/imgs/nanhai.png";
import nvhai from "@/static/imgs/nvhai.png";
import play from "@/static/imgs/play.png";
import target from "@/static/imgs/target.png";
import { Image, Text, Video, View } from "@tarojs/components";
import { createVideoContext, useRouter } from "@tarojs/taro";
import React, { useEffect, useRef, useState } from "react";
import { cls } from "reactutils";
import styles from "./stepDetail.module.scss";

export default function App() {
  return (
    <View className={styles.box}>
      <Card />
    </View>
  );
}

function Card() {
  const [report, setReportData] = useState<any>({});
  const [plan, setPlan] = useState<any>({});
  const router = useRouter();

  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const videoContext = useRef<any>();

  useEffect(() => {
    (async () => {
      const res = await request({
        url: "/recovery/base",
        data: { id: router.params.id }
      });
      setReportData(res.data);
      const res2 = await request({
        url: "/recovery/plan",
        data: { id: router.params.id }
      });
      setPlan(res2.data);
    })();
  }, []);

  useEffect(() => {
    videoContext.current = createVideoContext("video");
  }, []);

  const playVideo = v => {
    setCurrentVideoUrl(v);
    // videoContext.current.requestFullScreen();
    videoContext.current.requestFullScreen({ direction: 0 });
    setTimeout(() => {
      videoContext.current.play();
    }, 100);
  };

  const leaveVideo = () => {
    videoContext.current.pause();
    setCurrentVideoUrl("");
  };

  return (
    <View>
      <View>
        <View className={styles.gapHead}>基本信息</View>
        <Info data={report} />
        <View className={styles.gapHead}>评估结果</View>
        <View className={styles.cardBox}>
          <View className={styles.newCard}>
            <View className={styles.newTitle}>
              <Image src={target} className={styles.imgIcon} />
              &nbsp;康复疗程目标
            </View>
            <View className={styles.target}>{plan?.target}</View>
            {plan?.items?.map((v, i) => (
              <View className={styles.videoLine} key={i}>
                <View>{v.name}</View>
                <View className={styles.refer}>
                  单次{v.cycles}次 / 每次{v.everyDuration}秒 / 每周{v.days}次
                </View>
                <Image
                  onClick={() => playVideo(v.videoUrl)}
                  src={play}
                  className={styles.playImg}
                />
              </View>
            ))}
          </View>
        </View>

        <Video
          src={currentVideoUrl}
          id={`video`}
          controls={true}
          className={styles.videoRef}
          onFullscreenChange={leaveVideo}
          vslideGestureInFullscreen
        ></Video>
      </View>
    </View>
  );
}

function Info({ data }) {
  return (
    <View className={styles.cardBox}>
      <View className={styles.newCard}>
        <View className={styles.newTitle}>
          {data.gender === "男" ? (
            <Image src={nanhai} className={styles.imgIcon} />
          ) : (
            <Image src={nvhai} className={styles.imgIcon} />
          )}
          &nbsp;{data.childrenName}&emsp;{data.age}岁
        </View>

        <View className={cls(styles.listItem, styles.list)}>
          <View className={styles.newkv}>
            <Text className={styles.k}>编号</Text>
            <Text className={styles.v}>{data.id}</Text>
          </View>
          <View className={styles.newkv}>
            <Text className={styles.k}>性别</Text>
            <Text className={styles.v}>{data.gender}</Text>
          </View>
        </View>
        <View className={cls(styles.listItem, styles.list)}>
          <View className={styles.newkv}>
            <Text className={styles.k}>出生体重</Text>
            <Text className={styles.v}>{data.birthWeight}g</Text>
          </View>
          <View className={styles.newkv}>
            <Text className={styles.k}>出生日期</Text>
            <Text className={styles.v}>{data.birthday}</Text>
          </View>
        </View>
        <View className={cls(styles.listItem, styles.list)}>
          <View className={styles.newkv}>
            <Text className={styles.k}>出生孕周</Text>
            <Text className={styles.v}>{data.gestationalWeek}</Text>
          </View>
          <View className={styles.newkv}>
            <Text className={styles.k}>就诊卡号</Text>
            <Text className={styles.v}>{data.medicalCardNumber}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
