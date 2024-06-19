import Box from "@/comps/Box";
import { EvaluateType } from "@/service/const";
import request from "@/service/request";
import { Button, Checkbox, Notify, Popup } from "@taroify/core";
import { Text, View } from "@tarojs/components";
import React, { useEffect, useState } from "react";
import { cls } from "reactutils";
import "./index.scss";

export default function PriceList({
  buy,
  value,
  setValue,
  code,
  type,
}: {
  buy: (id: number) => void;
  value: boolean | undefined;
  setValue: (checked: boolean) => void;
  code: String | undefined;
  type: EvaluateType;
}) {
  const [open, setOpen] = useState(false);
  const [priceList, setPrice] = useState<
    NonNullable<
      {
        availableTimes: number;
        listPrice: string;
        salePrice: string;
        id: number;
      }[]
    >
  >([]);
  const [currentPrice, setCurrentPrice] = useState(0);

  useEffect(() => {
    (async () => {
      const res = await request({
        url: "/scaleTable/price",
        data: { code: code ?? 0, type },
      });
      setPrice(res.data);
    })();
  }, []);

  const preBuy = () => {
    if (!value) {
      Notify.open({
        color: "warning",
        message: "请同意购买服务条款",
      });
      return;
    }
    buy(priceList[currentPrice].id);
  };

  return (
    <View style={{ paddingBottom: 20 }} className="price-list">
      <Box styles={{ marginTop: 10 }}>
        <View className="desc">
          <View className="price-box">
            {priceList?.map((v, i) => (
              <View
                key={i}
                className={cls(
                  "price-item",
                  currentPrice === i && "price-item-active"
                )}
                onClick={() => setCurrentPrice(i)}
              >
                <View className="price-item-number">
                  <View>{v.availableTimes}次</View>
                </View>
                <View className="price-item-salePrice">{v.salePrice}元</View>
              </View>
            ))}
          </View>
          <View className="sub-desc">
            *量表筛查为一次性消费产品，一旦购买概不退换
          </View>
        </View>
      </Box>
      <View className="agreement">
        <Checkbox checked={value} onChange={setValue} size={18}>
          <View className="read">我已阅读并同意 </View>
        </Checkbox>
        <Text className="buy" onClick={() => setOpen(true)}>
          《购买服务条款》
        </Text>
      </View>
      <Popup
        defaultOpen
        placement="bottom"
        style={{ height: "100%" }}
        open={open}
        onClose={() => setOpen(false)}
      >
        <Popup.Close />
        <View className="WordSection1">
          <View className="title">服务条款总则</View>

          <View className="MsoNormal">
            <Text>1</Text>、任何使用<Text>0-1</Text>
            岁儿童发育风险评服务的用户均应仔细阅读本服务条款，用户使用本服务的行为将被视为对服务条款全部内容的认可并接受。
          </View>

          <View className="MsoNormal">
            <Text>2</Text>、、<Text>0-1</Text>
            岁儿童发育风险评估是一项综合性的评估服务。它融合了多项儿童神经发育评估工具，包括
            <Text>0~1</Text>岁<Text>52</Text>
            项神经运动检查（简化<Text>20</Text>项神经运动检查）、
            <Text>Vojta</Text>七项姿势反射检查，以及全身运动（
            <Text>GMs</Text>
            ）自发姿势检查等，并利用脑科学领域最前沿的计算神经行为学分析方法。这项服务的核心目标在于早期识别那些在神经发育上稍显迟缓或异常的宝宝，以便为他们提供及时的干预和帮助。本服务的自评报告仅供参考，不能作为医疗诊断和治疗的直接依据。
          </View>

          <View className="MsoNormal">
            <Text>3</Text>、<Text>0-1</Text>
            岁儿童发育风险评估只是儿童吃发育健康咨询领域的一种初步方法，不能仅仅依靠评估结果判断小婴儿的脑发育状况，需要结合线下临床的全面诊断与评估。
          </View>

          <View className="MsoNormal">
            <Text>4</Text>
            、随着宝宝出生后发育长大，相隔数周的多次评估能够更为清晰的了解宝宝脑发育的情况及其变化。
          </View>

          <View className="MsoNormal">
            <Text>5</Text>、评估费用一旦支付将不予退回。。
          </View>

          <View className="MsoNormal">
            <Text>6</Text>
            、我们将在必要时修改服务条款，如果家长用户继续使用本服务提供的服务，则被视为接受服务条款变动。我们保留修改服务条款的权利，不需知照家长用户或第三方。
          </View>

          <View className="MsoNormal">
            <Text className="subTitle">免责声明</Text>
          </View>

          <View className="MsoNormal">
            <Text>1</Text>、家长用户应该理解
            <Text>GMs</Text>
            自评不属于医疗看诊，无法代替医生面诊，因此
            <Text>GMs</Text>
            自评报告仅供参考，具体诊疗请一定要到医院由相关医生完成
            <Text>;</Text>
          </View>

          <View className="MsoNormal">
            <Text>2</Text>
            、、我们不承担因家长用户自身过错、网络状况、通讯线路等任何技术原因或其他不可控原因而导致不能正常进行
            <Text>GMs</Text>
            自评以及因此引起的损失，亦不承担任何相关法律责任
          </View>

          <View className="MsoNormal">
            <Text className="subTitle">其他说明</Text>
          </View>

          <View className="MsoNormal">
            <Text>1</Text>
            、家长客户应提供真实、正确的信息资料并耐心完成评估。
          </View>

          <View className="MsoNormal">
            <Text>2</Text>
            、用户名登录密码和支付密码只允许家长用户使用，不得将登录密码和支付密码公开或提供给第三方，家长用户将对用户名、登录密码和支付密码的安全负有全部责任。另外，每个家长用户都要对以其用户名进行的所有活动和事件负全责。
          </View>

          <View className="MsoNormal">
            <Text>3</Text>
            、其他说明详见《服务协议的法律声明及隐私权政策》。
          </View>
        </View>
      </Popup>
      <Button
        onClick={() => preBuy()}
        style={{ marginTop: 13 }}
        color="primary"
        className="buy-btn"
      >
        立即购买
      </Button>
      <Notify id="notify" />
    </View>
  );
}
