import Box from "@/comps/Box";
import ListItem from "@/comps/ListItem";
import NavBar from "@/comps/NavBar";
import Steper from "@/comps/Steper";
import request, { envHost } from "@/service/request";
import { Base64 } from "@/service/utils";
import { Button, Notify } from "@taroify/core";
import { Picker, ScrollView, Text, View } from "@tarojs/components";
import { getStorageSync, navigateTo, useRouter } from "@tarojs/taro";
import React, { CSSProperties, useEffect, useState } from "react";
import { cls } from "reactutils";
import styles from "./sleepv2step.module.scss";

const stepList = [
  { label: "睡眠时间", desc: "" },
  { label: "睡眠行为", desc: "" },
];

const customStyle: CSSProperties = {
  padding: 12,
  backgroundColor: "#fff",
  justifyContent: "space-between",
};
const leftStyle = { width: 200 };

export default function App() {
  const router = useRouter();
  const [data, setData] = useState<any>([]);
  const [active, setActive] = useState(-1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [btnText, setBtnText] = useState("提交答案");
  const [num, setNum] = useState(0);
  const [title] = useState("3-12岁睡眠评估答题");
  const [isReadonly] = useState(router.params.readonly);

  const getList = async () => {
    const res = await request({
      url: "/scaleTable/get",
      data: {
        code: router.params.code ?? 42,
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
        answerSn: null,
      })),
    }));
    if (router.params.id) {
      const res = await request({
        url: "/sleep/assessment/get",
        data: {
          id: router.params.id,
        },
      });
      datas.forEach((v) => {
        v.questions.forEach((x) => {
          const item = res.data.find((c) => c.questionSn === x.sn);
          x.remark = item.remark;
          x.answerSn = item.answerSn;
        });
      });
    }
    setData(datas);
    setActive(0);
  };

  useEffect(() => {
    getList();
  }, []);

  const pre = () => {
    setActive(active - 1);
  };

  const next = () => {
    let valid = true;
    data.forEach((c, i) => {
      c.questions.forEach((m) => {
        if (i === 0 && !m.remark) {
          valid = false;
        }
      });
    });
    if (!valid) {
      Notify.open({ color: "warning", message: "请作答所有题目" });
      return;
    }
    setActive(active + 1);
  };

  const submit = async () => {
    let valid = true;
    data.forEach((c, i) => {
      c.questions.forEach((m) => {
        if (i === 0 && !m.remark) {
          valid = false;
        }
        if (i === 1 && !m.answerSn) {
          valid = false;
        }
      });
    });
    if (!valid) {
      Notify.open({ color: "warning", message: "请作答所有题目" });
      return;
    }
    const answers: any = [];
    data.forEach((c, i) => {
      c.questions.forEach((v, i2) => {
        answers.push({
          answerSn: v.answerSn || [2],
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
    };
    params.orderId = router.params.orderId;
    if (btnText === "上传中") return;
    setBtnText("上传中");
    const res = await request({
      url: "/sleep/assessment/save",
      data: params,
      method: "POST",
    });
    if (res.success) {
      setBtnText("提交答案");

      const url = `${envHost}/sleepv2?token=${getStorageSync(
        "token"
      )}&id=${res.data.id}`;
      navigateTo({
        url: `/pages/other/webView?url=${Base64.encode(url)}`,
      });
    }
  };

  const changeTime = (v, e) => {
    v.remark = e.detail.value;
    setData([...data]);
  };

  const changeAns = (v, c) => {
    if (isReadonly) return;
    v.answerSn = [c.sn];
    setData([...data]);
  };

  return (
    <View className={cls(styles.box, styles.stepIndex)}>
      <NavBar title={title} />
      <View className={styles.stepBox}>
        <Steper
          list={stepList}
          extendStyle={{ paddingBottom: 40 }}
          activeIndex={active}
        ></Steper>
      </View>
      {data[active] && (
        <View style={{ margin: "10px 0px" }}>
          {active === 0 && (
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
                    <Text style={{ zIndex: 2 }}>{data[active].subject}</Text>
                    <View className="linear-gradient"></View>
                  </View>
                }
              >
                <ScrollView scrollY>
                  {data[active].questions?.map((c) => (
                    <View className={styles.ansItem}>
                      <Picker
                        mode="time"
                        value={c.remark}
                        onChange={(e) => changeTime(c, e)}
                        disabled={!!isReadonly}
                      >
                        <ListItem
                          leftStyles={leftStyle}
                          left={c.name}
                          customStyles={customStyle}
                          right={c.remark || (isReadonly ? "" : "请选择")}
                        />
                      </Picker>
                    </View>
                  ))}
                </ScrollView>
              </Box>
            </View>
          )}

          {active === 1 && (
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
                  <Text style={{ zIndex: 2 }}>{data[active].subject}</Text>
                  <View className="linear-gradient"></View>
                </View>
              }
            >
              <ScrollView scrollY style={{ padding: 10 }}>
                {data[active].questions?.map((v, i) => (
                  <View key={i} className={styles.ansItem}>
                    <View className={styles.title}>{v.name}</View>
                    {v.answers?.map((c, i2) => (
                      <View
                        key={i2}
                        className={cls(
                          styles.ansBtn,
                          v.answerSn?.[0] === c.sn && styles.ansBtnActive
                        )}
                        onClick={() => changeAns(v, c)}
                      >
                        {c.content}
                      </View>
                    ))}
                  </View>
                ))}
              </ScrollView>
            </Box>
          )}
          <View>
            {active === data.length - 1 ? (
              <View className={styles.btnbox}>
                {data[active]?.questions?.length > 1 && (
                  <Button className={styles.btnGray} onClick={pre}>
                    上一步
                  </Button>
                )}
                {!isReadonly && (
                  <Button
                    className={styles.btn}
                    onClick={submit}
                    color="primary"
                  >
                    {btnText}
                  </Button>
                )}
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
    </View>
  );
}
