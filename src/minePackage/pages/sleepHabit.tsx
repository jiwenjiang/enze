import Box from "@/comps/Box";
import FieldInput from "@/comps/Field";
import request from "@/service/request";
import CheckedIcon from "@/static/icons/checked.svg";
import DropdownIcon from "@/static/icons/dropdown.svg";
import { Notify, Slider } from "@taroify/core";
import Button from "@taroify/core/button/button";
import { Image, View } from "@tarojs/components";
import { navigateTo, useRouter } from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import { cls } from "reactutils";
import styles from "./info.module.scss";
import styles2 from "./sleepHabit.module.scss";
import "./sleepHabit.scss";

export default function App() {
  const [answers, setAnswers] = useState<any>([]);
  const router = useRouter();
  const [openPicker, setOpenPicker] = useState(false);

  const initAns = (data) => {
    data.forEach((v) => {
      if (v.type === 1 && v.options?.[0]?.next?.type === 3) {
        v.showNextContent = true;
      }
    });
    return data;
  };
  const getQuns = async () => {
    const res = await request({
      url: "/sleep/habits/question/get",
      method: "GET",
    });
    const d = initAns(res.data.map((v) => ({ ...v, sn: 1 })));
    setAnswers(d);
    getAns(d);
  };

  const getAns = async (ans) => {
    const res = await request({
      url: "/sleep/habits/answer/get",
      method: "GET",
      data: {
        childrenId: router.params.childrenId,
      },
    });
    res.data?.forEach((v, i) => {
      if (ans[i].type === 1) {
        ans[i].answerSn = v?.options?.[0]?.optionSn;
        if (
          ans[i]?.options?.find((m) => m.sn === v?.options?.[0]?.optionSn)?.next
            ?.type === 3
        ) {
          ans[i].showNextContent = true;
          ans[i].inputContent = v?.options?.[0]?.content;
        }
        if (v?.options?.[0]?.next?.length > 0) {
          ans[i].showMultPicker = true;
          // ans[i].options.forEach()
          ans[i].options[v?.options?.[0]?.optionSn - 1]?.next?.options?.forEach(
            (c) => {
              if (v?.options?.[0]?.next?.find((s) => s.content === c.content)) {
                c.checked = true;
              }
            }
          );
        }
        if (
          ans[i].answerSn &&
          ans[i]?.options?.find((c) => c.sn === ans[i].answerSn)?.next?.type ===
            2
        ) {
          ans[i].showMultPicker = true;
        }
      }
      if (ans[i].type === 2) {
        ans[i].answerSn = v?.options?.map((c) => c.optionSn);
      }
      if (ans[i].type === 3) {
        ans[i].inputContent = v?.content;
      }
      if (ans[i].type === 4) {
        ans[i].answerSn = v?.options?.[0]?.optionSn;
      }
    });
    setAnswers([...ans]);
    console.log("🚀 ~ getAns ~ [...ans]:", [...ans]);
    // setAnswers(res.data.map((v) => ({ ...v, sn: 1 })));
    // console.log("🚀 ~ file: sleepHabit.tsx:19 ~ getAns ~ res:", res);
  };

  useEffect(() => {
    getQuns();
    // getAns();
  }, []);

  const save = async () => {
    const params = buildData();
    if (params.every((v) => v.options)) {
      const res = await request({
        url: "/sleep/habits/answer/save",
        method: "POST",
        data: {
          answers: params,
          childrenId: router.params.childrenId,
        },
      });
      if (res.code === 0) {
        Notify.open({
          color: "success",
          message: "保存成功",
        });
        navigateTo({
          url: `/minePackage/pages/sleep`,
        });
      }
    } else {
      Notify.open({
        color: "warning",
        message: "请填写信息",
      });
    }
  };

  const buildData = () => {
    const ans = answers.map((v) => {
      if (v.type === 1) {
        const item = v.options.find((c) => c.sn === v.answerSn);
        if (item) {
          const optionItem = {
            optionSn: item.sn,
            content: item.next?.type === 3 ? v.inputContent : "",
            next:
              item.next?.type === 2
                ? item.next?.options?.filter((c) => c.checked)
                : [],
          };
          return { sn: v.sn, options: [optionItem] };
        } else {
          return { sn: v.sn, options: null };
        }
      }
      if (v.type === 2) {
        return { sn: v.sn, options: v.answerSn?.map((c) => ({ optionSn: c })) };
      }
      if (v.type === 3) {
        return { sn: v.sn, content: v.inputContent };
      }
      if (v.type === 4) {
        const item = v.options.find((c) => c.sn === v.answerSn);
        if (item) {
          const optionItem = {
            optionSn: item.sn,
            content: "",
            next: [],
          };
          return { sn: v.sn, options: [optionItem] };
        } else {
          return { sn: v.sn, options: null };
        }
      }
    });
    console.log("🚀 ~ buildData ~ ans:", ans);

    return ans;
  };

  // 1 单选 3填空
  const changeVal = (e, q, m) => {
    console.log("🚀 ~ changeVal ~ e:", e, q, m);
    q[m] = e;
    if (q.type === 1) {
      q.showNextContent = false;
      q.showMultPicker = false;
      const item = q.options.find((c) => c.sn === e);
      if (item.next?.type === 3) {
        q.showNextContent = true;
      }
      if (item.next?.type === 2) {
        q.showMultPicker = true;
        // setPickerList(item.next?.options);
        console.log("🚀 ~ changeVal ~ item.next?.options:", item.next?.options);
      }
    }
    setAnswers([...answers]);
    // setData([...data]);
  };

  const changeMulVal = (e, q, m) => {
    if (!q[m]) {
      q[m] = [];
    }
    if (q[m]?.includes(e)) {
      q[m] = q[m].filter((v) => v !== e);
    } else {
      q[m] = [...q[m], e];
    }
    setAnswers([...answers]);
    // setData([...data]);
  };

  const inputVal = (a, b) => {
    b.inputContent = a;
    setAnswers([...answers]);
  };

  const onPickerChange = (c, item) => {
    item.checked = !!!item.checked;
    setAnswers([...answers]);
    console.log(c, item);
  };

  const calcPickerText = (item) => {
    let list = item.options?.filter((v, i) => v.checked).map((c) => c.content);
    console.log("🚀 ~ calcPickerText ~ list.join(", "):", list.join(","));

    return list.join(",") || "请选择";
  };

  const isChecked = (item) => {
    return item.checked;
  };

  const sliderChange = (e, v) => {
    console.log("🚀 ~ sliderChange ~ e:", e);
    v.answerSn = e;
    setAnswers([...answers]);
  };

  return (
    <View className={styles.index}>
      <Notify id="notify" />
      <View className={styles2.habitBox}>
        <Box styles={{ padding: 12 }}>
          {answers.map((v, i) => (
            <View key={i}>
              {v.type === 1 && (
                <View>
                  <View className={styles2.title}>{v.name}</View>
                  <View>
                    <View className={styles2.checkItemBox}>
                      {answers[i].options.map((c) => (
                        <View
                          key={c.sn}
                          onClick={(e) =>
                            changeVal(c.sn, answers[i], "answerSn")
                          }
                          className={cls(
                            styles2.checkItem,
                            answers[i].answerSn === c.sn && styles2.activeItem
                          )}
                        >
                          <View>{c.content}</View>
                        </View>
                      ))}
                    </View>
                    {v.showNextContent && (
                      <FieldInput
                        label=""
                        placeholder="请输入"
                        value={answers[i].inputContent}
                        onInput={(e: any) => inputVal(e.target.value, v)}
                        rootStyles={{
                          padding: "6px 12px",
                          backgroundColor: "#F7F7F7",
                          borderRadius: "14px",
                          height: "42px",
                        }}
                        labelStyles={{ color: "#333" }}
                      />
                    )}
                    {v.showMultPicker && (
                      <View className="risks">
                        <View
                          className="row-inside"
                          onClick={() => setOpenPicker(true)}
                        >
                          <View className="dropdown">
                            <View className="dropdown-text">
                              {calcPickerText(
                                answers[i]?.options?.[answers[i].answerSn - 1]
                                  ?.next
                              )}
                            </View>
                            <Image
                              src={DropdownIcon}
                              className="dropdown-icon"
                            />
                          </View>
                        </View>
                        {openPicker && (
                          <View className="mask">
                            <View className={`dropdown-items`}>
                              {answers[i]?.options?.[
                                answers[i].answerSn - 1
                              ]?.next?.options?.map((item, index) => (
                                <View
                                  className="item"
                                  key={index}
                                  onClick={(e) =>
                                    onPickerChange(
                                      answers?.options?.[
                                        answers[i].answerSn - 1
                                      ],
                                      item
                                    )
                                  }
                                >
                                  <View className="icon-wrapper">
                                    <Image
                                      src={CheckedIcon}
                                      className={`checked-icon ${isChecked(
                                        item
                                      ) && "checked"}`}
                                    />
                                  </View>
                                  <View
                                    className={`item-text ${isChecked(item) &&
                                      "checked"}`}
                                  >
                                    {item.content}
                                  </View>
                                </View>
                              ))}
                              <View className="actions">
                                <Button
                                  onClick={() => setOpenPicker(false)}
                                  className="confirm"
                                >
                                  确定
                                </Button>
                              </View>
                            </View>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                  {/* <Radio.Group
                    value={answers[i].answerSn}
                    onChange={(e) => changeVal(e, answers[i], "answerSn")}
                  >
                    {answers[i].options.map((c) => (
                      <View key={c.sn} className={styles2.radioRow}>
                        <Radio name={c.sn} key={c.sn}>
                          <View>{c.content}</View>
                        </Radio>
                        {v.showNextContent && answers[i].answerSn === c.sn && (
                          <FieldInput
                            label=""
                            placeholder="请输入"
                            value={answers[i].inputContent}
                            onInput={(e: any) => inputVal(e.target.value, v)}
                            rootStyles={{
                              padding: "6px 12px",
                              paddingTop: 0,
                              borderBottom: "1px solid #666",
                              height: "30px",
                            }}
                            labelStyles={{ color: "#333" }}
                          />
                        )}
                        {v.showMultPicker && answers[i].answerSn === c.sn && (
                          <View className="risks">
                            <View
                              className="row-inside"
                              onClick={() => setOpenPicker(true)}
                            >
                              <Text>请选择</Text>
                              <View className="dropdown">
                                <View className="dropdown-text">
                                  {calcPickerText(c.next)}
                                </View>
                                <Image
                                  src={DropdownIcon}
                                  className="dropdown-icon"
                                />
                              </View>
                            </View>
                            {openPicker && (
                              <View className="mask">
                                <View className={`dropdown-items`}>
                                  {c.next?.options?.map((item, index) => (
                                    <View
                                      className="item"
                                      key={index}
                                      onClick={(e) => onPickerChange(c, item)}
                                    >
                                      <View className="icon-wrapper">
                                        <Image
                                          src={CheckedIcon}
                                          className={`checked-icon ${isChecked(
                                            item
                                          ) && "checked"}`}
                                        />
                                      </View>
                                      <View
                                        className={`item-text ${isChecked(
                                          item
                                        ) && "checked"}`}
                                      >
                                        {item.content}
                                      </View>
                                    </View>
                                  ))}
                                  <View className="actions">
                                    <Button
                                      onClick={() => setOpenPicker(false)}
                                      className="confirm"
                                    >
                                      确定
                                    </Button>
                                  </View>
                                </View>
                              </View>
                            )}
                          </View>
                        )}
                      </View>
                    ))}
                  </Radio.Group> */}
                </View>
              )}
              {v.type === 2 && (
                <View>
                  <View className={styles2.title}>{v.name}</View>
                  <View>
                    <View className={styles2.checkItemBox}>
                      {answers[i].options.map((c) => (
                        <View
                          key={c.sn}
                          onClick={(e) =>
                            changeMulVal(c.sn, answers[i], "answerSn")
                          }
                          className={cls(
                            styles2.checkItem,
                            answers[i].answerSn?.includes(c.sn) &&
                              styles2.activeItem
                          )}
                        >
                          <View>{c.content}</View>
                        </View>
                      ))}
                    </View>
                  </View>
                  {/* <Checkbox.Group
                    value={answers[i].answerSn ?? []}
                    onChange={(e) => changeVal(e, answers[i], "answerSn")}
                  >
                    {answers[i].options.map((c) => (
                      <View key={c.sn} className={styles2.radioRow}>
                        <Checkbox shape="square" name={c.sn} key={c.sn}>
                          <View>{c.content}</View>
                        </Checkbox>
                      </View>
                    ))}
                  </Checkbox.Group> */}
                </View>
              )}
              {v.type === 3 && (
                <View>
                  <View className={styles2.title}>{v.name}</View>
                  <FieldInput
                    label=""
                    placeholder="请输入"
                    value={answers[i].inputContent}
                    onInput={(e: any) => inputVal(e.target.value, v)}
                    rootStyles={{
                      padding: "6px 12px",
                      backgroundColor: "#F7F7F7",
                      borderRadius: "14px",
                      height: "42px",
                    }}
                    labelStyles={{ color: "#333" }}
                  />
                </View>
              )}
              {v.type === 4 && (
                <View>
                  <View className={styles2.title}>{v.name}</View>
                  <View className={styles2.slider}>
                    <View className={styles2.sliderContent}>
                      {v.options?.[0]?.content}
                    </View>
                    <Slider
                      className="custom-color"
                      value={v.answerSn}
                      onChange={(e) => sliderChange(e, v)}
                      max={v.options?.[v.options?.length - 1]?.score}
                    >
                      <Slider.Thumb>
                        <View className="custom-thumb">{v.answerSn}</View>
                      </Slider.Thumb>
                    </Slider>
                    <View className={styles2.sliderContent}>
                      {v.options?.[v.options?.length - 1]?.content}
                    </View>
                  </View>
                </View>
              )}
            </View>
          ))}
        </Box>
      </View>
      {answers?.length > 0 && (
        <View className={styles.btnBox}>
          <View className="primary-btn" onClick={save}>
            保存
          </View>
        </View>
      )}
    </View>
  );
}
