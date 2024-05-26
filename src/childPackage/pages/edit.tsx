import { useEffect, useState } from "react";

import { Button, Dialog, Notify } from "@taroify/core";
import { Image, Picker, Text, View } from "@tarojs/components";
import {
  getCurrentPages,
  getStorageSync,
  navigateTo,
  useRouter,
} from "@tarojs/taro";

import CheckedIcon from "@/static/icons/checked.svg";

import FieldInput from "@/comps/Field";
import ListItem from "@/comps/ListItem";
import request from "@/service/request";
import dayjs from "dayjs";

import { Base64 } from "@/service/utils";
import { Arrow } from "@taroify/icons";
import Taro from "@tarojs/taro";
import React from "react";
import { cls } from "reactutils";
import styles from "./edit.module.scss";
import "./edit.scss";

const customStyle = { padding: 12, backgroundColor: "#fff" };

export default function App() {
  const router = useRouter();

  const genders = ["男", "女"];
  const paritys = ["头胎", "二胎", "多胎"];
  const asphyxias = ["无", "Apgar评分=1min", "Apgar评分=5min", "不详"];
  const hearingScreenings = ["通过", "未通过", "未筛查", "不详"];
  const feedingWays = ["纯母乳", "混合喂养", "人工"];
  const gestationalWeeks = [
    Array.from({ length: 52 }, (v, i) => i + 1),
    Array.from({ length: 31 }, (v, i) => i),
  ];

  const [allChildRisks, setAllChildRisks] = useState([]);

  const [allMotherRisks, setAllMotherRisks] = useState([]);

  const [name, setName] = useState("");
  const [gender, setGender] = useState(genders[0]);
  const [birthday, setBirthday] = useState(
    dayjs()
      .startOf("year")
      .format("YYYY-MM-DD")
  );
  const [defaultGestationalIndex, setDefaultGestationalIndex] = useState([
    36,
    0,
  ]);
  const [gestationalWeek, setGestationalWeek] = useState(
    gestationalWeeks[0][defaultGestationalIndex[0]]
  );
  const [gestationalWeekDay, setGestationalWeekDay] = useState(
    gestationalWeeks[1][defaultGestationalIndex[1]]
  );
  const [birthdayWeight, setBirthdayWeight] = useState<any>(null);
  const [cardNumber, setCardNumber] = useState(null);
  const [parentContact, setParentContact] = useState("");
  const [childRisks, setChildRisks] = useState<any>([]);
  const [showChildRisksDropdown, setShowChildRisksDropdown] = useState(false);
  const [motherRisks, setMotherRisks] = useState<any>([]);
  const [showMotherRisksDropdown, setShowMotherRisksDropdown] = useState(false);
  const [extraRisks, setExtraRisks] = useState("");
  const [parity, setParity] = useState("头胎");
  const [asphyxia, setAsphyxia] = useState("无");
  const [deformity, setDeformity] = useState("");
  const [hearingScreening, setHearingScreening] = useState("通过");
  const [feedingWay, setFeedingWay] = useState("纯母乳");
  const [openImport, setOpenImport] = useState(false);
  const [importData, setImportData] = useState({
    medicalCardNumber: "",
    name: "",
  });

  const getRisks = async () => {
    const res = await request({
      url: "/risk/get",
      method: "GET",
    });
    setAllChildRisks(res.data.childRisk);
    setAllMotherRisks(res.data.motherRisk);
    // console.log("🚀 ~ file: register.tsx:147 ~ getRisks ~ res:", res)
    // setScaleList(res.data);
  };

  const init = () => {
    // 路由中没有儿童 ID 时，为新增儿童，无需获取儿童信息
    if (!router.params.childId) {
      return;
    }

    // 路由中有儿童 ID 时，为更新儿童，需获取儿童信息
    useEffect(() => {
      (async () => {
        const res = await request({
          url: `/children/get?id=${router.params.childId}`,
        });
        const childInfo = res.data;

        if (!childInfo) {
          return;
        }

        setName(childInfo.name);
        // TODO: setGender 在这里无效，为什么？
        setGender(childInfo.gender);
        setBirthday(childInfo.birthday);
        setGestationalWeek(childInfo.gestationalWeek);
        setGestationalWeekDay(childInfo.gestationalWeekDay);
        setDefaultGestationalIndex([
          gestationalWeeks[0].indexOf(childInfo.gestationalWeek),
          gestationalWeeks[1].indexOf(childInfo.gestationalWeekDay),
        ]);
        setBirthdayWeight(childInfo.birthdayWeight);
        setCardNumber(childInfo.medicalCardNumber);
        setParentContact(childInfo.contactPhone);
        setExtraRisks(childInfo.extraRisks);
        setParity(childInfo.parity);
        setAsphyxia(childInfo.asphyxia);
        setDeformity(childInfo.deformity);
        setHearingScreening(childInfo.hearingScreening);
        setFeedingWay(childInfo.feedingWay);
        childInfo.childRisks && setChildRisks(childInfo.childRisks);
        childInfo.motherRisks && setMotherRisks(childInfo.motherRisks);
      })();
    }, []);
  };

  useEffect(() => {
    const user = getStorageSync("user");
    setParentContact(user?.phone);
    getRisks();
  }, []);

  init();

  const onNameChange = (value) => {
    setName(value);
  };

  const onGenderChange = (e) => {
    setGender(e);
  };

  const onBirthdayChange = (e) => {
    setBirthday(e.detail.value);
  };

  // 由于孕周的 Picker 控件的 value 属性绑定为 defaultGestationalIndex
  // 所以在改变所选择的值时，也需要同步更新 defaultGestationalIndex
  const onGestationalWeekChange = (e) => {
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

  const onBirthdayWeightChange = (value) => {
    setBirthdayWeight(parseInt(value));
  };

  const onCardNumber = (value) => {
    setCardNumber(value);
  };

  const onParentContact = (value) => {
    setParentContact(value);
  };

  const toggleChildRisksDropdown = () => {
    setShowChildRisksDropdown(!showChildRisksDropdown);
  };

  const showChildRisksSummary = () => {
    if (childRisks.filter((item) => !!item).length === 0) {
      return "无";
    }

    return `共${childRisks.filter((item) => !!item).length}项高危因素`;
  };

  const onChildRisksChange = (e, item) => {
    if (childRisks.indexOf(item) > -1) {
      setChildRisks(childRisks.filter((i) => i !== item));
    } else {
      setChildRisks(childRisks.concat(item));
    }
  };

  const toggleMotherRisksDropdown = () => {
    setShowMotherRisksDropdown(!showMotherRisksDropdown);
  };

  const showMotherRisksSummary = () => {
    if (motherRisks.filter((item) => !!item).length === 0) {
      return "无";
    }

    return `共${motherRisks.filter((item) => !!item).length}项高危因素`;
  };

  const onMotherRisksChange = (e, item) => {
    if (motherRisks.indexOf(item) > -1) {
      setMotherRisks(motherRisks.filter((i) => i !== item));
    } else {
      setMotherRisks(motherRisks.concat(item));
    }
  };

  const onFinish = () => {
    if (!router.params.childId) {
      doSave();
    } else {
      doUpdate();
    }
  };

  // 保存新的儿童信息
  const doSave = async () => {
    if (!name.trim() || !birthdayWeight || !parentContact) {
      Notify.open({ color: "danger", message: "请填写所有信息后再保存" });

      return;
    }

    const payload: any = {
      name,
      gender: gender === "男" ? 1 : 2,
      birthday: dayjs(birthday, "YYYY-MM-DD").unix(),
      gestationalWeek,
      gestationalWeekDay,
      birthdayWeight: parseInt(birthdayWeight),
      medicalCardNumber: cardNumber,
      contactPhone: parentContact,
      extraRisks,
      parity,
      asphyxia,
      deformity,
      hearingScreening,
      feedingWay,
    };
    childRisks.length > 0 &&
      (payload.childRisks = childRisks.filter((item) => !!item));
    motherRisks.length > 0 &&
      (payload.motherRisks = motherRisks.filter((item) => !!item));

    const res = await request({
      url: "/children/save",
      method: "POST",
      data: payload,
    });

    if (res.code !== 0) {
      Notify.open({ color: "danger", message: "儿童信息保存失败" });
      return;
    }
    wx.requestSubscribeMessage({
      tmplIds: ["6aCNwae_aK4-EpORezdzZdsCRkUyE6yhPFoffwc2I2I"],
      success(res) {},
    });
    Notify.open({ color: "success", message: "儿童信息保存成功" });

    autoNavigate();
  };

  // 更新当前儿童信息
  const doUpdate = async () => {
    const payload: any = {
      id: router.params.childId,
      name,
      gender: gender === "男" ? 1 : 2,
      birthday: dayjs(birthday, "YYYY-MM-DD").unix(),
      gestationalWeek,
      gestationalWeekDay,
      birthdayWeight: parseInt(birthdayWeight),
      medicalCardNumber: cardNumber,
      contactPhone: parentContact,
      extraRisks,
    };
    childRisks.length > 0 &&
      (payload.childRisks = childRisks.filter((item) => !!item));
    motherRisks.length > 0 &&
      (payload.motherRisks = motherRisks.filter((item) => !!item));

    const res = await request({
      url: "/children/update",
      method: "POST",
      data: payload,
    });

    if (res.code !== 0) {
      Notify.open({ color: "danger", message: "儿童信息更新失败" });
      return;
    }
    Notify.open({ color: "success", message: "儿童信息更新成功" });

    autoNavigate();
  };

  const autoNavigate = () => {
    if (router.params.returnUrl) {
      const url = Base64.decode(router.params.returnUrl);
      navigateTo({ url });
    }
    const pages = getCurrentPages();

    // let backPageIndex = 0;

    // if (pages.some(page => page.route.includes("pages/evaluate/list"))) {
    //   backPageIndex = pages.findIndex(page =>
    //     page.route.includes("childPackage/pages/choose")
    //   );
    // } else {
    //   backPageIndex = pages.findIndex(page =>
    //     page.route.includes("childPackage/pages/manage")
    //   );
    // }
    // navigateBack({
    //   delta: pages.length - backPageIndex - 1
    // });
    if (pages[pages.length - 3]?.route === "pages/evaluate/list") {
      navigateTo({
        url: `/childPackage/pages/choose?code=${router.params.code}`,
      });
    } else {
      navigateTo({ url: "/childPackage/pages/manage" });
    }
  };

  const onOtherRiskChange = (value) => {
    setExtraRisks(value);
  };

  const onTaiciChange = (e) => {
    setParity(paritys[e.detail.value]);
  };

  const onDeformity = (value) => {
    setDeformity(value);
  };

  const onZhixiChange = (e) => {
    setAsphyxia(asphyxias[e.detail.value]);
  };

  const onhearChange = (e) => {
    setHearingScreening(hearingScreenings[e.detail.value]);
  };

  const onFeedChange = (e) => {
    setFeedingWay(feedingWays[e.detail.value]);
  };

  const onImportChange = (v, key) => {
    setImportData({ ...importData, [key]: v });
  };

  const toImport = async () => {
    if (!importData.name || !importData.medicalCardNumber) {
      Notify.open({ color: "danger", message: "请完善导入信息" });
      return;
    }
    Taro.showLoading({
      title: "导入中",
    });
    const res = await request({
      url: "/children/sync",
      data: { ...importData },
    });
    setName(res.data.name);
    setGender(res.data.gender);
    setBirthday(res.data.birthday);
    setParentContact(res.data.contactPhone);
    setCardNumber(res.data.medicalCardNumber);
    setOpenImport(false);
    Taro.hideLoading();

    console.log("🚀 ~ toImport ~ res.data.name:", res.data.name);
    // console.log("🚀 ~ toImport ~ res:", res);
  };

  return (
    <View className="index">
      <Dialog open={openImport} onClose={setOpenImport}>
        <Dialog.Content>
          <View className="row">
            <FieldInput
              label="门诊卡号"
              placeholder="非必填，可导入"
              value={importData.medicalCardNumber}
              onInput={(e: any) =>
                onImportChange(e.target.value, "medicalCardNumber")
              }
            />
          </View>
          <View className="row name">
            <FieldInput
              label="儿童姓名"
              placeholder="请输入姓名"
              value={importData.name}
              onInput={(e: any) => onImportChange(e.target.value, "name")}
            />
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onClick={() => setOpenImport(false)}>取消</Button>
          <Button onClick={() => toImport()}>确认</Button>
        </Dialog.Actions>
      </Dialog>
      <Notify id="notify" />
      <View className={styles.formBox}>
        <View className="row flex-row">
          <FieldInput
            label="门诊卡号"
            placeholder="非必填，可导入"
            value={cardNumber as any}
            labelStyles={{ width: 124 }}
            onInput={(e: any) => onCardNumber(e.target.value)}
          />
          <View
            onClick={() => setOpenImport(true)}
            className={styles.importBtn}
          >
            导入
          </View>
        </View>
        <View className="row">
          <FieldInput
            label="儿童姓名"
            placeholder="请输入姓名"
            value={name}
            labelStyles={{ width: 124 }}
            onInput={(e: any) => onNameChange(e.target.value)}
          />
        </View>
        <View className="row">
          <View className={styles.kv}>
            <View className={styles.k}>性别</View>
            <View className={styles.v}>
              <View
                onClick={() => onGenderChange("男")}
                className={cls(
                  styles.miniBtn,
                  gender === "男" && styles.primaryBtn
                )}
              >
                男
              </View>
              <View
                onClick={() => onGenderChange("女")}
                className={cls(
                  styles.miniBtn,
                  gender === "女" && styles.primaryBtn
                )}
              >
                女
              </View>
            </View>
          </View>
        </View>
        <View className="row">
          <Picker mode="date" value={birthday} onChange={onBirthdayChange}>
            <ListItem
              left="出生日期"
              customStyles={customStyle}
              right={birthday}
            />
          </Picker>
        </View>
        <View className="row">
          <Picker
            mode="multiSelector"
            range={gestationalWeeks}
            value={defaultGestationalIndex}
            onColumnChange={onGestationalWeekChange}
            onChange={() => {}}
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
            labelStyles={{ width: 124 }}
            onInput={(e: any) => onBirthdayWeightChange(e.target.value)}
          />
          <Text className="weight-input">克(g)</Text>
        </View>

        <View className="row">
          <Picker mode="selector" range={paritys} onChange={onTaiciChange}>
            <ListItem left="胎次" customStyles={customStyle} right={parity} />
          </Picker>
        </View>
        <View className="row">
          <Picker mode="selector" range={asphyxias} onChange={onZhixiChange}>
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
            labelStyles={{ width: 124 }}
            onInput={(e: any) => onDeformity(e.target.value)}
          />
        </View>

        <View className="row">
          <Picker
            mode="selector"
            range={hearingScreenings}
            onChange={onhearChange}
          >
            <ListItem
              title="新生儿听力筛查"
              subTitle="(1个月后复查通过也算通过)"
              customStyles={customStyle}
              right={hearingScreening}
            />
          </Picker>
        </View>

        <View className="row">
          <Picker mode="selector" range={feedingWays} onChange={onFeedChange}>
            <ListItem
              left="喂养方式"
              customStyles={customStyle}
              right={feedingWay}
            />
          </Picker>
        </View>

        <View className="row">
          <FieldInput
            label="家长联系方式"
            placeholder="请输入家长联系方式"
            value={parentContact}
            labelStyles={{ width: 124 }}
            onInput={(e: any) => onParentContact(e.target.value)}
          />
        </View>
        <View className="row">
          <View className={styles.kv}>
            <View className={styles.k}>儿童高危因素</View>
            <View className={styles.v} onClick={toggleChildRisksDropdown}>
              <Text>{showChildRisksSummary()}</Text>
              <Arrow color="#C5C8CB" className={styles.mulArrow} />
            </View>
          </View>
        </View>
        <View className="row">
          <View className={styles.kv}>
            <View className={styles.k}>母亲高危因素</View>
            <View className={styles.v} onClick={toggleMotherRisksDropdown}>
              <Text>{showMotherRisksSummary()}</Text>
              <Arrow color="#C5C8CB" className={styles.mulArrow} />
            </View>
          </View>
        </View>
        <View className="row name">
          <FieldInput
            label="其他高危因素"
            placeholder="请输入高危因素"
            value={extraRisks}
            labelStyles={{ width: 124 }}
            onInput={(e: any) => onOtherRiskChange(e.target.value)}
          />
        </View>
      </View>
      <View className="actions">
        <View onClick={() => onFinish()} className="primary-btn">
          保存
        </View>
      </View>
      {showChildRisksDropdown && (
        <View className="mask child-risks">
          <View
            className={`dropdown-items ${!showChildRisksDropdown && "hidden"}`}
          >
            {allChildRisks.map((item, index) => (
              <View
                className="item"
                key={index}
                onClick={(e) => onChildRisksChange(e, item)}
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
              <View
                onClick={() => setShowChildRisksDropdown(false)}
                className="primary-btn"
              >
                确定
              </View>
            </View>
          </View>
        </View>
      )}
      {showMotherRisksDropdown && (
        <View className="mask child-risks">
          <View
            className={`dropdown-items ${!showMotherRisksDropdown && "hidden"}`}
          >
            {allMotherRisks.map((item, index) => (
              <View
                className="item"
                key={index}
                onClick={(e) => onMotherRisksChange(e, item)}
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
              <View
                onClick={() => setShowMotherRisksDropdown(false)}
                className="primary-btn"
              >
                确定
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
