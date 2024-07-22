import Box from "@/comps/Box";
import NavBar from "@/comps/NavBar";
import Steper from "@/comps/Steper";
import UploadMask from "@/comps/UploadMask";
import { MediaType, ScaleTableCode } from "@/service/const";
import request from "@/service/request";
import upload2Server from "@/service/upload";
import AudioSvg from "@/static/icons/audio.svg";
import StopSvg from "@/static/icons/stop.svg";
import Close from "@/static/imgs/close.png";
import Shiping from "@/static/imgs/shangchuanshipin.png";
import UploadImg from "@/static/imgs/shangchuantupian.png";
import Zhankai from "@/static/imgs/zhankai.png";
import { Button, Loading, Notify, Textarea } from "@taroify/core";
import { PauseCircleOutlined, PlayCircleOutlined } from "@taroify/icons";
import {
  Form,
  Image,
  Swiper,
  SwiperItem,
  Text,
  Video,
  View,
} from "@tarojs/components";
import {
  InnerAudioContext,
  RecorderManager,
  createInnerAudioContext,
  createVideoContext,
  getRecorderManager,
  navigateTo,
  useRouter,
} from "@tarojs/taro";
import React, { useEffect, useRef, useState } from "react";
import { cls } from "reactutils";
import styles from "./index.module.scss";

const transTitle = (e) => {
  return {
    [ScaleTableCode.GMS]: "GMs评测",
    [ScaleTableCode.BRAIN]: "脑瘫评测",
    [ScaleTableCode.BRAIN_GMS]: "脑瘫+GMs评测",
  }[e];
};

const stepList = [
  { label: "自发姿势运动", desc: "拍摄视频" },
  { label: "扶持迈步激发运动", desc: "拍摄视频" },
  { label: "补充其他信息", desc: "" },
];

export default function App() {
  const router = useRouter();
  const [data, setData] = useState<any>([]);
  const [guides, setGuides] = useState({ pictures: [], videos: [], words: [] });
  const [active, setActive] = useState(-1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isRecord, setIsRecord] = useState(false);
  const [chooseAns, setChooseAns] = useState<any>([]);
  const [isPlay, setIsPlay] = useState(false);
  const [btnText, setBtnText] = useState("提交答案");
  const [num, setNum] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const recorderManager = useRef<RecorderManager>();
  const innerAudioContext = useRef<InnerAudioContext>();
  const [title] = useState(transTitle(Number(router.params.code)));
  const tempId = useRef<any>([]);
  const [isExpand, setIsExpand] = useState(false);
  const [progress, setProgress] = useState(0);

  const expand = () => {
    setIsExpand(!isExpand);
  };

  const getList = async () => {
    const res = await request({
      url: "/scaleTable/get",
      data: {
        code: router.params.code ?? 12,
        birthday: router.params.age ?? 0,
      },
    });
    const datas = res.data.subjects?.map((v) => ({
      ...v,
      questions: v.questions?.map((c) => ({
        ...c,
        remark: "",
        attachments: [],
        mediaList: [],
        answerSn: 1,
      })),  
    }));
    setData(datas);
    setActive(0);
  };

  useEffect(() => {
    if (active > -1) {
      getGuide();
    }
  }, [active]);

  useEffect(() => {
    getGuide();
  }, [questionIndex]);

  const getGuide = async () => {
    if (data[active]?.questions?.[questionIndex]) {
      const res = await request({
        url: "/scaleTable/guide",
        data: {
          code: router.params.code ?? 9,
          questionSn: data[active].questions[questionIndex].sn,
          childId: router.params.childId,
        },
      });

      setGuides(res.data);
    }

    // setVisible(true);
  };

  const getTemp = async () => {
    const res = await request({
      url: "/wx/portal/template",
    });
    tempId.current = [res.data.scaleResultNotify];
  };

  useEffect(() => {
    getList();
    getTemp();
  }, []);

  const pre = () => {
    if (questionIndex === 0) {
      setActive(active - 1);
      setQuestionIndex(data[active - 1].questions.length - 1);
    } else {
      setQuestionIndex(questionIndex - 1);
    }
  };

  const next = () => {
    if (isUploading) return;
    let hasVideo = false;
    data[active].questions.forEach((c) => {
      if (c.mediaList.some((c) => c.type === MediaType.VIDEO)) {
        hasVideo = true;
      }
    });
    // const list = data[active].questions[questionIndex]?.mediaList;
    // const noVideo = list.every((c) => c.type !== MediaType.VIDEO);
    if (!hasVideo && questionIndex === 1) {
      Notify.open({
        color: "warning",
        message: "请至少上传一个姿势视频",
      });
      return;
    }
    if (questionIndex < data[active].questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setActive(active + 1);
      setQuestionIndex(0);
    }
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
        if (data[active].questions[questionIndex].mediaList) {
          data[active].questions[questionIndex].mediaList.push({
            type,
            localData: filePath,
            coverUrl: thumbTempFilePath,
          });
        } else {
          data[active].questions[questionIndex].mediaList = [
            {
              type,
              localData: filePath,
              coverUrl: thumbTempFilePath,
            },
          ];
        }
        console.log("🚀 ~ file: brain.tsx ~ line 128 ~ success ~ v", v);
        data[active].questions[questionIndex].attachments.push({
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

  const startRecord = () => {
    if (isUploading) return;
    setIsRecord(true);
    if (!recorderManager.current) {
      recorderManager.current = getRecorderManager();
      recorderManager.current.onStop((res) => {
        console.log("recorder stop", res);
        const { tempFilePath } = res;
        mediaList({
          type: MediaType.AUDIO,
          filePath: tempFilePath,
          thumbTempFilePath: null,
        });
      });
      recorderManager.current.start({
        format: "mp3",
      });
    } else {
      recorderManager.current.start({
        format: "mp3",
      });
    }
  };

  const stopRecord = () => {
    setIsRecord(false);
    recorderManager.current?.stop();
  };

  const startVoice = (localId) => {
    setIsPlay(true);
    if (!innerAudioContext.current) {
      innerAudioContext.current = createInnerAudioContext();
      innerAudioContext.current.src = localId;
      innerAudioContext.current.play();
    } else {
      innerAudioContext.current.src = localId;
      innerAudioContext.current.play();
    }
  };

  const stopVoice = () => {
    innerAudioContext.current?.stop();
    setIsPlay(false);
  };

  const submit = async () => {
    if (
      data[active].questions[questionIndex]?.mediaList?.length === 0 &&
      data[active].questions[questionIndex]?.answerSn !== 1
    ) {
      Notify.open({ color: "warning", message: "请至少上传一个视频或图片" });
      return;
    }
    const answers: any = [];
    data.forEach((c, i) => {
      c.questions.forEach((v, i2) => {
        answers.push({
          answerSn: i2 === 2 ? chooseAns : [v.answerSn],
          questionSn: v.sn,
          remark: v.remark,
          attachments: v.attachments,
        });
      });
    });
    let params: any = {
      childrenId: router.params.childId,
      scaleTableCode: router.params.code ?? 9,
      answers,
      // answers: data[active].questions?.map((v) => ({
      //   answerSn: v.answerSn ?? 1,
      //   questionSn: v.sn,
      //   remark: v.remark,
      //   attachments: v.attachments,
      // })),
    };
    params.orderId = router.params.orderId;
    if (btnText === "上传中") return;
    setBtnText("上传中");
    const res = await request({
      url: "/scaleRecord/save",
      data: params,
      method: "POST",
    });
    if (res.success) {
      setBtnText("提交答案");
      if (Number(router.params.code) === ScaleTableCode.GMS) {
        navigateTo({
          url: `/pages/evaluate/gmsDetail?id=${res.data.id}&returnUrl=/pages/index/index`,
        });
      } else if (Number(router.params.code) === ScaleTableCode.BRAIN) {
        navigateTo({
          url: `/pages/evaluate/brainDetail?id=${res.data.id}&returnUrl=/pages/index/index`,
        });
      } else if (
        Number(router.params.code) === ScaleTableCode.LEIBO_BRAIN ||
        Number(router.params.code) === ScaleTableCode.LEIBO_GMS
      ) {
        navigateTo({
          url: `/evaluatePackage/pages/stepDetail?id=${res.data.id}&returnUrl=/pages/index/index`,
        });
      } else {
        navigateTo({
          url: `/pages/evaluate/brainGmsDetail?id=${res.data.id}&returnUrl=/pages/index/index`,
        });
      }
      wx.requestSubscribeMessage({
        tmplIds: tempId.current,
        success(res) {},
      });
      // if (router.params.code === "9") {
      // }
    }
  };

  const playVideo = (v, id) => {
    const videoContext = createVideoContext(id);
    videoContext.requestFullScreen({ direction: 0 });
  };

  const del = (i, e) => {
    e.stopPropagation();
    data[active].questions[questionIndex].mediaList.splice(i, 1);
    data[active].questions[questionIndex].attachments.splice(i, 1);
    setData([...data]);
  };

  const preview = (list, e) => {
    const urls = list.filter((v) => !v.includes("mp4"));
    wx.previewImage({
      urls, // 当前显示图片的 http 链接
      current: e,
    });
  };

  const addChoose = (v) => {
    if (chooseAns.includes(v)) {
      setChooseAns(chooseAns.filter((c) => c !== v));
    } else {
      setChooseAns([...chooseAns, v]);
    }
  };

  return (
    <View className={cls(styles.box, styles.stepIndex)}>
      <NavBar title={title} />
      <View className={styles.stepBox}>
        <Steper
          list={stepList}
          extendStyle={{ paddingBottom: 40 }}
          activeIndex={questionIndex}
        ></Steper>
      </View>
      {data[active] && (
        <View style={{ margin: "10px 0px" }}>
          {(questionIndex === 0 || questionIndex === 1) && (
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
                  {guides.videos?.length > 0 && (
                    <Swiper
                      autoplay={false}
                      indicatorDots={true}
                      indicatorColor="rgba(0, 0, 0, .3)"
                      indicatorActiveColor="#ffd340"
                    >
                      {guides.videos.map((m) => (
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

                  {guides.pictures?.length > 0 && (
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

                  {guides.words?.length > 0 && (
                    <View className={styles.cardBox}>
                      <View className={styles.title}>拍摄说明 </View>
                      {guides.words.map((v, i) => (
                        <View
                          key={i}
                          className={styles.intro}
                          style={{ color: "#333333" }}
                        >
                          {v}
                        </View>
                      ))}
                    </View>
                  )}
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
          )}

          {questionIndex === 2 && (
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
                  <Text style={{ zIndex: 2 }}>选择动作</Text>
                  <View className="linear-gradient"></View>
                </View>
              }
            >
              <View className={styles.answers}>
                <View className={styles.zhinanText}>
                  请您根据孩子的日常运动表现，您的孩子不会下面哪些动作（非必填，可多选，可上传视频）
                </View>
                <View className={styles.tagBox}>
                  {data[active].questions[questionIndex].answers?.map(
                    (v, i) => (
                      <View
                        key={i}
                        onClick={() => addChoose(v.sn)}
                        className={cls(
                          styles.tag,
                          chooseAns.includes(v.sn) && styles.activeTag
                        )}
                      >
                        {v.content}
                      </View>
                    )
                  )}
                </View>
              </View>
            </Box>
          )}
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
                    changeVal(
                      e.detail.value,
                      data[active].questions[questionIndex],
                      "remark"
                    )
                  }
                  style={{ height: 100 }}
                  value={data[active].questions[questionIndex]?.remark ?? ""}
                  placeholder="请补充说明（非必填）"
                />
              </Form>
            </View>

            <View style={{ padding: 15, paddingTop: 0 }}>
              <View className={styles.mediaBox}>
                {data[active].questions[questionIndex]?.mediaList?.map((v, i) =>
                  v.type === MediaType.PICTURE ? (
                    <View className={styles.iconBox}>
                      <Image
                        className={styles.clear}
                        onClick={(e) => del(i, e)}
                        src={Close}
                      />
                      <Image
                        className={styles.imgs}
                        key={i}
                        src={v.localData}
                      />
                    </View>
                  ) : v.type === MediaType.VIDEO ? (
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
                  ) : (
                    <View className={styles.iconBox} key={i}>
                      {isPlay ? (
                        <PauseCircleOutlined
                          size={32}
                          onClick={() => stopVoice()}
                        />
                      ) : (
                        <View>
                          <PlayCircleOutlined
                            size={32}
                            onClick={() => startVoice(v.localData)}
                          />
                          <Image
                            className={styles.clear}
                            onClick={(e) => del(i, e)}
                            src={Close}
                          />
                        </View>
                      )}
                    </View>
                  )
                )}
                {data[active].questions[
                  questionIndex
                ]?.attachmentType?.includes("PICTURE") && (
                  <Image
                    src={UploadImg}
                    className={styles.iconBox}
                    onClick={() => chooseMedia(MediaType.PICTURE)}
                  ></Image>
                )}
                {data[active].questions[
                  questionIndex
                ]?.attachmentType?.includes("VIDEO") && (
                  <Image
                    src={Shiping}
                    className={styles.iconBox}
                    onClick={() => chooseMedia(MediaType.VIDEO)}
                  ></Image>
                )}
                {data[active].questions[
                  questionIndex
                ]?.attachmentType?.includes("AUDIO") && (
                  <View
                    className={styles.iconBox}
                    onClick={() => {
                      isRecord ? stopRecord() : startRecord();
                    }}
                  >
                    {isRecord ? (
                      <Image className={styles.iconImg} src={StopSvg}></Image>
                    ) : (
                      <Image className={styles.iconImg} src={AudioSvg}></Image>
                    )}
                  </View>
                )}
              </View>
            </View>
          </Box>
          <View>
            {active === data.length - 1 &&
            questionIndex === data[active]?.questions?.length - 1 ? (
              <View className={styles.btnbox}>
                {data[active]?.questions?.length > 1 && (
                  <Button className={styles.btnGray} onClick={pre}>
                    上一步
                  </Button>
                )}
                <Button className={styles.btn} onClick={submit} color="primary">
                  {btnText === "上传中" ? (
                    <Loading type="spinner" className={styles.customColor} />
                  ) : (
                    btnText
                  )}
                </Button>
              </View>
            ) : (
              <View className={styles.btnbox}>
                {questionIndex !== 0 && (
                  <Button className={styles.btnGray} onClick={pre}>
                    上一步
                  </Button>
                )}
                <Button className={styles.btn} color="primary" onClick={next}>
                  下一步
                </Button>
              </View>
            )}
          </View>
        </View>
      )}

      <View>
        <Notify id="notify" />
        <View className={styles.update}>{num}</View>
      </View>
      {isUploading && <UploadMask process={progress}></UploadMask>}
    </View>
  );
}
