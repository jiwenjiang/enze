import { List, Loading } from "@taroify/core";
import { Image, View } from "@tarojs/components";
import { navigateTo, usePageScroll } from "@tarojs/taro";
import React, { useRef, useState } from "react";

import { ScaleTableCode, categoryEnum } from "@/service/const";
import request from "@/service/request";

import { cls } from "reactutils";

import BizClinic from "@/static/icons/biz-clinic.svg";
import BizRecovery from "@/static/icons/biz-recovery.svg";
import BizVideo from "@/static/icons/biz-video.svg";
import Child from "@/static/icons/child.svg";
import Confirmed from "@/static/icons/duigou-green.svg";
import Location from "@/static/icons/location.svg";

import styles from "./doc-eva-list.module.scss";

enum BizTypeEnums {
  Clinic = 1,
  Recovery,
  Video = 4,
  Lingdaoyi,
  Xianliti,
}

enum ReserveStatusEnums {
  PENDING = 2,
  REVIEWED = 3,
  CONFIRMED = 4,
  WAITING_START = 5,
  REJECTED = 10,
}

const ReserveStatuses = {
  [ReserveStatusEnums.PENDING]: {
    text: "待审核",
    className: "pending",
  },
  [ReserveStatusEnums.REVIEWED]: {
    text: "审核通过",
    className: "reviewed",
  },
  [ReserveStatusEnums.CONFIRMED]: {
    text: "已确认",
    className: "confirmed",
  },
  [ReserveStatusEnums.WAITING_START]: {
    text: "待开始",
    className: "waitingstart",
  },
  [ReserveStatusEnums.REJECTED]: {
    text: "已驳回",
    className: "rejectd",
  },
};

export default function App() {
  const [hasMore, setHasMore] = useState(true);
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const total = useRef(1);
  const params = useRef({
    pageNo: 0,
    pageSize: 10,
    type: 1,
    patientId: null,
    category: categoryEnum.isNormal,
  });
  const [BizTypes, setBizTypes] = useState([
    {
      id: BizTypeEnums.Clinic,
      name: "门诊评估",
      icon: BizClinic,
      category: categoryEnum.isNormal,
    },
    {
      id: BizTypeEnums.Recovery,
      name: "康复指导",
      icon: BizRecovery,
      category: categoryEnum.isNormal,
    },
    {
      id: BizTypeEnums.Video,
      name: "视频一对一咨询",
      icon: BizVideo,
      category: categoryEnum.isNormal,
    },
  ]);
  const [currBizType, setCurrBizType] = useState(BizTypes[0]);
  const isLoading = useRef(false);
  const [loadingText, setLoadingText] = useState("正在加载中");
  const [pageReady, setPageReady] = useState(false);

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
      url: "/reserve/list",
      data: params.current,
    });
    total.current = res.data?.page?.totalPage;
    if (total.current === params.current.pageNo) {
      setLoadingText("无更多数据了~");
    }
    setData(init ? res.data?.list : [...data, ...res.data?.list]);
    isLoading.current = false;
    setLoading(false);
    !pageReady && setPageReady(true);
  };

  const switchBizType = (item: any) => {
    if (item.id === currBizType.id) {
      return;
    }

    setCurrBizType(item);
    params.current.type = item.id;
    params.current.category = item.category;
    getList(true);
  };

  const goReport = (item) => {
    console.log("🚀 ~ file: recordList.tsx ~ line 47 ~ goReport ~ item", item);
    if (item.scaleTableCode === ScaleTableCode.BRAIN) {
      navigateTo({
        url: `/pages/evaluate/brainDetail?id=${item.id}`,
      });
    }
    if (item.scaleTableCode === ScaleTableCode.GMS) {
      navigateTo({
        url: `/pages/evaluate/gmsDetail?id=${item.id}`,
      });
    }
    if (item.scaleTableCode === ScaleTableCode.BRAIN_GMS) {
      navigateTo({
        url: `/pages/evaluate/brainGmsDetail?id=${item.id}`,
      });
    }
    if (
      item.scaleTableCode === ScaleTableCode.LEIBO_BRAIN ||
      item.scaleTableCode === ScaleTableCode.LEIBO_GMS
    ) {
      navigateTo({
        url: `/evaluatePackage/pages/stepDetail?id=${item.id}`,
      });
    }
  };

  return (
    <View className={styles.index}>
      <View className={styles.bizTypes}>
        {BizTypes.map((item, i) => (
          <View
            key={i}
            className={cls(
              styles.item,
              currBizType.id === item.id && styles.active
            )}
            onClick={() => switchBizType(item)}
          >
            <View className={styles.text}>{item.name}</View>
            <View className={styles.border}></View>
          </View>
        ))}
      </View>
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
                  url: `/pages/evaluate/detail?id=${item.id}`,
                })
              }
              report={() => goReport(item)}
            ></Card>
          </View>
        ))}
        <List.Placeholder>
          {loading && <Loading>{loadingText}</Loading>}
          {!loading && pageReady && data?.length === 0 && (
            <View className={styles.noData}>暂无此类预约记录</View>
          )}
        </List.Placeholder>
      </List>
    </View>
  );
}

function Card({ data, report, detail }) {
  const [BizTypes] = useState([
    {
      id: BizTypeEnums.Clinic,
      name: "门诊评估",
      icon: BizClinic,
      category: categoryEnum.isNormal,
    },
    {
      id: BizTypeEnums.Recovery,
      name: "康复指导",
      icon: BizRecovery,
      category: categoryEnum.isNormal,
    },
    {
      id: BizTypeEnums.Video,
      name: "视频一对一咨询",
      icon: BizVideo,
      category: categoryEnum.isNormal,
    },
  ]);
  const toReport = async (data) => {
    const result = await request({
      url: `/videoGuide/meetingRoom?id=${data.id}`,
    });
    if (result.success && result.data.appId) {
      wx.navigateToMiniProgram({
        appId: result.data.appId,
        path: result.data.path,
      });
    }
    console.log("result: ", result);
  };

  const toDetail = () => {
    detail?.(data);
  };

  const openMap = (data) => {
    const latitude = data.latitude;
    const longitude = data.longitude;
    wx.openLocation({
      latitude,
      longitude,
      name: data.contactAddress,
      scale: 18,
    });
  };

  return (
    <View className={styles.cardBox}>
      <View className={styles.card}>
        <View className={styles.row}>
          <View className={styles.child}>
            <Image className={styles.icon} mode="widthFix" src={Child} />
            <View className={styles.name}>{data?.childrenName}</View>
          </View>
          <View className={styles.status}>
            {data?.reserveStatus === ReserveStatusEnums.PENDING && (
              <View className={styles.pending}>
                {ReserveStatuses[data.reserveStatus].text}
              </View>
            )}
            {data?.reserveStatus === ReserveStatusEnums.REVIEWED && (
              <View className={styles.reviewed}>
                {ReserveStatuses[data.reserveStatus].text}
              </View>
            )}
            {data?.reserveStatus === ReserveStatusEnums.CONFIRMED && (
              <View className={styles.confirmed}>
                <Image
                  className={styles.icon}
                  mode="widthFix"
                  src={Confirmed}
                />
                {ReserveStatuses[data.reserveStatus].text}
              </View>
            )}
            {data?.reserveStatus === ReserveStatusEnums.WAITING_START && (
              <View className={styles.waitingstart}>
                {ReserveStatuses[data.reserveStatus].text}
              </View>
            )}
            {data?.reserveStatus === ReserveStatusEnums.REJECTED && (
              <View className={styles.rejected}>
                {ReserveStatuses[data.reserveStatus].text}
              </View>
            )}
          </View>
        </View>
        <View className={styles.biztype}>
          <Image
            className={styles.icon}
            mode="widthFix"
            src={BizTypes.find((i) => i.id === data.type)?.icon}
          />
          <View className={styles.text}>
            {BizTypes.find((i) => i.id === data.type)?.name}
          </View>
        </View>
        <View className={styles.reserveDetail}>
          <View className={styles.text}>
            <View>预约时间：{data?.reserveTime}</View>
            {data?.type !== BizTypeEnums.Video && (
              <View className={styles.bottom}>
                预约地点：{data?.contactAddress}
              </View>
            )}
          </View>
          <View className={styles.action}>
            {data?.type === BizTypeEnums.Video ? (
              <View className={styles.btn} onClick={() => toReport(data)}>
                进入房间
              </View>
            ) : (
              <View className={styles.location} onClick={() => openMap(data)}>
                <Image className={styles.icon} mode="widthFix" src={Location} />
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
