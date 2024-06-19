import zhuanzhuli from "@/static/imgs/zhuanzhuli.png";
import { Notify } from "@taroify/core";
import { Image, Text, View } from "@tarojs/components";
import { navigateTo, useRouter } from "@tarojs/taro";
import { useEffect, useRef, useState } from "react";

import request from "@/service/request";
import React from "react";
import { cls } from "reactutils";
import styles from "./concentration.module.scss";

function splitString(str) {
  let result: any = [];
  let length = str.length;
  let i = 0;

  while (i < length) {
    // 获取当前分组，包含 8 个字符（如果可能）
    let group = str.slice(i, i + 8);

    // 如果不是第一个分组，确保第一个字符和前一个分组的最后一个字符相同
    if (result.length > 0) {
      group = result[result.length - 1].slice(-1) + group.slice(1);
    }

    result.push(group);
    i += 7; // 每次移动7个字符
  }

  return result;
}

export default function App() {
  const router = useRouter();

  const [active, setActive] = useState(0);
  const [isReadonly] = useState(router.params.id);
  const isFirst = useRef(true);
  const [allQues, setAllQues] = useState<any[]>([]);
  const [time, setTime] = useState(420);
  const [activeItem, setActiveItem] = useState({
    row: null,
    col: null,
  });
  const [lines, setLines] = useState<
    { row: number; col: number; type: "down" | "up" }[][]
  >([]);
  const [initLine, setInitLine] = useState(false);

  useEffect(() => {
    let interval = setInterval(() => {
      if (time > 0) {
        setTime(time - 1);
      } else {
        clearInterval(interval);
        // 倒计时结束，执行相关操作
      }
    }, 1000);

    // 组件卸载时清除定时器
    return () => {
      clearInterval(interval);
    };
  }, [time]);

  useEffect(() => {
    if (initLine && isReadonly && isFirst.current) {
      isFirst.current = false;
      getDetail();
    }
  }, [initLine]);

  const getList = async () => {
    const res = await request({
      url: "/scaleTable/get",
      data: { code: router.params.code },
    });

    const list = format(res.data.subjects?.[0]?.questions);
    setLines(list.map((c) => []));

    setAllQues(list);
    setInitLine(true);
  };

  const format = (arr) => {
    arr.forEach((v) => {
      v.list = splitString(v.name);
    });
    return arr;
  };

  const getDetail = async () => {
    const res = await request({
      url: "/learning/concentration/get",
      data: { id: router.params.id },
    });
    console.log("🚀 ~ getDetail ~ sortList:", lines);

    genLines(res.data);

    // setAllQues(_data);
  };

  useEffect(() => {
    getList();
  }, []);

  const next = (i) => {
    // if (i > 0) {
    //   const unValid = data?.subjects?.[active]?.questions.some((e) => {
    //     return !e.answerSn;
    //   });
    //   if (unValid) {
    //     Notify.open({
    //       color: "warning",
    //       message: "请作答所有题目",
    //     });
    //     return;
    //   }
    // }
    console.log("🚀 ~ transformReq ~ allQues:", allQues, lines);

    setActive(active + 1);
  };
  const pre = () => {
    setActive(active - 1);
  };

  const genLines = (arr) => {
    arr.forEach((v, index) => {
      const list: any = JSON.parse(v.remark);
      list
        ?.map((c) => {
          const row = Math.floor(c / 7);
          const col = c % 7;
          return { row, col };
        })
        ?.forEach((s) => {
          const preItem = lines[index].find(
            (c) => c.row === s.row && c.col === s.col - 1
          );

          lines[index].push({
            row: s.row,
            col: s.col,
            type: preItem?.type === "up" ? "down" : "up",
          });
          setLines([...lines]);
        });
    });
  };

  const chooseItem = (row, col) => {
    if (isReadonly) return;
    // 是否存在active
    if (activeItem.col || activeItem.col === 0) {
      // 同行
      if (activeItem.row === row) {
        if (Math.abs(col - activeItem.col) === 1) {
          // 是否存在线

          const startCol = Math.min(col, activeItem.col);
          const item = lines[active].find(
            (c) => c.row === row && c.col === startCol
          );
          if (item) {
            lines[active] = lines[active].filter(
              (c) => c.row !== row || c.col !== startCol
            );
            setLines(lines);
            setActiveItem({
              row: null,
              col: null,
            });
          } else {
            // 前一点是否有线
            const preItem = lines[active].find(
              (c) => c.row === row && c.col === startCol - 1
            );

            lines[active].push({
              row,
              col: startCol,
              type: preItem?.type === "up" ? "down" : "up",
            });
            setLines([...lines]);
            setActiveItem({
              row: null,
              col: null,
            });
          }
        } else {
          setActiveItem({ row, col });
        }
      } else {
        setActiveItem({ row, col });
      }
    } else {
      setActiveItem({ row, col });
    }
  };

  const calcIndex = (v) => {
    return v.row * 7 + v.col;
  };

  const transformReq = () => {
    let ans: any = [];
    allQues.forEach((v, i) => {
      const remark = lines[i]?.map((c) => calcIndex(c));
      console.log("🚀 ~ allQues.forEach ~ remark:", remark);
      v.remark = remark ? JSON.stringify(remark) : "";
      v.questionSn = v.sn;
    });
    ans = [...allQues];
    return ans;
    console.log("🚀 ~ transformReq ~ allQues:", allQues, lines);
  };

  const save = async () => {
    const answers = transformReq();
    let params: any = {
      childrenId: router.params.childId,
      scaleTableCode: router.params.code ?? 9,
      answers,
    };
    params.orderId = router.params.orderId;

    const res = await request({
      url: "/learning/record/save",
      data: params,
      method: "POST",
    });
    if (res.success) {
      navigateTo({
        url: `/evaluatePackage/pages/concentrationDetail?id=${res.data.id}&returnUrl=/pages/index/index`,
      });
    }
  };

  const hasLine = (row, col) => {
    const item = lines[active]?.find((c) => c.row === row && c.col === col);
    return item;
  };

  return (
    <View>
      <View className={cls(styles.index)}>
        <Notify id="notify" />
        <View>
          <View className={styles.introTitle}>七分钟专注力测试</View>
          <View className={styles.introDesc}>
            在以下数字组中，每组数字都有一些两两相邻、其和为10的成对的数，集中注意力找出这些数，并在点击两个相邻的数字(有可能1个数字和前后两个数字的和都为10)，最后相邻数字画成线，如下图所示。测试时间:7分钟。
          </View>
        </View>
        <Image
          className={styles.cardImg}
          src={zhuanzhuli}
          style={{ height: 160, marginTop: 10 }}
          mode="widthFix"
        ></Image>
        <View className={styles.ansBox}>
          <View className={styles.ansItem}>
            <View className={styles.title}>
              <Text className={styles.primaryColor}>
                {active + 1}/{allQues.length}
              </Text>
              <View>
                {!isReadonly && (
                  <Text className={styles.time}>
                    {Math.floor(time / 60) < 10
                      ? `0${Math.floor(time / 60)}`
                      : Math.floor(time / 60)}
                    :{time % 60 < 10 ? `0${time % 60}` : time % 60}
                  </Text>
                )}
              </View>
            </View>
            {allQues?.[active]?.list?.map((c, i1) => (
              <View key={i1} className={cls(styles.row)}>
                {c.split("")?.map((c2, i2) => (
                  <View
                    className={cls(
                      styles.num,
                      activeItem.row === i1 &&
                        activeItem.col === i2 &&
                        styles.activeItem
                    )}
                    onClick={() => chooseItem(i1, i2)}
                  >
                    {c2}
                    {hasLine(i1, i2) && (
                      <View
                        className={cls(
                          styles.line,
                          styles[hasLine(i1, i2)!.type]
                        )}
                      ></View>
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>

        <View className={styles.save}>
          {active === allQues.length - 1 ? (
            !isReadonly ? (
              <View className="primary-btn" onClick={save}>
                提交
              </View>
            ) : (
              <View className="primary-btn" onClick={pre}>
                上一组
              </View>
            )
          ) : active === 0 ? (
            <View className="primary-btn" onClick={next}>
              下一组
            </View>
          ) : (
            <View className={styles.btnBox}>
              <View className="primary-btn" onClick={pre}>
                上一组
              </View>
              <View className="primary-btn" onClick={next}>
                下一组
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
