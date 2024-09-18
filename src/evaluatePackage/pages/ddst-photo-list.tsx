import Box from "@/comps/Box";
import UploadMask from "@/comps/UploadMask";
import { MediaType } from "@/service/const";
import request from "@/service/request";
import upload2Server from "@/service/upload";
import Close from "@/static/imgs/close.png";
import Shiping from "@/static/imgs/shangchuanshipin.png";
import Zhankai from "@/static/imgs/zhankai.png";
import { Button, Notify, Popup, Textarea } from "@taroify/core";
import {
  Form,
  Image,
  Swiper,
  SwiperItem,
  Text,
  Video,
  View,
} from "@tarojs/components";
import { createVideoContext, useRouter } from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import { cls } from "reactutils";
import styles2 from "../../evaluatePackage/pages/duoyuan.module.scss";
import styles from "../../pages/evaluate/index.module.scss";

export default function App() {
  const router = useRouter();
  const [tishiVisible, setTishiVisible] = useState(false);
  const [guides, setGuides] = useState({ pictures: [], videos: [], words: [] });
  const [active, setActive] = useState(-1);
  const [intro, setIntro] = useState<any>({});
  const [num, setNum] = useState(0);
  const [data, setData] = useState<any>([]);
  const [isExpand, setIsExpand] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    const res = await request({
      url: "/ddst/questions",
      data: {
        code: router.params.code ?? 12,
        childrenId: router.params.childrenId ?? 0,
      },
    });
    const datas = res.data?.map((v) => ({
      ...v,
    }));
    setData(datas);
    // setActive(0);
  };

  const expand = () => {
    setIsExpand(!isExpand);
  };

  const changeVal = (e, q, m) => {
    q[m] = e;
    setData([...data]);
  };

  const mediaList = ({ type, filePath, thumbTempFilePath }) => {
    setIsUploading(true);

    upload2Server(
      filePath,
      type,
      (v) => {
        if (data[active].mediaList) {
          data[active].mediaList.push({
            type,
            localData: filePath,
            coverUrl: thumbTempFilePath,
          });
        } else {
          data[active].mediaList = [
            {
              type,
              localData: filePath,
              coverUrl: thumbTempFilePath,
            },
          ];
        }
        console.log("🚀 ~ file: brain.tsx ~ line 128 ~ success ~ v", v);
        data[active].attachments.push({
          type,
          serverId: v.id,
        });
        // setIsUploading(false);
        setNum(num + 1);
        setIsUploading(false);
      },
      (v) => {
        setProgress(v);
      }
    );
    setData([...data]);
  };

  const chooseMedia = (type: MediaType) => {
    if (isUploading) return;
    const isVideo = type === MediaType.VIDEO;
    wx.chooseMedia({
      count: 1,
      mediaType: [isVideo ? "video" : "image"],
      sourceType: ["album", "camera"],
      maxDuration: 60,
      camera: "back",
      success(res) {
        const filePath = res.tempFiles[0].tempFilePath;
        console.log(1, res, filePath);
        mediaList({
          type,
          filePath,
          thumbTempFilePath: res.tempFiles[0].thumbTempFilePath,
        });
      },
    });
  };

  const preview = (list, e) => {
    const urls = list.filter((v) => !v.includes("mp4"));
    wx.previewImage({
      urls, // 当前显示图片的 http 链接
      current: e,
    });
  };

  const playVideo = (v, id) => {
    const videoContext = createVideoContext(id);
    videoContext.requestFullScreen({ direction: 0 });
  };

  const del = (i, e) => {
    e.stopPropagation();
    data[active].mediaList.splice(i, 1);
    data[active].attachments.splice(i, 1);
    setData([...data]);
  };

  const submit = async () => {
    if (data[active]?.attachments?.length < 1) {
      Notify.open({
        color: "warning",
        message: "请至少上传一个姿势视频",
      });
      return;
    }
    let params: any = {
      answers: [{ ...data[active], questionSn: data[active].sn }],
      childrenId: router.params.childrenId,
      scaleTableCode: router.params.code ?? 9,
      // orderId:
    };
    const res = await request({
      url: "/ddst/save",
      data: params,
      method: "POST",
    });
    setTishiVisible(false);
  };

  const open = (i) => {
    setTishiVisible(true);
    setActive(i);
  };

  return (
    <View className={styles2.page}>
      <View
        className={cls(styles.box)}
        style={{ padding: "10px 10px 0 10px", backgroundColor: "#E7F8E7" }}
      >
        <Notify id="notify" />
        {data?.map((c, i) => (
          <View className={styles2.card} key={i} onClick={() => open(i)}>
            <View className={styles2.item}>
              <View
                className={styles2.label}
                style={{ fontWeight: "bold", fontSize: 16 }}
              >
                {c.subject}
              </View>
            </View>
            <View className={styles2.item}>
              <View className={styles2.label} style={{ width: 180 }}>
                {c.name}
              </View>
            </View>
            <View className={styles2.status}>
              {c.attachments?.length > 0 ? (
                <Text style={{ color: "#11BD8C" }}>已上传</Text>
              ) : (
                <Text style={{ color: "#ff7d41" }}>未上传</Text>
              )}
            </View>
          </View>
        ))}
      </View>
      <View className={styles.update}>{num}</View>

      <Popup
        placement="bottom"
        style={{ height: "100%" }}
        onClose={() => setTishiVisible(false)}
        open={tishiVisible}
      >
        <View style={{ margin: "10px 0px" }}>
          <View>
            <Box
              styles={{
                marginTop: 10,
              }}
              title={
                <View
                  style={{
                    position: "relative",
                  }}
                >
                  <Text style={{ zIndex: 2 }}>拍摄指南</Text>
                  <View className="linear-gradient"></View>
                </View>
              }
            >
              <View
                className={cls(
                  styles.desc,
                  styles["intro-box"],
                  isExpand && styles["constent-visible"]
                )}
              >
                {data[active]?.videos?.length > 0 && (
                  <Swiper
                    autoplay={false}
                    indicatorDots={true}
                    indicatorColor="rgba(0, 0, 0, .3)"
                    indicatorActiveColor="#ffd340"
                  >
                    {data[active]?.carousels.map((m) => (
                      <SwiperItem key={m} className={styles.swiperBox}>
                        <Video
                          src={m}
                          loop
                          x5-playsinline="true"
                          webkit-playsinline="true"
                          style={{ width: "100%", height: 143 }}
                        />
                      </SwiperItem>
                    ))}
                  </Swiper>
                )}

                {data[active]?.pictures?.length > 0 && (
                  <View className={styles.cardBox}>
                    <View className={styles.title}>拍摄指导图片 </View>
                    <Swiper
                      autoplay={false}
                      indicatorDots={true}
                      indicatorColor="rgba(0, 0, 0, .3)"
                      indicatorActiveColor="#ffd340"
                    >
                      {guides.pictures.map((m) => (
                        <SwiperItem key={m} className={styles.swiperBox}>
                          <Image
                            style="height: 143px;background: #fff;object-fit: cover"
                            src={m}
                            mode="aspectFit"
                            onClick={() => preview(guides.pictures, m)}
                          />
                        </SwiperItem>
                      ))}
                    </Swiper>
                  </View>
                )}

                <View className={styles.cardBox}>
                  <View className={styles.title}>拍摄说明 </View>
                  <View className={styles.intro} style={{ color: "#333333" }}>
                    {data[active]?.introduction}
                  </View>
                </View>
              </View>
              <View className={styles["expand-box"]} onClick={() => expand()}>
                <Text>{isExpand ? "收起隐藏" : "展开查看"}</Text>&nbsp;
                <Image
                  src={Zhankai}
                  className={cls(
                    styles["zhankai"],
                    isExpand && styles["is-expand"]
                  )}
                />
              </View>
            </Box>
          </View>

          <Box
            styles={{
              marginTop: 10,
            }}
            title={
              <View
                style={{
                  position: "relative",
                }}
              >
                <Text style={{ zIndex: 2 }}>补充说明</Text>
                <View className="linear-gradient"></View>
              </View>
            }
          >
            <View className={styles.buchongBox}>
              <Form>
                <Textarea
                  onChange={(e) =>
                    changeVal(e.detail.value, data[active], "remark")
                  }
                  style={{ height: 100 }}
                  value={data[active]?.remark ?? ""}
                  placeholder="请补充说明（非必填）"
                />
              </Form>
            </View>

            <View style={{ padding: 15, paddingTop: 0 }}>
              <View className={styles.mediaBox}>
                {data[active]?.mediaList?.map((v, i) => (
                  <View
                    className={cls(styles.iconBox, styles.videoBox)}
                    //   style={{ backgroundImage: `url(${v.coverUrl})` }}
                    key={i}
                    onClick={() => playVideo(v.localData, `video${i}`)}
                  >
                    <Video
                      src={v.localData}
                      id={`video${i}`}
                      loop={false}
                      autoplay={false}
                      controls={true}
                      poster={v.coverUrl}
                      style={{
                        width: 73,
                        height: 73,
                        borderRadius: "12px",
                      }}
                      objectFit="contain"
                    ></Video>
                    <Image
                      className={styles.clear}
                      onClick={(e) => del(i, e)}
                      src={Close}
                    />
                  </View>
                ))}

                {data[active]?.attachmentType?.includes("VIDEO") && (
                  <Image
                    src={Shiping}
                    className={styles.iconBox}
                    onClick={() => chooseMedia(MediaType.VIDEO)}
                  ></Image>
                )}
              </View>
            </View>
          </Box>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              padding: 10,
              gap: 10,
            }}
          >
            <Button
              className={styles.btn}
              onClick={() => setTishiVisible(false)}
              style={{ background: "#fff", color: "#59C398" }}
            >
              取消
            </Button>
            <Button className={styles.btn} onClick={submit} color="primary">
              上传
            </Button>
          </View>
        </View>
      </Popup>

      {isUploading && <UploadMask process={progress}></UploadMask>}
    </View>
  );
}
