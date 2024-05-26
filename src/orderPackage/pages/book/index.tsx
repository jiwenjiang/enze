import NavBar from "@/comps/NavBar";
import {
  DanjuTishi,
  EvaluateType,
  MediaType,
  categoryEnum
} from "@/service/const";
import request from "@/service/request";
import upload2Server from "@/service/upload";
import { Base64 } from "@/service/utils";
import tip from "@/static/icons/tip.svg";
import weizhi from "@/static/icons/weizhi.svg";
import nanhai from "@/static/imgs/nanhai.png";
import nvhai from "@/static/imgs/nvhai.png";
import weixuanzhong from "@/static/imgs/weixuanzhong.png";
import xuanzhong from "@/static/imgs/xuanzhong.png";
import { Button, Notify, Popup } from "@taroify/core";
import { Arrow, Clear, Plus } from "@taroify/icons";
import { Image, Text, View } from "@tarojs/components";
import Taro, { navigateTo, useRouter } from "@tarojs/taro";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { cls } from "reactutils";

import PayBtn from "@/comps/PayBtn";
import PriceList from "@/comps/PriceList";
import styles from "./index.module.scss";

const heads = ["日", "一", "二", "三", "四", "五", "六"];
const heads2 = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

export default function App() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [page] = useState({ pageNo: 1, pageSize: 1000 });
  const [days, setDays] = useState<any[]>([]);
  const [childs, setChilds] = useState<any[]>([]);
  const [project, setProject] = useState<any[]>([]);
  const [time, setTime] = useState<any[]>([]);
  const [activeDay, setActiveDay] = useState("");
  const [activeTime, setActiveTime] = useState<any>({});
  const [activeCode, setActiveCode] = useState<any>([]);
  const [org, setOrg] = useState<any>({});
  const [pic, setPic] = useState<any>([]);
  const [activeChild, setActiveChild] = useState<
    NonNullable<{ name: string; id: string }>
  >({ name: "", id: "" });
  const [payMode, setPayMode] = useState<1 | 2 | null>(null);
  const [trainingType, setTrainingType] = useState(1);
  const [priceInfo, setPriceInfo] = useState({ price: "", time: "" });
  const [title, setTitle] = useState("");
  const tempId = useRef<any>();
  const [showImgPreview, setShowImgPreview] = useState(false);
  const [previewedImage, setPreviewedImage] = useState("");
  const [bgImg, setBgImg] = useState({
    type1: "",
    type4: ""
  });
  const [type, setType] = useState(router.params.type!.replace(/[^0-9]/gi, ""));

  const [value, setValue] = useState(false);
  const [remark, setRemark] = useState("");

  const goto = () => {
    Taro.switchTab({ url: "/pages/index/index" });
  };

  const getOrg = async () => {
    const res = await request({ url: "/org/get", hideToast: true });
    setOrg(res.data);
  };

  const getChild = async () => {
    const res = await request({
      url: "/children/list",
      data: page,
      hideToast: true
    });
    setChilds(res.data.children);
    setActiveChild(res.data.children[0]);
  };

  const getTable = async () => {
    const res = await request({ url: "/scaleTable/clinic", hideToast: true });
    setProject(res.data);
    setActiveCode([res.data[0].list[0]]);
  };

  const initDate = async () => {
    const res = await request({
      url: "/workSchedule/getDayCount",
      data: { type },
      hideToast: true
    });
    const startDay = dayjs().day(0);
    const today = dayjs().format("MM.DD");
    const formatToday = dayjs().format("YYYY-MM-DD");
    const res2 = await request({
      url: "/workSchedule/getDay",
      data: {
        day: formatToday,
        type
      }
    });
    setTime(res2.data);
    setActiveTime(res2.data[0]);
    setActiveDay(today);
    let num = -1;
    const ranges = new Array(14).fill(0).map((_v, i) => {
      const day = startDay.add(i, "day").format("MM.DD");
      const formatDay = startDay.add(i, "day").format("YYYY-MM-DD");
      if (day < today) {
        return { day, count: null, inweek: false, formatDay, pre: true };
      }
      if (day === today) {
        num = 0;
      }
      if (num > -1 && num < 7) {
        num++;
        return { day, count: res.data[num - 1].count, inweek: true, formatDay };
      }
      return { day, count: null, inweek: false, formatDay, after: true };
    });
    setDays(ranges);
    setActiveDay(dayjs().format("MM.DD"));
  };

  const changePay = type => {
    console.log("🚀 ~ file: index.tsx:139 ~ changePay ~ type:", type);
    setPayMode(type);
  };

  const changeChild = v => {
    setActiveChild(v);
  };

  const changeProject = c => {
    setActiveCode([c]);
    // if (activeCode.find(v => c.code === v.code)) {
    //   setActiveCode(activeCode.filter(v => v.code !== c.code));
    // } else {
    //   setActiveCode([...activeCode, c]);
    // }
  };

  const changeDay = async v => {
    if (v.inweek) {
      setActiveDay(v.day);
      const res2 = await request({
        url: "/workSchedule/getDay",
        data: { day: v.formatDay, type }
      });
      const avaliTime = res2.data.filter(v => v.availableReserveNumber);
      setTime(avaliTime);
      setActiveTime(avaliTime[0]);
    }
  };

  const changeTime = v => {
    setActiveTime(v);
  };

  const getTime = () => {
    if (activeDay) {
      let i = dayjs(activeDay).day();
      i = i ? i : 7;
      return `${activeDay} (${heads2[i - 1]})，${activeTime?.startTime ?? ""}`;
    }
    return "";
  };

  const getWeekDay = () => {
    if (activeDay) {
      let i = dayjs(activeDay).day();
      i = i ? i : 7;
      return `${heads2[i - 1]}`;
    }
    return "";
  };

  const chooseMedia = () => {
    wx.chooseMedia({
      count: 9,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      maxDuration: 60,
      camera: "back",
      success(res) {
        let num = 0;
        const picList: any = [];
        res.tempFiles.forEach(c => {
          upload2Server(c.tempFilePath, MediaType.PICTURE, v => {
            picList.push(v);
            num++;
            if (num === res.tempFiles.length) {
              setPic([...picList, ...pic]);
            }
          });
        });
      }
    });
  };

  const del = i => {
    const list = pic.filter((_v, i2) => i !== i2);
    setPic(list);
  };

  const complate = async (priceId?: any) => {
    if (!payMode) {
      Notify.open({
        color: "warning",
        message: "请选择支付方式"
      });
      return;
    }
    if (payMode === 1 && (pic.some(v => !v.id) || pic.length === 0)) {
      Notify.open({
        color: "warning",
        message: "请上传票据"
      });
      return;
    }
    // if (activeCode?.length === 0) {
    //   Notify.open({
    //     color: "warning",
    //     message: "请选择评估项目"
    //   });
    //   return;
    // }
    const params = {
      childrenId: activeChild.id,
      invoiceId: pic.map(v => v.id),
      payment: payMode,
      type: Number(type),
      scaleCodes: Number(type) === 1 ? activeCode.map(v => v.code) : null,
      workScheduleId: activeTime.id,
      category: router.params.origin
        ? +router.params.origin
        : categoryEnum.isNormal,
      trainingType,
      priceId
    };
    const res = await request({
      url: "/reserve/unified",
      method: "POST",
      data: params
    });
    console.log("🚀 ~ file: index.tsx:259 ~ complate ~ res:", res);
    if (payMode === 2 && !res.data.hasPaidOrder) {
      setRemark(res.data.remark);
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
        success(res) {
          Notify.open({ color: "success", message: "支付成功" });
          wx.requestSubscribeMessage({
            tmplIds: [
              tempId.current.newReserveNotify,
              tempId.current.scaleResultNotify
            ],
            success(res) {}
          });

          setStep(4);
        }
      });
    } else {
      wx.requestSubscribeMessage({
        tmplIds: [
          tempId.current.newReserveNotify,
          tempId.current.scaleResultNotify
        ],
        success(res) {}
      });

      setStep(4);
    }
    if (payMode === 1 && res.code === 0) {
      wx.requestSubscribeMessage({
        tmplIds: [
          tempId.current.newReserveNotify,
          tempId.current.scaleResultNotify
        ],
        success(res) {}
      });

      setStep(4);
    }
  };

  const toPay = async () => {
    const data = {
      childrenId: activeChild.id,
      workScheduleId: activeTime.id
    };
    const payRes = await request({
      url: "/videoGuide/video/submit",
      method: "POST",
      data
    });
    wx.requestPayment({
      timeStamp: payRes.data.timeStamp,
      nonceStr: payRes.data.nonceStr,
      package: payRes.data.packageValue,
      signType: payRes.data.signType,
      paySign: payRes.data.paySign,
      success(res) {
        Notify.open({ color: "success", message: "支付成功" });
        setStep(4);
      }
    });
  };

  const openMap = () => {
    const latitude = org.latitude;
    const longitude = org.longitude;
    wx.openLocation({
      latitude,
      longitude,
      name: org.name,
      scale: 18
    });
  };

  const getTemp = async () => {
    const res = await request({
      url: "/wx/portal/template"
    });
    tempId.current = res.data;
  };

  useEffect(() => {
    getOrg();
    getChild();
    getTable();
    initDate();
    getTemp();
    if (type === String(EvaluateType.SHIPIN)) {
      request({ url: "/videoGuide/price", hideToast: true }).then(res => {
        setPriceInfo(res.data);
      });
    }
    setTitle(
      {
        "1": "门诊评估",
        "2": "康复指导",
        "4": "视频评估"
      }[type] || "门诊评估"
    );
    if (wx._unLogin) {
      request({ url: "/wx/portal/intro/picture", data: { type } }).then(res => {
        setBgImg({
          ...bgImg,
          [`type${type}`]: res.data.url
        });
      });
    }
  }, []);

  const add = () => {
    const returnUrl = Base64.encode("/orderPackage/pages/book/index?type=1");
    Taro.navigateTo({
      url: `/childPackage/pages/edit?returnUrl=${returnUrl}`
    });
  };

  const checkTime = () => {
    if (!activeTime?.id) {
      Notify.open({
        color: "warning",
        message: "请选择预约时间段"
      });
      return;
    }
    setStep(3);
  };

  const checkChild = () => {
    if (!activeChild?.id) {
      Notify.open({
        color: "warning",
        message: "请选择评估人"
      });
      return;
    }
    setStep(2);
  };

  const previewImage = url => {
    setPreviewedImage(url);
    setShowImgPreview(true);
  };

  const gotoLogin = () => {
    const url = Base64.decode("/orderPackage/pages/book/index?type=1");
    navigateTo({
      url: `/pages/login/index?returnUrl=${url}`
    });
  };

  return (
    <View className={styles.index}>
      <NavBar title={title} />
      {wx._unLogin ? (
        <View>
          <Image
            src={bgImg[`type${type}`]}
            style={{ width: "100vw", height: `calc(100vh - 94px)` }}
          />
          <View className={styles.goto} onClick={() => gotoLogin()}>
            立即前往评估
          </View>
        </View>
      ) : (
        <View className={styles.bottomPart}>
          {step === 1 && (
            <View>
              <View className={styles.title}>
                选择被评估人
                <View className={styles.subTitle} onClick={add}>
                  新增评估人 <Arrow color="#f2b04f" />
                </View>
              </View>
              {childs.map((v, i) => (
                <View
                  style={{ marginTop: i !== 0 ? 8 : 0 }}
                  className={cls(
                    styles.personCard,
                    activeChild.id === v.id && styles.active
                  )}
                  key={i}
                  onClick={() => changeChild(v)}
                >
                  <View className={styles.left}>
                    <Image
                      src={v.gender === "男" ? nanhai : nvhai}
                      className={styles.gender}
                    ></Image>
                    <View className={styles.nameBox}>
                      <View className={styles.name}>{v.name}</View>
                      <View className={styles.date}>{v.birthday}</View>
                    </View>
                  </View>
                  <Image
                    src={activeChild.id === v.id ? xuanzhong : weixuanzhong}
                    className={styles.choose}
                  ></Image>
                </View>
              ))}
              {/* {type == "1" && (
                <View>
                  <View className={styles.title}>选择评估项目</View>
                  <View className={styles.projectBox}>
                    {project.map((v, i) => (
                      <View key={i} style={{ marginTop: i !== 0 ? 16 : 0 }}>
                        <View className={styles.pTitleBox}>
                          <View className={styles.pTitle}>
                            {v.classification}
                          </View>
                        </View>
                        {v.list.map((c, i2) => (
                          <View
                            className={styles.contentBox}
                            key={i2}
                            onClick={() => changeProject(c)}
                          >
                            <View
                              className={cls(
                                styles.cTitle,
                                activeCode.find(v => v.code === c.code) &&
                                  styles.active
                              )}
                            >
                              {c.name}
                            </View>
                            {activeCode.find(v => v.code === c.code) && (
                              <Image
                                src={duigou}
                                className={styles.duigou}
                              ></Image>
                            )}
                          </View>
                        ))}
                      </View>
                    ))}
                  </View>
                </View>
              )} */}

              <View className={styles.nextBtn} onClick={() => checkChild()}>
                下一步
              </View>
            </View>
          )}
          {step === 2 && (
            <View>
              {[EvaluateType.KANGFU_ONLINE, EvaluateType.ZHUANSHU].includes(
                Number(type)
              ) && (
                <View>
                  <View className={styles.title}>选择康复指导方式</View>
                  <Button.Group variant="contained">
                    <Button
                      onClick={() =>
                        setType(String(EvaluateType.KANGFU_ONLINE))
                      }
                      color={
                        Number(type) === EvaluateType.KANGFU_ONLINE
                          ? "primary"
                          : "default"
                      }
                    >
                      线上远程
                    </Button>
                    <Button
                      onClick={() => setType(String(EvaluateType.ZHUANSHU))}
                      color={
                        Number(type) === EvaluateType.ZHUANSHU
                          ? "primary"
                          : "default"
                      }
                    >
                      线下门诊
                    </Button>
                  </Button.Group>
                </View>
              )}
              {[EvaluateType.MENZHEN, EvaluateType.ZHUANSHU].includes(
                Number(type)
              ) && (
                <View>
                  <View className={styles.title}>机构信息</View>
                  <View
                    className={cls(styles.personCard, styles.active)}
                    onClick={openMap}
                  >
                    <View className={styles.left}>
                      <Image src={nanhai} className={styles.gender}></Image>
                      <View className={styles.nameBox}>
                        <View className={styles.name}>{org.name}</View>
                        <View className={styles.date}>{org.address}</View>
                      </View>
                    </View>
                    <Image src={weizhi} className={styles.choose}></Image>
                  </View>
                </View>
              )}

              <View className={styles.title}>查看预约时间</View>
              <View className={styles.riliBox}>
                <View className={styles.riliHeads}>
                  {heads.map((v, i) => (
                    <View key={i} className={styles.head}>
                      {v}
                    </View>
                  ))}
                </View>
                <View className={styles.riliBodys}>
                  {days.map(v => (
                    <View
                      key={v}
                      className={cls(
                        styles.body,
                        activeDay === v.day && styles.activeDay,
                        v.inweek && styles.inweek
                      )}
                      onClick={() => changeDay(v)}
                    >
                      <View>{v.day}</View>
                      {v.inweek && (
                        <View
                          className={cls(
                            styles.count,
                            v.count && styles.hasCount
                          )}
                        >
                          {v.count ? `余${v.count}` : "无剩余"}
                        </View>
                      )}
                      {v.pre && (
                        <View className={cls(styles.count)}>已过时</View>
                      )}
                      {v.after && (
                        <View className={cls(styles.count)}>即将放号</View>
                      )}
                    </View>
                  ))}
                </View>
              </View>
              <View className={styles.title}>
                {activeDay}（{getWeekDay()}）可预约时间
              </View>
              <View className={styles.timeBox}>
                {time.map(v => (
                  <View
                    className={cls(
                      styles.time,
                      activeTime?.id === v.id && styles.activeTime
                    )}
                    onClick={() => changeTime(v)}
                  >
                    <View className={styles.time1}>
                      {v.startTime}-{v.endTime}
                    </View>
                    <View>余{v.availableReserveNumber}</View>
                  </View>
                ))}
              </View>
              <View className={styles.btnBox}>
                <View className={styles.preBtn} onClick={() => setStep(1)}>
                  上一步
                </View>
                <View className={styles.nextBtn} onClick={() => checkTime()}>
                  下一步
                </View>
              </View>
            </View>
          )}
          {step === 3 && (
            <View>
              <View className={styles.title}>确认订单</View>
              <View className={styles.orderBox}>
                <View className={styles.li}>
                  <View className={styles.k}>机构信息</View>
                  <View className={styles.v}>{org?.name}</View>
                </View>
                <View className={styles.li}>
                  <View className={styles.k}>预约时间</View>
                  <View className={styles.v}>{getTime()}</View>
                </View>
                <View className={cls(styles.li, styles.noBorder)}>
                  <View className={styles.k}>被评估人</View>
                  <View className={styles.v}>{activeChild?.name}</View>
                </View>
              </View>

              {router.params.origin === String(categoryEnum.isLingDaoYi) && (
                <View>
                  <View className={styles.payBox}>
                    <View
                      className={cls(
                        styles.payCard,
                        trainingType === 1 && styles.active
                      )}
                      onClick={() => setTrainingType(1)}
                    >
                      <Text>线下</Text>
                      <Image
                        src={trainingType === 1 ? xuanzhong : weixuanzhong}
                        className={styles.choose}
                      ></Image>
                    </View>
                    <View
                      className={cls(
                        styles.payCard,
                        trainingType === 2 && styles.active
                      )}
                      onClick={() => setTrainingType(2)}
                    >
                      <Text>线上</Text>
                      <Image
                        src={trainingType === 2 ? xuanzhong : weixuanzhong}
                        className={styles.choose}
                      ></Image>
                    </View>
                  </View>
                </View>
              )}
              {[EvaluateType.KANGFU_ONLINE, EvaluateType.ZHUANSHU].includes(
                Number(type)
              ) && (
                <View>
                  <View className={cls(styles.orderBox, styles.mt16)}>
                    <View className={cls(styles.li, styles.noBorder)}>
                      <View className={styles.k}>康复方式</View>
                      <View className={styles.v}>
                        {type === String(EvaluateType.ZHUANSHU)
                          ? "线下门诊"
                          : "线上远程"}
                      </View>
                    </View>
                  </View>
                </View>
              )}
              {[EvaluateType.MENZHEN, EvaluateType.ZHUANSHU].includes(
                Number(type)
              ) && (
                <View>
                  <View></View>
                  <PayBtn
                    changePay={changePay}
                    payMode={payMode}
                    code={router.params.code}
                    type={type as any}
                  ></PayBtn>
                  <View className={styles.picBox}>
                    {pic.map((v, i) => (
                      <View style={{ position: "relative" }} key={i}>
                        <Clear
                          className={styles.clear}
                          onClick={e => del(i)}
                          color="#f2b04f"
                        />
                        <Image
                          src={v.url}
                          className={styles.pic}
                          mode="widthFix"
                          onClick={() => previewImage(v.url)}
                        />
                      </View>
                    ))}
                  </View>
                  {payMode === 1 && (
                    <View className={styles.danjuBox}>
                      <Plus className={styles.addIcon} onClick={chooseMedia} />
                      <View>{DanjuTishi}</View>
                    </View>
                  )}
                  {payMode === 2 && (
                    <PriceList
                      value={value}
                      setValue={setValue}
                      buy={complate}
                      code={router.params.code ?? "0"}
                      type={type as any}
                    ></PriceList>
                  )}
                </View>
              )}
              {[EvaluateType.SHIPIN].includes(Number(type)) && (
                <View>
                  <View className={styles.title}>服务介绍</View>
                  <View className={styles.desc}>
                    团队成员来自于北京儿童医院，对需要康复的孩子做1对1视频康复指导，并提供其他增值服务
                  </View>
                </View>
              )}

              {[EvaluateType.SHIPIN].includes(Number(type)) && (
                <View>
                  <View className={styles.title}>服务价格</View>
                  <View className={cls(styles.priceIitem)}>
                    {priceInfo.price}元/{priceInfo.time}分钟
                  </View>
                </View>
              )}

              <View className={styles.btnBox}>
                <View className={styles.preBtn} onClick={() => setStep(2)}>
                  上一步
                </View>
                {type === String(EvaluateType.SHIPIN) ? (
                  <View className={styles.nextBtn} onClick={() => toPay()}>
                    立即预约
                  </View>
                ) : (
                  payMode !== 2 && (
                    <View className={styles.nextBtn} onClick={() => complate()}>
                      完成预约
                    </View>
                  )
                )}
              </View>
            </View>
          )}
          {step === 4 && (
            <View>
              <View className={styles.succBox}>
                <View className={styles.tiphead}>
                  <Image src={tip} className={styles.tip}></Image>
                  温馨提示
                </View>
                {[EvaluateType.MENZHEN].includes(Number(type)) && (
                  <View className={styles.tipBody}>
                    <View className={styles.hasComplate}>已预约完成！</View>
                    {payMode === 1 ? (
                      <View>
                        <View>后台审核单据无误后会短信通知；</View>
                        <View>
                          {/* 院内支付请于{dayjs(activeDay).format("YYYY-MM-DD")}{" "} */}
                          院内支付请于{activeDay} {activeTime?.startTime}
                          前携带收费单据到指定地点。
                        </View>
                        <View>如有问题，请提前电话联系010-56190995</View>
                      </View>
                    ) : (
                      <View>
                        <View>{remark}</View>
                      </View>
                    )}

                    <View className={styles.loc} onClick={openMap}>
                      <View className={styles.left}>
                        <View className={styles.nameBox}>
                          <View className={styles.name}>{org.name}</View>
                          <View className={styles.date}>{org.address}</View>
                        </View>
                      </View>
                      <Image src={weizhi} className={styles.choose}></Image>
                    </View>
                  </View>
                )}
                {[EvaluateType.KANGFU_ONLINE, EvaluateType.ZHUANSHU].includes(
                  Number(type)
                ) && (
                  <View className={styles.tipBody}>
                    <View className={styles.hasComplate}>已预约完成！</View>
                    <View>后台审核单据无误后会短信通知；</View>
                    {/* <View>
                      院内支付请于{activeDay} {activeTime?.startTime}
                      前携带收费单据到指定地点。
                    </View> */}

                    <View>
                      ·线上远程方式：会在工作人员安排时间后通知时间视频时间，请在视频开始前5分钟进入房间
                    </View>
                    <View>
                      ·线下门诊方式：在工作人员安排时间后会通知时间，请按排班时间携带单据到指定地点进行康复。
                    </View>
                    <View className={styles.loc} onClick={openMap}>
                      <View className={styles.left}>
                        <View className={styles.nameBox}>
                          <View className={styles.name}>{org.name}</View>
                          <View className={styles.date}>{org.address}</View>
                        </View>
                      </View>
                      <Image src={weizhi} className={styles.choose}></Image>
                    </View>
                  </View>
                )}
                {[EvaluateType.SHIPIN].includes(Number(type)) && (
                  <View className={styles.tipBody}>
                    <View className={styles.hasComplate}>已预约完成！</View>
                    <View>后台审核单据无误后会短信通知；</View>
                    <View>
                      请在预约时间前10分钟，在【首页】-【预约记录】进入房间
                    </View>
                    <View>如有问题，请提前电话联系010-56190995</View>
                  </View>
                )}
              </View>
              <View className={styles.preBtn} onClick={() => goto()}>
                我知道了
              </View>
            </View>
          )}
          <Notify id="notify" />
        </View>
      )}

      <Popup
        defaultOpen={false}
        open={showImgPreview}
        onClose={() => setShowImgPreview(false)}
      >
        <Popup.Close />
        <Image className={styles.img} src={previewedImage} mode="widthFix" />
      </Popup>
    </View>
  );
}
