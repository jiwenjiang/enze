import request from "@/service/request";
import { Button, Dialog, List, Loading } from "@taroify/core";
import { View } from "@tarojs/components";
import { navigateTo, usePageScroll, useRouter } from "@tarojs/taro";
import React, { useRef, useState } from "react";
import styles from "./growList.module.scss";

export default function App() {
  const router = useRouter();
  const [hasMore, setHasMore] = useState(true);
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const total = useRef(1);
  const params = useRef({
    pageNo: 0,
    pageSize: 10,
    childrenId: router.params.childrenId,
  });
  const isLoading = useRef(false);
  const [loadingText, setLoadingText] = useState("正在加载中");
  const [open, setOpen] = useState(false);
  const currentItem = useRef();

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
      url: "/growth/list",
      data: params.current,
    });
    total.current = res.data?.page?.totalPage;
    if (total.current === params.current.pageNo) {
      setLoadingText("无更多数据了~");
    }
    setData(init ? res.data?.list : [...data, ...res.data?.list]);
    isLoading.current = false;
    setLoading(false);
  };

  const goReport = (item) => {
    navigateTo({
      url: `/minePackage/pages/growDetail?id=${item.id}&childrenId=${router.params.childrenId}`,
    });
  };

  const del = (item) => {
    setOpen(true);
    currentItem.current = item;
  };

  const toDel = async () => {
    const res = await request({
      url: "/growth/list",
      data: params.current,
    });
  };
  return (
    <View className={styles.index}>
      <List
        loading={loading}
        hasMore={hasMore}
        scrollTop={scrollTop}
        onLoad={onLoad}
      >
        {data?.map((item, i) => (
          <View className={styles.box} key={i}>
            <Card
              data={item}
              detail={() =>
                navigateTo({
                  url: `/minePackage/pages/grow?id=${item.id}`,
                })
              }
              report={() => goReport(item)}
              del={() => del(item)}
            ></Card>
          </View>
        ))}
        <List.Placeholder>
          {loading && <Loading>{loadingText}</Loading>}
        </List.Placeholder>
      </List>
      <Dialog open={open} onClose={setOpen}>
        <Dialog.Header>是否确认删除</Dialog.Header>
        <Dialog.Content></Dialog.Content>
        <Dialog.Actions>
          <Button onClick={() => setOpen(false)}>取消</Button>
          <Button onClick={() => toDel()}>确认</Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
}

function Card({ data, report, detail, del }) {
  const toReport = () => {
    report?.(data);
  };

  const toDetail = () => {
    detail?.(data);
  };

  const toDel = () => {
    del?.(data);
  };

  return (
    <View className={styles.cardBox}>
      <View className={styles.card}>
        <View className={styles.kv}>
          <View className={styles.v}>{data?.fillDate}</View>
          <View className={styles.k}>家长填写</View>
        </View>
        <View className={styles.kv}>
          <View className={styles.k}>{data?.dateFromBirth}</View>
        </View>
        <View className={styles.kv}>
          <View className={styles.k}>身高</View>
          <View className={styles.v}>{data?.height}</View>
        </View>
        <View className={styles.kv}>
          <View className={styles.k}>体重</View>
          <View className={styles.v}>{data?.weight}</View>
        </View>
        <View className={styles.kv}>
          <View className={styles.k}>头围</View>
          <View className={styles.v}>{data?.headCircumference}</View>
        </View>
        <View className={styles.btnbox}>
          <View
            className={styles.btn}
            style={{ borderRight: "1px solid #f0f0f0", flex: 2 }}
            onClick={() => toReport()}
          >
            查看生长评估
          </View>
          <View className={styles.btn} onClick={() => toDetail()}>
            编辑
          </View>
          <View className={styles.btn} onClick={() => toDel()}>
            删除
          </View>
        </View>
      </View>
    </View>
  );
}
