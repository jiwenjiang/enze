import Box from "@/comps/Box";
import request, { envHost } from "@/service/request";
import { Base64 } from "@/service/utils";
import { Button, Dialog, List, Loading } from "@taroify/core";
import { Text, View } from "@tarojs/components";
import Taro, {
  getStorageSync,
  navigateTo,
  usePageScroll,
  useRouter,
} from "@tarojs/taro";
import React, { useRef, useState } from "react";
import { cls } from "reactutils";
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
      url: "/sleep/record/list",
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
      url: `/minePackage/pages/sleepDetail?id=${item.id}&childrenId=${router.params.childrenId}`,
    });
  };

  const toChart = () => {
    const url = `${envHost}/sleep?token=${getStorageSync(
      "token"
    )}&childId=${router.params.childrenId}`;
    navigateTo({
      url: `/pages/other/webView?url=${Base64.encode(url)}`,
    });
  };

  const del = (id) => {
    Taro.showModal({
      title: "提醒",
      content: "确认删除本次记录?",
      async success(res) {
        if (res.confirm) {
          const res = await request({
            url: "/sleep/record/delete",
            data: { id },
          });
          this.getList(true);
        } else if (res.cancel) {
          console.log("用户点击了取消");
          // 在这里可以执行取消后的操作
        }
      },
    });
  };

  const toDel = async () => {};

  return (
    <View className={cls(styles.index, "common-bg")}>
      <List
        loading={loading}
        hasMore={hasMore}
        scrollTop={scrollTop}
        onLoad={onLoad}
      >
        <View className={styles.modeBox}>
          <View className={cls(styles.mode, styles.active)}>列表模式</View>
          <View className={styles.mode} onClick={toChart}>
            曲线模式
          </View>
        </View>
        {data?.map((data, i) => (
          <View className={styles.box} style={{ marginBottom: 0 }} key={i}>
            <Box>
              <View className={styles.kvbox}>
                <View className={styles.k}>记录时间</View>
                <View className={styles.v}>{data?.recordDate}</View>
              </View>
              <View className={styles.kvbox}>
                <View className={styles.k}>早上醒来时间</View>
                <View className={styles.v}>{data?.wakeUpTime}</View>
              </View>
              <View className={styles.kvbox}>
                <View className={styles.k}>晚上入睡时间</View>
                <View className={styles.v}>{data?.sleepTime}</View>
              </View>
              <View className={styles.kvbox}>
                <View className={styles.k}>白天小睡合计</View>
                <View className={styles.v}>
                  {data?.sleepCountDayTime} {data?.sleepCountDayTime && "分钟"}
                </View>
              </View>
              <View className={styles.sleepBtnBox}>
                <View className={styles.btn} onClick={() => del(data?.id)}>
                  删除
                </View>
                <View
                  className={styles.btnPrimary}
                  onClick={() => goReport(data)}
                >
                  编辑
                </View>
              </View>
            </Box>
            {/* <Card
              data={item}
              detail={() =>
                navigateTo({
                  url: `/minePackage/pages/sleep?id=${item.id}`,
                })
              }
              del={() => del()}
            ></Card> */}
          </View>
        ))}
        <List.Placeholder>
          {loading && <Loading>{loadingText}</Loading>}
        </List.Placeholder>
      </List>
      <Dialog open={open} className={styles.delBox} onClose={setOpen}>
        <Dialog.Header>确认删除本次记录</Dialog.Header>
        <Dialog.Content></Dialog.Content>
        <Dialog.Actions>
          <Button onClick={() => setOpen(false)}>取消</Button>
          <Button onClick={() => toDel()}>确认</Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
}

function Card({ data, detail, del }) {
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
          <View className={styles.k}>记录时间</View>
          <View className={styles.v}>{data?.recordDate}</View>
        </View>
        <View className={styles.kv}>
          <View className={styles.k}>早上醒来时间</View>
          <View className={styles.v}>{data?.wakeUpTime}</View>
        </View>
        <View className={styles.kv}>
          <View className={styles.k}>晚上入睡时间</View>
          <View className={styles.v}>{data?.sleepTime}</View>
        </View>
        <View className={styles.kv}>
          <View className={styles.k}>白天小睡合计</View>
          <View className={styles.v}>
            {data?.sleepCountDayTime} {data?.sleepCountDayTime && "分钟"}
          </View>
        </View>
        <View className={styles.btnbox}>
          <View className={styles.btn} onClick={() => toDetail()}>
            编辑
          </View>
          <Text className={styles.vLine}> | </Text>
          <View className={styles.btn} onClick={() => toDel()}>
            删除
          </View>
        </View>
      </View>
    </View>
  );
}
