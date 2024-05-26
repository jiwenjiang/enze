import { OrderStatus, ScaleTableCode } from "@/service/const";
import { ChildContext } from "@/service/context";
import request from "@/service/request";
import { Base64 } from "@/service/utils";
import { Button, Notify } from "@taroify/core";
import { Text, View } from "@tarojs/components";
import { navigateTo, useDidShow, useRouter } from "@tarojs/taro";
import React, { useContext, useEffect, useState } from "react";
import "./detail.scss";

export default function App() {
  const router = useRouter();
  const [order, setOrder] = useState<any>({});
  const childContext = useContext(ChildContext);

  // 页面加载时调用该方法获取量表订单详情
  const getScaleOrder = () => {
    useEffect(() => {
      (async () => {
        const res = await getAndSetOrderInfo(router.params.id);
      })();
    }, []);
  };

  getScaleOrder();

  const getAndSetOrderInfo = async id => {
    const res = await request({ url: `/order/get?id=${id}` });
    setOrder(res.data);
  };

  // 获取订单状态并为对应文字标签设置对应类名
  const getOrderStatus = v => {
    switch (v.status) {
      case OrderStatus.UNPAID:
        return "status unpaid";
      case OrderStatus.PAID:
        return "status paid";
      case OrderStatus.USED:
        return "status used";
      case OrderStatus.CANCELLED:
        return "status cancelled";
      default:
        return "status unpaid";
    }
  };

  const pay = async id => {
    const payRes = await request({
      url: "/order/pay",
      data: {
        id,
        ip: "127.0.0.1"
      }
    });

    wx.requestPayment({
      timeStamp: payRes.data.timeStamp,
      nonceStr: payRes.data.nonceStr,
      package: payRes.data.packageValue,
      signType: payRes.data.signType,
      paySign: payRes.data.paySign,
      success(res) {
        checkPay();
      }
    });

    const checkPay = async () => {
      const res = await request({
        url: "/order/check",
        data: { scaleTableCode: ScaleTableCode.GMS }
      });
      if (res.data.hasPaidOrder) {
        Notify.open({ color: "success", message: "支付成功" });
        await getAndSetOrderInfo(res.data.orderId);
      } else {
        Notify.open({ color: "danger", message: "支付失败" });
      }
    };
  };

  // 跳转至GMs量表儿童选择页面
  const goChildChoosePage = v => {
    if (childContext.child.len) {
      navigateTo({
        url: `/childPackage/pages/choose?code=${v.scaleTableCode}&orderId=${v.id}`
      });
    } else {
      const returnUrl = Base64.encode(
        `/childPackage/pages/choose?code=${v.scaleTableCode}&orderId=${v.id}`
      );
      navigateTo({
        url: `/childPackage/pages/manage?returnUrl=${returnUrl}`
      });
    }
  };

  // 每次页面显示时获取儿童信息
  useDidShow(() => {
    getChildrenList();
  });

  const getChildrenList = async () => {
    const res = await request({ url: "/children/list" });
    childContext.updateChild({ len: res.data.children.length });
  };

  return (
    <View className="scale-orderinfo-wrapper">
      <View className="pay-info">
        <View className="upper">
          <Text className="name">{order.name}</Text>
          <Text className={getOrderStatus(order)}>{order.statusString}</Text>
        </View>
        <View className="lower">
          <View className="info">
            <Text className="label">总价</Text>
            <Text className="value">¥{order.totalFee}</Text>
          </View>
          <View className="info">
            <Text className="label">实付</Text>
            <Text className="value">¥{order.paidFee}</Text>
          </View>
        </View>
      </View>
      <View className="misc-info">
        <View className="info">
          <Text className="label">订单号</Text>
          <Text className="value">{order.orderNo}</Text>
        </View>
        {(order.status === OrderStatus.PAID ||
          order.status === OrderStatus.USED) && (
          <View className="info">
            <Text className="label">支付时间</Text>
            <Text className="value">{order.paidTime}</Text>
          </View>
        )}
        {order.status === OrderStatus.USED && (
          <View className="info">
            <Text className="label">使用时间</Text>
            <Text className="value">{order.usedTime}</Text>
          </View>
        )}
      </View>
      {order.status === OrderStatus.UNPAID && (
        <View className="action">
          <Button className="btn" onClick={() => pay(order.id)}>
            立即支付
          </Button>
        </View>
      )}
      {order.status === OrderStatus.PAID && (
        <View className="action">
          <Button
            className="btn"
            color="primary"
            onClick={() => goChildChoosePage(order)}
          >
            立即使用
          </Button>
        </View>
      )}
      <Notify id="notify" />
    </View>
  );
}
