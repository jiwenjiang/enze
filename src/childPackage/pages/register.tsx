import { useEffect, useRef, useState } from "react";

import { Button, Dialog, Notify, Popup } from "@taroify/core";
import { Image, Picker, Text, View } from "@tarojs/components";
import { getStorageSync, navigateTo, useRouter } from "@tarojs/taro";

import CheckedIcon from "@/static/icons/checked.svg";
import DropdownIcon from "@/static/icons/dropdown.svg";

import FieldInput from "@/comps/Field";
import ListItem from "@/comps/ListItem";
import request from "@/service/request";
import dayjs from "dayjs";

import { MediaType } from "@/service/const";
import { useChannel } from "@/service/hook";
import upload2Server from "@/service/upload";
import { Base64 } from "@/service/utils";
import noticeIcon from "@/static/icons/notice.svg";
import { Picker as Pickerfy } from "@taroify/core";
import { Clear, Plus } from "@taroify/icons";
import React from "react";
import "./edit.scss";
import styles from "./register.module.scss";

const customStyle = { padding: 12, backgroundColor: "#fff" };

export default function App() {
  useChannel();
  const router = useRouter();

  const genders = ["男", "女"];
  const paritys = ["头胎", "二胎", "多胎"];
  const asphyxias = ["无", "Apgar评分=1min", "Apgar评分=5min", "不详"];
  const hearingScreenings = ["通过", "未通过", "未筛查", "不详"];
  const feedingWays = ["纯母乳", "混合喂养", "人工"];
  const gestationalWeeks = [
    Array.from({ length: 52 }, (v, i) => i + 1),
    Array.from({ length: 31 }, (v, i) => i)
  ];
  const [allChildRisks,setAllChildRisks]=useState([])
  // const allChildRisks: any = [
  //   "胎龄不足37周或超过42周",
  //   "出生体重在2500g以下",
  //   "胎儿的兄弟姊妹有严重新生儿病史",
  //   "产时感染",
  //   "胎儿宫内窘迫",
  //   "胎儿宫内发育迟缓",
  //   "缺血缺氧性脑病",
  //   "颅内出血",
  //   "新生儿肺炎",
  //   "寒冷损伤",
  //   "新生儿黄疸",
  //   "高危产妇所生的新生儿",
  //   "手术产儿、难产、急产、产程过 长、分娩过程使用镇静剂等"
  // ];
  const [allMotherRisks,setAllMotherRisks]=useState([])
  // const allMotherRisks = [
  //   "年龄：年龄＜18岁或＞35岁",
  //   "孕产史:有异常孕产史者，如流产、早产、死胎、死产、各种难产及手术产、新生儿死亡、新生儿溶血性黄疸、先天缺陷或遗传性疾病;",
  //   "孕早期先兆流产",
  //   "贫血",
  //   "孕期出血，如前置胎盘、胎盘早剥",
  //   "妊娠高血压综合征",
  //   "妊娠合并内科疾病，如心脏病、肾炎、病毒性肝炎、重度贫血、病毒感染(巨细胞病毒、疱疹病毒、风疹病毒)等",
  //   "妊娠期接触有害物质，如放射线、同位素、农药、化学毒物、 CO中毒及服用对胎儿有害药物",
  //   "母儿血型不合",
  //   "早产或过期妊娠",
  //   "胎盘及脐带异常:胎盘发育不良、前置胎盘、胎盘早剥，脐带过短、脐带扭曲等",
  //   "胎位异常",
  //   "产道异常(包括骨产道及软产道)",
  //   "多胎妊娠",
  //   "羊水过多、过少、羊水早破、羊水污染等",
  //   "多年不育经治疗受孕者",
  //   "曾患或现有生殖器官肿瘤者等"
  // ];

  const [name, setName] = useState("");
  const [childName, setChildName] = useState("");
  const [gender, setGender] = useState(genders[0]);
  const [birthday, setBirthday] = useState(
    dayjs()
      .startOf("year")
      .format("YYYY-MM-DD")
  );
  const [defaultGestationalIndex, setDefaultGestationalIndex] = useState([
    36,
    0
  ]);
  const [gestationalWeek, setGestationalWeek] = useState<any>(
    gestationalWeeks[0][defaultGestationalIndex[0]]
  );
  const [gestationalWeekDay, setGestationalWeekDay] = useState(
    gestationalWeeks[1][defaultGestationalIndex[1]]
  );
  const [birthdayWeight, setBirthdayWeight] = useState<any>(null);
  const [cardNumber, setCardNumber] = useState<any>(null);
  const [parentContact, setParentContact] = useState("");
  const [extraRisks, setExtraRisks] = useState("");
  const [parity, setParity] = useState("头胎");
  const [asphyxia, setAsphyxia] = useState("无");
  const [deformity, setDeformity] = useState("");
  const [hearingScreening, setHearingScreening] = useState("通过");
  const [feedingWay, setFeedingWay] = useState("纯母乳");
  const [childRisks, setChildRisks] = useState<any>([]);
  const [showChildRisksDropdown, setShowChildRisksDropdown] = useState(false);
  const [motherRisks, setMotherRisks] = useState<any>([]);
  const [showMotherRisksDropdown, setShowMotherRisksDropdown] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [scaleList, setScaleList] = useState<{ name: string; code: number }[]>(
    []
  );
  const [scaleTableCode, setScaleTableCode] = useState(null);
  const [pic, setPic] = useState<any>([]);
  const [showImgPreview, setShowImgPreview] = useState(false);
  const [previewedImage, setPreviewedImage] = useState("");
  const tempId = useRef<any>();
  const [isSucc, setIsSucc] = useState(false);

  const getTemp = async () => {
    const res = await request({
      url: "/wx/portal/template"
    });
    tempId.current = res.data;
  };

  const init = () => {
    // 路由中没有儿童 ID 时，为新增儿童，无需获取儿童信息
    if (!router.params.childId) {
      return;
    }
  };

  const getScaleList = async () => {
    const res = await request({
      url: "/scaleTable/list",
      method: "GET"
    });
    setScaleList(res.data);
  };

  const getRisks = async () => {
    const res = await request({
      url: "/risk/get",
      method: "GET"
    });
    setAllChildRisks(res.data.childRisk)
    setAllMotherRisks(res.data.motherRisk)
    // console.log("🚀 ~ file: register.tsx:147 ~ getRisks ~ res:", res)
    // setScaleList(res.data);
  };

  useEffect(() => {
    const user = getStorageSync("user");
    setParentContact(user?.phone);
    getScaleList();
    getTemp();
    getRisks()
  }, []);

  init();

  const onNameChange = value => {
    setName(value);
  };

  const onChildNameChange = value => {
    setChildName(value);
  };

  const onGenderChange = e => {
    setGender(genders[e.detail.value]);
  };

  const onBirthdayChange = e => {
    setBirthday(e.detail.value);
  };

  // 由于孕周的 Picker 控件的 value 属性绑定为 defaultGestationalIndex
  // 所以在改变所选择的值时，也需要同步更新 defaultGestationalIndex
  const onGestationalWeekChange = e => {
    if (e.detail.column === 0) {
      setDefaultGestationalIndex(
        defaultGestationalIndex.splice(0, 0, e.detail.value)
      );
      setGestationalWeek(gestationalWeeks[0][e.detail.value]);
    } else if (e.detail.column === 1) {
      setDefaultGestationalIndex(
        defaultGestationalIndex.splice(1, 0, e.detail.value)
      );
      setGestationalWeekDay(gestationalWeeks[1][e.detail.value]);
    }
  };

  const onBirthdayWeightChange = value => {
    setBirthdayWeight(parseInt(value));
  };

  const onCardNumber = value => {
    setCardNumber(value);
  };

  const onParentContact = value => {
    setParentContact(value);
  };

  const onOtherRiskChange = value => {
    setExtraRisks(value);
  };

  const onTaiciChange = e => {
    setParity(paritys[e.detail.value]);
  };

  const onDeformity = value => {
    setDeformity(value);
  };

  const onZhixiChange = e => {
    setAsphyxia(asphyxias[e.detail.value]);
  };

  const onhearChange = e => {
    setHearingScreening(hearingScreenings[e.detail.value]);
  };

  const onFeedChange = e => {
    setFeedingWay(feedingWays[e.detail.value]);
  };

  const toggleChildRisksDropdown = () => {
    setShowChildRisksDropdown(!showChildRisksDropdown);
  };

  const showChildRisksSummary = () => {
    if (childRisks.filter(item => !!item).length === 0) {
      return "无";
    }

    return `共${childRisks.filter(item => !!item).length}项高危因素`;
  };

  const onChildRisksChange = (e, item) => {
    if (childRisks.indexOf(item) > -1) {
      setChildRisks(childRisks.filter(i => i !== item));
    } else {
      setChildRisks(childRisks.concat(item));
    }
  };

  const toggleMotherRisksDropdown = () => {
    setShowMotherRisksDropdown(!showMotherRisksDropdown);
  };

  const showMotherRisksSummary = () => {
    if (motherRisks.filter(item => !!item).length === 0) {
      return "无";
    }

    return `共${motherRisks.filter(item => !!item).length}项高危因素`;
  };

  const onMotherRisksChange = (e, item) => {
    if (motherRisks.indexOf(item) > -1) {
      setMotherRisks(motherRisks.filter(i => i !== item));
    } else {
      setMotherRisks(motherRisks.concat(item));
    }
  };

  const onFinish = () => {
    doSave();
  };

  // 保存新的儿童信息
  const doSave = async () => {
    if (!name.trim() || !birthdayWeight || !parentContact || !scaleTableCode) {
      Notify.open({ color: "danger", message: "请填写所有信息后再保存" });

      return;
    }

    if (pic.length === 0) {
      Notify.open({ color: "danger", message: "收费单据必传" });

      return;
    }

    // if (birthdayWeight <= 2500 || birthdayWeight >= 4500) {
    //   validTizhong();
    //   return;
    // }

    // if (gestationalWeek < 35) {
    //   validYunzhou();
    //   return;
    // }

    const payload = {
      name,
      gender: gender === "男" ? 1 : 2,
      birthday: dayjs(birthday, "YYYY-MM-DD").unix(),
      gestationalWeek,
      gestationalWeekDay,
      birthdayWeight: parseInt(birthdayWeight),
      medicalCardNumber: cardNumber,
      contactPhone: parentContact,
      childRisks: [],
      motherRisks: [],
      scaleTableCode,
      childName,
      invoiceId: pic.map(v => v.id),
      extraRisks,
      parity,
      asphyxia,
      deformity,
      hearingScreening,
      feedingWay
    };
    childRisks.length > 0 &&
      (payload.childRisks = childRisks.filter(item => !!item));
    motherRisks.length > 0 &&
      (payload.motherRisks = motherRisks.filter(item => !!item));

    const res = await request({
      url: "/reserve/scanCode/submit",
      method: "POST",
      data: payload
    });

    if (res.code !== 0) {
      Notify.open({ color: "danger", message: "信息登记保存失败" });
      return;
    }

    wx.requestSubscribeMessage({
      tmplIds: [
        tempId.current.newReserveNotify,
        tempId.current.scaleResultNotify
      ],
      success(res) {}
    });

    Notify.open({ color: "success", message: "信息登记保存成功" });
    setIsSucc(true);
    // autoNavigate();
  };

  const autoNavigate = () => {
    if (router.params.returnUrl) {
      const url = Base64.decode(router.params.returnUrl);
      navigateTo({ url });
      return;
    }
    navigateTo({ url: "/pages/index" });
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
            console.log("🚀 ~ file: register.tsx:307 ~ success ~ v:", v);
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

  const previewImage = url => {
    setPreviewedImage(url);
    setShowImgPreview(true);
  };

  const validTizhong = () => {
    if (birthdayWeight >= 4500 || birthdayWeight <= 2500) {
      setOpen2(true);
    }
  };

  const validYunzhou = () => {
    if (gestationalWeek < 35) {
      setOpen(true);
    }
  };

  const revertYunzhou = () => {
    setGestationalWeek(0);
    setOpen(false);
  };

  const revertTizhong = () => {
    setBirthdayWeight("");
    setOpen2(false);
  };

  return (
    <View className="index">
      <Notify id="notify" />
      {isSucc ? (
        <View>
          <View className={styles.cardBox}>
            <View className={styles.card}>
              <View className={styles.title}>
                <Image src={noticeIcon} className={styles.imgIcon} />
                &nbsp; 温馨提示
              </View>
              <View className={styles.noEvaluete}>
                <View> 登记信息成功！</View>
                <View>收费审核无误后将由相关工作人员采集儿童相关视频</View>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View>
          <View className="register-box">
            <View className="row name">
              <FieldInput
                label="家长姓名"
                placeholder="请输入姓名"
                value={name}
                onInput={(e: any) => onNameChange(e.target.value)}
              />
            </View>

            <View className="row name">
              <FieldInput
                label="儿童姓名"
                placeholder="请输入姓名"
                value={childName}
                onInput={(e: any) => onChildNameChange(e.target.value)}
              />
            </View>
            <View className="row gender">
              <Picker mode="selector" range={genders} onChange={onGenderChange}>
                <ListItem
                  left="性别"
                  customStyles={customStyle}
                  right={gender}
                />
              </Picker>
            </View>
            <View className="row birthday">
              <Picker mode="date" value={birthday} onChange={onBirthdayChange}>
                <ListItem
                  left="出生日期"
                  customStyles={customStyle}
                  right={birthday}
                />
              </Picker>
            </View>
            <View className="row gestational-week">
              <Picker
                mode="multiSelector"
                range={gestationalWeeks}
                value={defaultGestationalIndex}
                onColumnChange={onGestationalWeekChange}
                onChange={() => validYunzhou()}
              >
                <ListItem
                  left="孕周"
                  customStyles={customStyle}
                  right={`${gestationalWeek} 周 ${gestationalWeekDay} 天`}
                />
              </Picker>
            </View>
            <View className="row">
              <FieldInput
                label="出生体重"
                placeholder="请输入体重"
                value={birthdayWeight}
                onInput={(e: any) => onBirthdayWeightChange(e.target.value)}
                onBlur={() => validTizhong()}
              />
              <Text className="weight-input">克(g)</Text>
            </View>
            <View className="row gender">
              <Picker mode="selector" range={paritys} onChange={onTaiciChange}>
                <ListItem
                  left="胎次"
                  customStyles={customStyle}
                  right={parity}
                />
              </Picker>
            </View>
            <View className="row gender">
              <Picker
                mode="selector"
                range={asphyxias}
                onChange={onZhixiChange}
              >
                <ListItem
                  left="新生儿窒息情况"
                  customStyles={customStyle}
                  right={asphyxia}
                />
              </Picker>
            </View>
            <View className="row">
              <FieldInput
                label="出生时有无畸形"
                placeholder="无则不填，有则填写具体畸形情况"
                value={deformity}
                onInput={(e: any) => onDeformity(e.target.value)}
              />
            </View>

            <View className="row gender">
              <Picker
                mode="selector"
                range={hearingScreenings}
                onChange={onhearChange}
              >
                <ListItem
                  title="新生儿听力筛查"
                  subTitle="（1个月后复查通过也算通过）"
                  customStyles={customStyle}
                  right={hearingScreening}
                />
              </Picker>
            </View>

            <View className="row gender">
              <Picker
                mode="selector"
                range={feedingWays}
                onChange={onFeedChange}
              >
                <ListItem
                  left="喂养方式"
                  customStyles={customStyle}
                  right={feedingWay}
                />
              </Picker>
            </View>

            <View className="row">
              <FieldInput
                label="就诊卡号"
                placeholder="请输入就诊卡号，非必填"
                value={deformity}
                onInput={(e: any) => onCardNumber(e.target.value)}
              />
            </View>
            <View className="row">
              <FieldInput
                label="家长联系方式"
                placeholder="请输入家长联系方式"
                value={parentContact}
                onInput={(e: any) => onParentContact(e.target.value)}
              />
            </View>
            <View className="row child-risks">
              <View className="risks">
                <View className="row-inside" onClick={toggleChildRisksDropdown}>
                  <Text>儿童高危因素</Text>
                  <View className="dropdown">
                    <View className="dropdown-text">
                      {showChildRisksSummary()}
                    </View>
                    <Image src={DropdownIcon} className="dropdown-icon" />
                  </View>
                </View>
              </View>
            </View>
            <View className="row mother-risks">
              <View className="risks">
                <View
                  className="row-inside"
                  onClick={toggleMotherRisksDropdown}
                >
                  <Text>母亲高危因素</Text>
                  <View className="dropdown">
                    <View className="dropdown-text">
                      {showMotherRisksSummary()}
                    </View>
                    <Image src={DropdownIcon} className="dropdown-icon" />
                  </View>
                </View>
              </View>
            </View>
            <View className="row name">
              <FieldInput
                label="其他高危因素"
                placeholder="请输入高危因素"
                value={extraRisks}
                onInput={(e: any) => onOtherRiskChange(e.target.value)}
              />
            </View>
            <View className="row mother-risks">
              <View className="risks">
                <View
                  className="row-inside"
                  onClick={() => setOpenPicker(true)}
                >
                  <Text>评估量表</Text>
                  <View className="dropdown">
                    <View className="dropdown-text">
                      {scaleList.find(v => v.code === scaleTableCode)?.name}
                    </View>
                    <Image src={DropdownIcon} className="dropdown-icon" />
                  </View>
                </View>
              </View>
            </View>

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
            <View className={styles.danjuBox}>
              <Plus className={styles.addIcon} onClick={chooseMedia} />
              <View>请上传您的收费单据</View>
            </View>
          </View>
          <View className="actions">
            <Button onClick={() => onFinish()} className="confirm">
              保存
            </Button>
          </View>
          {showChildRisksDropdown && (
            <View className="mask child-risks">
              <View
                className={`dropdown-items ${!showChildRisksDropdown &&
                  "hidden"}`}
              >
                {allChildRisks.map((item, index) => (
                  <View
                    className="item"
                    key={index}
                    onClick={e => onChildRisksChange(e, item)}
                  >
                    <View className="icon-wrapper">
                      <Image
                        src={CheckedIcon}
                        className={`checked-icon ${childRisks.includes(item) &&
                          "checked"}`}
                      />
                    </View>
                    <View
                      className={`item-text ${childRisks.includes(item) &&
                        "checked"}`}
                    >
                      {item}
                    </View>
                  </View>
                ))}
                <View className="actions">
                  <Button
                    onClick={() => setShowChildRisksDropdown(false)}
                    className="confirm"
                  >
                    确定
                  </Button>
                </View>
              </View>
            </View>
          )}
          {showMotherRisksDropdown && (
            <View className="mask child-risks">
              <View
                className={`dropdown-items ${!showMotherRisksDropdown &&
                  "hidden"}`}
              >
                {allMotherRisks.map((item, index) => (
                  <View
                    className="item"
                    key={index}
                    onClick={e => onMotherRisksChange(e, item)}
                  >
                    <View className="icon-wrapper">
                      <Image
                        src={CheckedIcon}
                        className={`checked-icon ${motherRisks.includes(item) &&
                          "checked"}`}
                      />
                    </View>
                    <View
                      className={`item-text ${motherRisks.includes(item) &&
                        "checked"}`}
                    >
                      {item}
                    </View>
                  </View>
                ))}
                <View className="actions">
                  <Button
                    onClick={() => setShowMotherRisksDropdown(false)}
                    className="confirm"
                  >
                    确定
                  </Button>
                </View>
              </View>
            </View>
          )}
          <Popup
            open={openPicker}
            rounded
            placement="bottom"
            onClose={setOpenPicker}
          >
            <Popup.Backdrop />
            <Pickerfy
              onCancel={() => setOpenPicker(false)}
              onConfirm={values => {
                setScaleTableCode(values[0]);
                setOpenPicker(false);
              }}
            >
              <Pickerfy.Toolbar>
                <Pickerfy.Button>取消</Pickerfy.Button>
                <Pickerfy.Title>评估量表</Pickerfy.Title>
                <Pickerfy.Button>确认</Pickerfy.Button>
              </Pickerfy.Toolbar>
              <Pickerfy.Column>
                {scaleList.map((v, i) => (
                  <Pickerfy.Option key={i} value={v.code}>
                    {v.name}
                  </Pickerfy.Option>
                ))}
              </Pickerfy.Column>
            </Pickerfy>
          </Popup>
          <Popup
            defaultOpen={false}
            open={showImgPreview}
            onClose={() => setShowImgPreview(false)}
          >
            <Popup.Close />
            <Image
              className={styles.img}
              src={previewedImage}
              mode="widthFix"
            />
          </Popup>
        </View>
      )}
      <Dialog open={open} className="valid-box" onClose={() => setOpen(false)}>
        <Dialog.Header>温馨提醒</Dialog.Header>
        <Dialog.Content>请再次确认孕周</Dialog.Content>
        <Dialog.Actions>
          <Button onClick={() => revertYunzhou()}>取消</Button>
          <Button onClick={() => setOpen(false)}>确认无误</Button>
        </Dialog.Actions>
      </Dialog>
      <Dialog
        open={open2}
        className="valid-box"
        onClose={() => setOpen2(false)}
      >
        <Dialog.Header>温馨提醒</Dialog.Header>
        <Dialog.Content>请再次确认体重</Dialog.Content>
        <Dialog.Actions>
          <Button onClick={() => revertTizhong()}>取消</Button>
          <Button onClick={() => setOpen2(false)}>确认无误</Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
}
