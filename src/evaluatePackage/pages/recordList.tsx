import Box from "@/comps/Box";
import { ScaleTableCode, categoryEnum } from "@/service/const";
import request from "@/service/request";
import { List, Loading } from "@taroify/core";
import { Text, View } from "@tarojs/components";
import { navigateTo, usePageScroll, useRouter } from "@tarojs/taro";
import React, { useEffect, useRef, useState } from "react";
import { cls } from "reactutils";
import styles from "./recordList.module.scss";

export default function App() {
  const router = useRouter();
  const [hasMore, setHasMore] = useState(true);
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const total = useRef(1);
  const [initFlag, setInitFlag] = useState(false);
  const params = useRef({
    pageNo: 0,
    pageSize: 10,
    patientId: null,
    category: router.params.origin
      ? +router.params.origin
      : categoryEnum.isNormal,
  });
  const isLoading = useRef(false);
  const [loadingText, setLoadingText] = useState("正在加载中");

  usePageScroll(({ scrollTop: aScrollTop }) => setScrollTop(aScrollTop));

  const onLoad = () => {
    if (total.current > params.current.pageNo && !isLoading.current) {
      setLoading(true);
      isLoading.current = true;
      params.current.pageNo++;
      getList();
    } else {
      setHasMore(false);
    }
  };

  const getList = async (init?: boolean) => {
    const res = await request({
      url: "/scaleRecord/list",
      data: params.current,
    });
    setInitFlag(true);
    total.current = res.data?.page?.totalPage;
    if (total.current === params.current.pageNo) {
      setLoadingText("无更多数据了~");
    }
    setData(init ? res.data?.records : [...data, ...res.data?.records]);
    // setData([]);
    isLoading.current = false;
    setLoading(false);
  };

  const goReport = (item) => {
    if (item.scaleTableCode === ScaleTableCode.BRAIN) {
      navigateTo({
        url: `/pages/evaluate/brainDetail?id=${item.id}`,
      });
      return;
    }
    if (item.scaleTableCode === ScaleTableCode.GMS) {
      navigateTo({
        url: `/pages/evaluate/gmsDetail?id=${item.id}`,
      });
      return;
    }
    if (item.scaleTableCode === ScaleTableCode.BRAIN_GMS) {
      navigateTo({
        url: `/pages/evaluate/brainGmsDetail?id=${item.id}`,
      });
      return;
    }
    if (
      item.scaleTableCode === ScaleTableCode.LEIBO_BRAIN ||
      item.scaleTableCode === ScaleTableCode.LEIBO_GMS
    ) {
      navigateTo({
        url: `/evaluatePackage/pages/stepDetail?id=${item.id}`,
      });
      return;
    }
    if (
      [ScaleTableCode.Griffiths, ScaleTableCode.Product88].includes(
        item.scaleTableCode
      )
    ) {
      navigateTo({
        url: `/pages/evaluate/previewReport?id=${item.id}&name=${item.scaleName}`,
      });
      return;
    }
    navigateTo({
      url: `/pages/evaluate/previewReport?id=${item.id}&name=${item.scaleName}`,
    });
  };

  useEffect(() => {}, []);

  return (
    <View className={cls(styles.index, "common-bg")}>
      {initFlag && data?.length === 0 && (
        <View className={styles.pingguBox}>
          <View>您还没有提交评估记录</View>
          <View
            className={styles.btn}
            onClick={() => {
              navigateTo({
                url: `/pages/evaluate/list`,
              });
            }}
          >
            开始评估
          </View>
        </View>
      )}
      <List
        loading={loading}
        hasMore={hasMore}
        scrollTop={scrollTop}
        onLoad={onLoad}
      >
        {data?.map((data, i) => (
          <View key={i}>
            <Box
              title={
                <View
                  style={{
                    position: "relative",
                  }}
                >
                  <Text>{data.scaleName}</Text>
                  <View className="linear-gradient"></View>
                </View>
              }
              styles={{ marginTop: 10 }}
            >
              <View className={styles.box}>
                <View className={styles.kv}>
                  <View className={styles.k}>评估类型</View>
                  <View className={styles.v}>
                    {data?.reserveType === 1 ? "门诊评估" : "智能评估"}
                  </View>
                </View>
                <View className={styles.kv}>
                  <View className={styles.k}>自测时间</View>
                  <View className={styles.v}>{data?.time}</View>
                </View>
                <View className={styles.line}></View>
                <View className={styles.btnbox}>
                  {data?.reserveType !== 1 && (
                    <View
                      className={styles.btn}
                      onClick={() =>
                        navigateTo({
                          url: `/pages/evaluate/detail?id=${data.id}`,
                        })
                      }
                    >
                      量表详情
                    </View>
                  )}
                  <View
                    className={cls(styles.btn, styles.priBtn)}
                    onClick={() => goReport(data)}
                  >
                    查看报告
                  </View>
                </View>
              </View>
            </Box>
            {/* <Card
              data={item}
              detail={() =>
                navigateTo({
                  url: `/pages/evaluate/detail?id=${item.id}`,
                })
              }
              report={() => goReport(item)}
            ></Card> */}
          </View>
        ))}
        <List.Placeholder>
          {loading && <Loading>{loadingText}</Loading>}
        </List.Placeholder>
      </List>
    </View>
  );
}

function Card({ data, report, detail }) {
  const toReport = () => {
    report?.(data);
  };

  const toDetail = () => {
    detail?.(data);
  };

  return (
    <View className={styles.cardBox}>
      <View className={styles.card}>
        <View className={styles.scaleName}>{data?.scaleName}</View>
        <View className={styles.kv}>
          <View className={styles.k}>评估类型</View>
          <View className={styles.v}>
            {data?.reserveType === 1 ? "门诊评估" : "智能评估"}
          </View>
        </View>
        <View className={styles.kv}>
          <View className={styles.k}>自测时间</View>
          <View className={styles.v}>{data?.time}</View>
        </View>
      </View>
    </View>
  );
}
