import { Notify } from "@taroify/core";
import { ScrollView, Text, View } from "@tarojs/components";
import { navigateTo, useRouter } from "@tarojs/taro";
import { useEffect, useRef, useState } from "react";

import Box from "@/comps/Box";
import NavBar from "@/comps/NavBar";
import request from "@/service/request";
import React from "react";
import { cls } from "reactutils";
import styles from "./ability.module.scss";

function shuffleArray(arr) {
  const array = arr.slice(); // 创建原数组的副本
  array.sort(() => Math.random() - 0.5);
  return array;
}

export default function App() {
  const router = useRouter();
  const [data, setData] = useState<{
    name: string;
    subjects: { subject: string; questions: any[] }[];
  }>({ name: "", subjects: [] });
  const [active, setActive] = useState(0);
  const [isReadonly] = useState(router.params.id);
  const isFirst = useRef(true);
  const scrollViewRef = useRef();
  const [screenLeft, setscreenLeft] = useState(0);
  const [height, setScrollTop] = useState(0);
  const [allQues, setAllQues] = useState<any[]>([]);

  const getList = async () => {
    const res = await request({
      url: "/scaleTable/get",
      data: { code: router.params.code },
    });
    let list = [];
    res.data.subjects.forEach((v) => {
      list = list.concat(v.questions);
    });

    setAllQues(shuffleArray(list));

    setData(res.data);
    if (isReadonly && isFirst.current) {
      isFirst.current = false;
      getDetail([...list]);
    }
  };

  const setScrollLeft = (v) => {
    setscreenLeft(screenLeft + v);
    // 假设你的 scroll-view 组件的类名为 'scrollableView'
  };

  const scrollToTop = () => {
    setScrollTop(0);
  };

  const getDetail = async (_data) => {
    const res = await request({
      url: "/learning/ability/get",
      data: { id: router.params.id },
    });
    const sortList = res.data.sort((a, b) => a.questionSn - b.questionSn);

    _data.forEach((v) => {
      v.answerSn = sortList[v.sn - 1].answerSn;
    });

    console.log("🚀 ~ getDetail ~ sortList:", _data);

    setAllQues(_data);
  };

  useEffect(() => {
    getList();
  }, []);

  const next = (i) => {
    if (i > 0) {
      const unValid = data?.subjects?.[active]?.questions.some((e) => {
        return !e.answerSn;
      });
      if (unValid) {
        Notify.open({
          color: "warning",
          message: "请作答所有题目",
        });
        return;
      }
    }
    setActive(active + i);

    setScrollLeft(i * 74);
  };

  useEffect(() => {
    setTimeout(() => {
      scrollToTop();
    }, 100);
  }, [active]);

  const chooseAns = (v, c) => {
    if (isReadonly) return;
    v.answerSn = [c.sn];
    setData({ ...data });
  };

  const save = async () => {
    const unValid = allQues.some((e) => {
      return !e.answerSn;
    });
    if (unValid) {
      Notify.open({
        color: "warning",
        message: "请作答所有题目",
      });
      return;
    }
    const ans: any = [];
    allQues.forEach((c) => {
      ans.push({ questionSn: c.sn, answerSn: c.answerSn || [2] });
    });
    const res = await request({
      url: "/learning/record/save",
      method: "POST",
      data: {
        childrenId: router.params.childId,
        scaleTableCode: router.params.code,
        answers: ans,
        orderId: router.params.orderId,
      },
    });
    navigateTo({
      url: `/evaluatePackage/pages/abilityDetail?id=${res.data.id}&returnUrl=/pages/index/index`,
    });
  };

  return (
    <View>
      <View className={cls(styles.index)}>
        <NavBar title={data.name ?? "评估"} />
        <Notify id="notify" />
        <View className={styles.tipBox}>
          各位家长：这是一份关于儿童学习问题的调查表。请您认真阅读和思考每个问题，并根据过去六个月内孩子的行为，判断他/她在每个项目上表现出的频率，从下面题目中点击进行单选。
        </View>
        <Box>
          <ScrollView
            scrollY
            className={styles.box}
            scrollTop={height}
            id="scollView"
            lowerThreshold={50}
            ref={scrollViewRef}
            onScrollToLower={(e) => {
              setScrollTop(10000);
              console.log("🚀 ~ App ~ scrollTop:", e);
            }}
          >
            {allQues?.map((v, i) => (
              <View key={i} className={styles.ansItem}>
                <View className={styles.title}>
                  <Text className={styles.primaryColor}>{i + 1}</Text>
                  &nbsp;/&nbsp;
                  {allQues?.length}&nbsp;{v.name}
                </View>
                {v.answers?.map((c, i2) => (
                  <View
                    key={i2}
                    className={cls(
                      styles.ansBtn,
                      v.answerSn?.[0] === c.sn && styles.ansBtnActive
                    )}
                    onClick={() => chooseAns(v, c)}
                  >
                    {c.content}
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>
        </Box>
        {!isReadonly && (
          <View className={styles.save}>
            <View className="primary-btn" onClick={save}>
              保存
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
