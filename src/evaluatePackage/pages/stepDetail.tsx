import Box from "@/comps/Box";
import NavBar from "@/comps/NavBar";
import Qrcode from "@/comps/Qrcode";
import { ScaleTableCode } from "@/service/const";
import request from "@/service/request";
import jiedu from "@/static/icons/jiedu.svg";
import noticeIcon from "@/static/icons/notice.svg";
import Quanshen from "@/static/icons/quanshen.svg";
import Xiazai from "@/static/icons/xiazai.svg";
import Zishi from "@/static/icons/zishi.svg";
import Bofang from "@/static/imgs/bofang.png";
import hospital from "@/static/imgs/hospital.png";
import introImg from "@/static/imgs/intro.png";
import wenyisheng from "@/static/imgs/wenyisheng2.png";
import Zhankai from "@/static/imgs/zhankai2.png";
import { Backdrop, Popup } from "@taroify/core";
import { Image, RichText, Text, Video, View } from "@tarojs/components";
import Taro, { createVideoContext, navigateTo, useRouter } from "@tarojs/taro";
import React, { useEffect, useRef, useState } from "react";
import { cls } from "reactutils";
import styles from "./stepDetail.module.scss";

const intros = [
  {
    title: "1、正常扭动运动（N）：【扭动阶段】",
    content:
      "出现在足月至足月后6~9周龄内。其特征为小至中等幅度，速度缓慢至中等，运动轨迹在形式上呈现为椭圆体，给人留下扭动的印象。",
  },
  {
    title: "2、正常不安运动（F+）：【不安阶段】",
    content:
      "是一种小幅度中速运动，遍布颈、躯干和四肢,发生在各个方向，运动加速度可变，在清醒婴儿中该运动持续存在(哭闹时除外)，通常在足月后9周龄左右出现。早产儿可在矫正年龄足月后6周龄左右出现不安运动。不安运动出现的频度随年龄而发生改变，一般可以分为：①连续性不安运动：指不安运动时常出现,间以短时间暂停。不安运动发生在整个身体，尤其在颈、躯干、肩、腕、髋和踝部。不安运动在不同身体部位的表现可能不同，取决于身体姿势尤其是头部位置。②间歇性不安运动：指不安运动之间的暂停时间延长，令人感觉到不安运动在整个观察时期内仅出现一半。③偶发性不安运动：不安运动之间的暂停时间更长。",
  },
];

const intros2 = [
  {
    title: "1、单调性（PR）：【扭动阶段】",
    content:
      "表现为宝宝连续性运动顺序的单调，不同身体部位的运动失去了正常的GMS复杂性，总是简单的重复几个动作。存在一定的神经运动发育障碍风险。",
  },
  {
    title: "2、痉挛－同步性（CS）：【扭动阶段】",
    content:
      "扭动运动阶段出现运动僵硬，失去正常的流畅性，所有肢体和躯干肌肉几乎同时收缩和放松，比如双腿同时抬高并且同时放下。存在神经运动发育障碍风险。",
  },
  {
    title: "3、混乱型（CH）：【扭动阶段】",
    content:
      "扭动运动阶段出现肢体运动幅度大，顺序混乱，失去流畅性，动作突然不连贯。“混乱型”相当少见，常在数周后发展为“痉挛－同步性”GMs。存在神经运动发育障碍风险。",
  },
  {
    title: "4、不安运动缺乏（F-）：【不安阶段】",
    content:
      "不安运动是一种小幅度，中速度的细微运动，在9-20周龄的宝宝身上会如星辰般闪烁的各个的身体部位上。如果没有这样的细微运动出现，便是不安运动缺乏了。存在神经运动发育障碍风险。",
  },
  {
    title: "5、异常不安运动 （AF）：【不安阶段】",
    content:
      "看起来与正常不安运动相似，但在动作幅度、速度以及不平稳性方面中度或明显夸大。该异常模式少见, 并且预测价值低。",
  },
];

export default function App() {
  return (
    <View className={styles.box}>
      <Card />
    </View>
  );
}

function Card() {
  const [report, setReportData] = useState<any>({});
  const router = useRouter();
  const [intro, setIntro] = useState(false);
  const [isExpand, setIsExpand] = useState(false);
  const [abnormal, setAbnormal] = useState<
    { name: string; detail: any; isExpand: boolean }[]
  >([]);
  const [videos, setVideos] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const videoContext = useRef<any>();
  const [isfushu, setIsFushu] = useState(false);
  const [showCourse, setShowCourse] = useState(false);
  const [abnormalVisible, setAbnormalVisible] = useState(false);
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    // setIsFushu(isFushu());
  }, []);
  useEffect(() => {
    (async () => {
      // const res = await request({
      //   url: "/scaleRecord/get",
      //   data: { id: router.params.id || 1 }
      // });
      // setData(res.data);
      const res2 = await request({
        url: "/scaleRecord/report",
        data: { id: router.params.id },
      });
      console.log("🚀 ~ file: stepDetail.tsx:99 ~ res2:", res2);
      setIsFushu(res2.data.askDoctor);
      setShowCourse(
        res2.data.scaleResult?.cerebralPalsyResult?.showVideo ||
          res2.data.scaleResult?.showVideo
      );
      if (ScaleTableCode.LEIBO_BRAIN === res2.data.scaleTableCode) {
        const obj = {
          ...res2.data,
          scaleResult: { cerebralPalsyResult: res2.data.scaleResult },
        };
        setReportData(obj);
      } else {
        setReportData(res2.data);
      }
      setVideos(
        (ScaleTableCode.LEIBO_BRAIN === res2.data.scaleTableCode
          ? res2.data.scaleResult?.videos
          : res2.data.scaleResult?.cerebralPalsyResult?.videos) || []
      );

      const first = await request({
        url: "/scaleRecord/abnormal/methods/detail",
        data: {
          abnormalIterm:
            ScaleTableCode.LEIBO_BRAIN === res2.data.scaleTableCode
              ? res2.data.scaleResult?.abnormalIterm?.[0]
              : res2.data.scaleResult?.cerebralPalsyResult?.abnormalIterm?.[0],
        },
      });
      const list =
        ScaleTableCode.LEIBO_BRAIN === res2.data.scaleTableCode
          ? res2.data.scaleResult?.abnormalIterm || []
          : res2.data.scaleResult?.cerebralPalsyResult?.abnormalIterm || [];
      setAbnormal(
        list.map((v, i) => {
          if (i === 0) {
            return {
              name: v,
              detail: handleRichText(first.data.detail),
              isExpand: false,
            };
          } else {
            return {
              name: v,
              detail: "",
              isExpand: false,
            };
          }
        })
      );
      setActiveTab(list[0]);
      console.log(
        "🚀 ~ file: stepDetail.tsx:130 ~ res2.data.scaleResult.abnormalIterm[0]",
        list
      );
    })();
  }, []);

  const handleRichText = (v) => {
    let result = v.replace(/\<img/g, '<img class="img"');
    result = result.replace(/\<p/g, '<p class="p"');
    return result;
  };

  const downloadImg = async () => {
    const res = await request({
      url: "/scaleRecord/report/picture",
      data: { id: router.params.id },
    });
    preview(res?.data, 0);
  };

  const preview = (urls, e) => {
    wx.previewImage({
      urls, // 当前显示图片的 http 链接
      current: e,
    });
  };

  const expand = () => {
    setIsExpand(!isExpand);
  };

  const expandRich = (i) => {
    abnormal[i].isExpand = !abnormal[i].isExpand;
    setAbnormal([...abnormal]);
  };

  const changeTab = async (index) => {
    console.log(
      "🚀 ~ file: stepDetail.tsx:196 ~ changeTab ~ abnormal[index].name:",
      abnormal[index].name
    );

    if (!abnormal[index].detail) {
      const res = await request({
        url: "/scaleRecord/abnormal/methods/detail",
        data: {
          abnormalIterm: abnormal[index].name,
        },
      });
      abnormal[index].detail = handleRichText(res.data.detail);
      setAbnormal([...abnormal]);
    }
    setActiveTab(abnormal[index].detail);
    console.log(
      "🚀 ~ file: stepDetail.tsx:206 ~ changeTab ~ abnormal[index].name:",
      abnormal
    );
  };

  useEffect(() => {
    videoContext.current = createVideoContext("video");
  }, []);

  const playVideo = (v, id) => {
    setCurrentVideoUrl(v);
    // videoContext.current.requestFullScreen();
    videoContext.current.requestFullScreen({ direction: 0 });
    setTimeout(() => {
      videoContext.current.play();
    }, 100);
  };

  const leaveVideo = () => {
    console.log("🚀 ~ file: stepDetail.tsx:198 ~ leaveVideo ~ leaveVideo");
    videoContext.current.pause();
    setCurrentVideoUrl("");
  };

  const goto = () => {
    navigateTo({
      url: `/orderPackage/pages/book/index?type=4`,
    });
  };

  const toTab = (v) => {
    if (v.status > 0) {
      const index = abnormal.findIndex((c) => c.name === v.name);
      changeTab(index);
    }
  };

  const openJiedu = (v) => {
    if (v.status > 0) {
      const index = abnormal.findIndex((c) => c.name === v.name);
      changeTab(index);
    }
    setAbnormalVisible(true);
  };

  const back = () => {
    Taro.switchTab({ url: "/pages/index/index" });
  };

  const openKefu = () => {
    setShowQr(true);
    // wx.openCustomerServiceChat({
    //   extInfo: { url: "https://work.weixin.qq.com/kfid/kfc3a09902ab27c5ae3" },
    //   corpId: "wx8e0f1ae4262d5e44",
    //   success(res) {
    //     console.log("🚀 ~ file: index.tsx:38 ~ success ~ res:", res);
    //   },
    // });
  };

  return (
    <View className="common-bg">
      <NavBar title={"评估详情" || report?.scaleTableName} />
      {/* <Contact /> */}

      {report?.progressStatus && (
        <View>
          {report?.progressStatusCode !== 3 ? (
            <View style={{ paddingBottom: 20 }}>
              <View className={styles.cardBox}>
                <View className={styles.card}>
                  <View className={styles.title}>
                    <Image src={noticeIcon} className={styles.imgIcon} />
                    &nbsp; 温馨提示
                  </View>
                  <View className={styles.noEvaluete}>
                    <View>
                      已提交医学评估，预计3个工作日内完成评估，请耐心等待。医学评估后您可以收到微信服务通知，请注意查收并查看报告。您也可以在小程序首页查看报告。
                    </View>
                  </View>
                </View>
              </View>

              <Info data={report} />
              
              <View className={styles.cardBox}>
                <View className={styles.preBtn} onClick={() => back()}>
                  返回首页
                </View>
              </View>
            </View>
          ) : (
            <View>
              <Info data={report} />
              <Box
                title={
                  <View
                    style={{
                      position: "relative",
                      width: "100%",
                    }}
                  >
                    <View
                      style={{
                        position: "relative",
                        width: "fit-content",
                      }}
                    >
                      <Text>评估结果</Text>
                      <View className="linear-gradient"></View>
                    </View>
                    <View className={styles.downLoadBox} onClick={downloadImg}>
                      <Image src={Xiazai} className={styles.downLoad} />
                      下载电子报告&nbsp;
                    </View>
                  </View>
                }
                styles={{ marginTop: 10 }}
              >
                <View style={{ padding: 15, paddingTop: 0 }}>
                  {ScaleTableCode.LEIBO_GMS === report.scaleTableCode && (
                    <View className={styles.jieguoBg}>
                      <View
                        className={cls(
                          styles.evaKey,
                          report.scaleResult?.developmentRisk !== 3 && styles.bb
                        )}
                      >
                        <Image src={Quanshen} className={styles.icon} />
                        全身运动质量评估结果：
                        <Text
                          className={
                            report.scaleResult?.gmsResult?.stage !== '1'
                              ? styles.evaRed
                              : styles.evaGreen
                          }
                        >
                          {" "}
                          {report.scaleResult?.gmsResult?.stage === '2'
                            ? "有异常"
                            : report.scaleResult?.gmsResult?.stage === '3'
                            ? report.scaleResult?.gmsResult?.stageResult
                            : "无异常"}
                        </Text>
                      </View>
                      {report.scaleResult?.developmentRisk !== 3 && (
                        <View className={styles.evaKey}>
                          <Text
                            className={
                              report.scaleResult?.gmsResult?.stageResult?.includes(
                                "正常"
                              )
                                ? styles.evaGreen
                                : styles.evaRed
                            }
                          >
                            {" "}
                            {report.scaleResult?.gmsResult?.stageResult}
                          </Text>{" "}
                          <Image
                            src={jiedu}
                            className={styles.jiedu}
                            onClick={() => setIntro(true)}
                          />
                        </View>
                      )}
                    </View>
                  )}
                  <View className={styles.jieguoBg} style={{ marginTop: 6 }}>
                    {report?.scaleResult?.cerebralPalsyResult?.videoStatus ===
                    1 ? (
                      <View className={cls(styles.evaKey)}>
                        <Image src={Zishi} className={styles.icon} />
                        姿势运动评估结果：{" "}
                        <Text className={styles.evaRed}>视频拍摄不合格</Text>
                      </View>
                    ) : (
                      <View>
                        <View
                          className={cls(styles.evaKey, styles.bb)}
                          style={{ marginBottom: 10 }}
                        >
                          <Image src={Zishi} className={styles.icon} />
                          姿势运动评估结果：
                          <Text
                            className={
                              report?.scaleResult?.cerebralPalsyResult
                                ?.haveAbnormalIterm
                                ? styles.evaRed
                                : styles.evaGreen
                            }
                          >
                            {report?.scaleResult?.cerebralPalsyResult
                              ?.haveAbnormalIterm
                              ? "有异常"
                              : "无异常"}
                          </Text>
                        </View>
                        <View>
                          {/* <View className={cls(styles.head, styles.headTxt)}>
                        <View>姿势和运动异常</View>
                        <View>医学评估</View>
                      </View> */}
                          <View
                            className={cls(
                              styles.positionBox,
                              isExpand && styles.contentVisible
                            )}
                          >
                            {report?.scaleResult?.cerebralPalsyResult?.positionAndSportAbnormal?.map(
                              (v, i) => (
                                <View key={i} className={cls(styles.head)}>
                                  <View className={styles.head2}>{v.name}</View>
                                  <View
                                    className={cls(
                                      styles.succ,
                                      v.optionSn === 2 && styles.warning,
                                      v.optionSn === 3 && styles.error
                                    )}
                                    onClick={() => toTab(v)}
                                  >
                                    {v.optionSn === 1
                                      ? "未出现"
                                      : v.optionSn === 2
                                      ? "疑似"
                                      : "出现"}
                                  </View>
                                  <View
                                    style={{ width: 35, lineHeight: "1px" }}
                                  >
                                    {v.optionSn !== 1 && (
                                      <Image
                                        src={jiedu}
                                        className={styles.jiedu}
                                        style={{ position: "static" }}
                                        onClick={() => openJiedu(v)}
                                      />
                                    )}
                                  </View>
                                </View>
                              )
                            )}
                          </View>
                          <View
                            className={styles.expandBox}
                            onClick={() => expand()}
                          >
                            <Text>{isExpand ? "收起隐藏" : "展开查看"}</Text>
                            &nbsp;
                            <Image
                              src={Zhankai}
                              className={cls(
                                styles.expandImg,
                                isExpand && styles["is-expand"]
                              )}
                            />
                          </View>
                        </View>
                      </View>
                    )}
                  </View>
                  <View style={{ marginBottom: 24 }}>
                    <View className={styles.pinggu}>
                      <Text className={styles.pingguk}>评估时间：</Text>
                      <Text>{report.evaluateDate}</Text>
                    </View>
                    <View className={styles.pinggu}>
                      <Text className={styles.pingguk}>评估专家：</Text>
                      <Text>{report.doctorName}</Text>
                    </View>
                    <View className={styles.pinggu}>
                      <Text className={styles.pingguk}>审核人：</Text>
                      <Text>{report.reviewDoctorName}</Text>
                    </View>
                    <View className={styles.desc}>
                      *评估结果基于神经发育异常和高危因素给出，且评估结果不代表诊断结果
                    </View>
                  </View>
                </View>
              </Box>
              <Box
                title={
                  <View
                    style={{
                      position: "relative",
                    }}
                  >
                    <Text>早期干预建议</Text>
                    <View className="linear-gradient"></View>
                  </View>
                }
                styles={{ marginTop: 10 }}
              >
                <View className={styles.tabBox}>
                  <View className={styles.evaBox3}>
                    {report?.scaleResult?.cerebralPalsyResult?.suggest?.map(
                      (c, i) => (
                        <View
                          className={cls(
                            styles.evaKey,
                            i % 2 === 0 && styles.evaKeyTitle
                          )}
                          style={{ marginBottom: 10 }}
                        >
                          {c.content}
                        </View>
                      )
                    )}
                  </View>
                </View>
              </Box>
              {showCourse && (
                <Box
                  title={
                    <View
                      style={{
                        position: "relative",
                      }}
                    >
                      <Text>推荐课程</Text>
                      <View className="linear-gradient"></View>
                    </View>
                  }
                  styles={{ marginTop: 10 }}
                >
                  <View className={styles.videoBox}>
                    {videos.map((v, i1) => (
                      <View className={styles.videoItem}>
                        <Image
                          src={Bofang}
                          className={styles.videoItemPlay}
                          onClick={() => playVideo(v.url, `video${i1}`)}
                        />

                        <Image
                          src={v.coverUrl}
                          className={styles.videoImg}
                          onClick={() => playVideo(v.url, `video${i1}`)}
                          mode="aspectFit"
                        ></Image>
                        <View className={styles.videoDescBox}>
                          <View className={styles.videoName}>{v.name}</View>
                          <View className={styles.videoRemark}>{v.remark}</View>
                        </View>
                      </View>
                    ))}
                  </View>
                </Box>
              )}

              <Video
                src={currentVideoUrl}
                id={`video`}
                controls={true}
                className={styles.videoRef}
                onFullscreenChange={leaveVideo}
                vslideGestureInFullscreen
              ></Video>
            </View>
          )}
        </View>
      )}

      <Popup
        placement="bottom"
        style={{ height: "60%" }}
        onClose={() => setIntro(false)}
        open={intro}
      >
        <View>
          <Image src={introImg} className={styles.introImg} />
        </View>
        <View className={styles.introBox}>
          全身运动（GMs）是最常出现和最复杂的一种自发性运动模式，最早出现于妊娠9周的胎儿，持续至出生后5~6个月，能够十分有效地评估年幼神经系统的功能。GMs指整个身体参与的运动，臂、腿、颈和躯干以变化运动顺序的方式参与，这种GMs在运动强度、力量和速度方面具有高低起伏的变化，运动的开始和结束都具有渐进性。沿四肢轴线的旋转和运动方向的轻微改变使整个运动流畅优美并产生一种复杂多变的印象。
        </View>
        <View className={styles.introBox}>
          GMs按时间的发育历程包括：足月前GMs（foetal and preterm
          GMs，即胎儿和早产儿阶段），扭动运动（writhing
          movements，WMs，即从足月至足月后6~9周龄）和不安运动（fidgety
          movements，FMs，即足月后6~9周龄至5~6月龄）。
        </View>
        <View className={styles.introBox}>其中正常GMs主要有：</View>
        {intros.map((v) => (
          <View className={styles.introBox} key={v.title}>
            <View className={styles.introTitle}>{v.title}</View>
            <View>{v.content}</View>
          </View>
        ))}
        <View className={styles.introBox}>其中异常的GMs主要包括：</View>
        {intros2.map((v) => (
          <View className={styles.introBox} key={v.title}>
            <View className={styles.introTitle}>{v.title}</View>
            <View>{v.content}</View>
          </View>
        ))}
      </Popup>
      <Popup
        placement="bottom"
        style={{ height: "60%" }}
        onClose={() => setAbnormalVisible(false)}
        open={abnormalVisible}
      >
        <View className={styles.richBox}>
          <RichText nodes={activeTab} />
        </View>
      </Popup>
      <Backdrop open={open} closeable onClose={() => setOpen(false)}>
        <View className={styles.bdContent}>
          <Image
            src={hospital}
            onClick={() => setOpen(true)}
            className={styles.hospital}
          />
          <View className={styles.hospitalDesc}>
            北京儿童医院专业团队在线服务
          </View>
          <View className={styles.hospitalDesc}>有疑问随时咨询</View>
          <View className={styles.hospitalBtn} onClick={() => goto()}>
            预约1对1视频指导
          </View>
        </View>
      </Backdrop>
      {isfushu && (
        <Image
          src={wenyisheng}
          onClick={() => openKefu()}
          className={styles.wenyisheng}
        />
      )}
      <Popup
        placement="bottom"
        style={{ height: "70%" }}
        onClose={() => setShowQr(false)}
        open={showQr}
      >
        <View className={styles.qrBox}>
          <Qrcode url={report.weWorkQrCode}></Qrcode>
        </View>
      </Popup>
    </View>
  );
}

function Info({ data }) {
  return (
    <View>
      <Box
        title={
          <View
            style={{
              position: "relative",
            }}
          >
            <Text>基本信息</Text>
            <View className="linear-gradient"></View>
          </View>
        }
        styles={{ marginTop: 10 }}
      >
        <View className={styles.kvbox}>
          <View className={styles.k}>真实姓名</View>
          <View className={styles.v}>{data.name}</View>
        </View>
        <View className={styles.kvbox}>
          <View className={styles.k}>年龄</View>
          <View className={styles.v}>{data.age}</View>
        </View>
        <View className={styles.kvbox}>
          <View className={styles.k}>性别</View>
          <View className={styles.v}>{data.gender}</View>
        </View>
        <View className={styles.kvbox}>
          <View className={styles.k}>出生体重</View>
          <View className={styles.v}>{data.birthdayWeight}</View>
        </View>
        <View className={styles.kvbox}>
          <View className={styles.k}>出生日期</View>
          <View className={styles.v}>{data.birthday}</View>
        </View>
        <View className={styles.kvbox}>
          <View className={styles.k}>出生孕周</View>
          <View className={styles.v}>{data.gestationalWeek}</View>
        </View>
        <View className={styles.kvbox}>
          <View className={styles.k}>就诊卡号</View>
          <View className={styles.v}>{data.medicalCardNumber}</View>
        </View>
        <View className={styles.kvbox}>
          <View className={styles.k}>检查日期</View>
          <View className={styles.v}>{data.created}</View>
        </View>
      </Box>
    </View>
  );
}
