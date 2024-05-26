import { ChildContext } from "@/service/context";
import request from "@/service/request";
import { Base64 } from "@/service/utils";
import Female from "@/static/icons/female.svg";
import Male from "@/static/icons/male.svg";
import Qiehuan from "@/static/icons/qiehuan.svg";
import Nanhai from "@/static/imgs/nanhai.png";
import Nvhai from "@/static/imgs/nvhai.png";
import Weixuanzhong from "@/static/imgs/weixuanzhong.png";
import Xuanzhong from "@/static/imgs/xuanzhong.png";
import { Button, Popup } from "@taroify/core";
import { Image, Text, View } from "@tarojs/components";
import Taro, { navigateTo } from "@tarojs/taro";
import React, { useContext, useEffect, useState } from "react";
import styles from "./index.module.scss";

export default function ChooseChild({
  change,
  returnUrl,
}: {
  change?: Function;
  returnUrl?: string;
}) {
  const [page, setPage] = useState({ pageNo: 1, pageSize: 100 });
  const [children, setChildren] = useState<any[]>([]);
  const [currentChildren, setCurrentChildren] = useState<any>({});
  const childContext = useContext(ChildContext);
  const [visible, setVisible] = useState(false);

  const getChildrenList = async () => {
    const res = await request({
      url: "/children/list",
      data: page,
      checkLogin: true,
    });
    setChildren(res.data.children);
    setCurrentChildren(res.data.children?.[0] ?? {});
    childContext.updateChild({ len: res.data.children.length });
    change?.(res.data.children?.[0]);
  };

  // 跳转至添加儿童页面，以添加儿童信息
  const add = () => {
    if (returnUrl) {
      navigateTo({
        url: `/childPackage/pages/edit?returnUrl=${returnUrl}`,
      });
    } else {
      const { router }: any = Taro.getCurrentInstance();
      const currentPageUrl = `${router.path}${
        router.query ? router.query : ""
      }`;
      navigateTo({
        url: `/childPackage/pages/edit?returnUrl=${Base64.encode(
          currentPageUrl
        )}`,
      });
    }
  };

  useEffect(() => {
    getChildrenList();
  }, []);

  const chooseChild = (v) => {
    setCurrentChildren(v);
    setVisible(false);
    change?.(v);
    request({ url: "/children/default", data: { id: v.id } });
  };

  return (
    <View>
      <View className={styles["list-wrap"]}>
        <View className={styles["list"]}>
          <View className={styles["child-info"]}>
            <View className={styles["left"]}>
              <Image
                src={currentChildren.gender === "男" ? Nanhai : Nvhai}
                className={styles["head"]}
              />
              <View className={styles["text-info"]}>
                <View className={styles.name}>
                  {currentChildren.name}{" "}
                  {currentChildren.gender === "男" ? (
                    <Image
                      src={Male}
                      className={styles.gender}
                      onClick={() => setVisible(true)}
                    />
                  ) : (
                    <Image
                      src={Female}
                      className={styles.gender}
                      onClick={() => setVisible(true)}
                    />
                  )}
                </View>
                <Text className={styles.birthday}>
                  {currentChildren.birthday}
                </Text>
              </View>
            </View>
            <View className={styles.actions}>
              <Image
                src={Qiehuan}
                className={styles.action}
                onClick={() => setVisible(true)}
              />
            </View>
          </View>
        </View>
        <View className={styles.actions}>
          {children?.length === 0 && (
            <Button className={styles.btn} onClick={add}>
              添加儿童
            </Button>
          )}
        </View>
      </View>
      <Popup
        open={visible}
        onClose={() => setVisible(false)}
        placement="top"
        style={{ height: "70%" }}
      >
        <View className={styles["list-wrap"]}>
          <View className={styles["list"]}>
            {children.map((v, index) => (
              <View
                key={index}
                className={styles["child-info"]}
                onClick={() => chooseChild(v)}
              >
                <View className={styles["left"]}>
                  <Image
                    src={currentChildren.gender === "男" ? Nanhai : Nvhai}
                    className={styles["head"]}
                  />
                  <View className={styles["text-info"]}>
                    <View className={styles.name}>
                      {v.name}{" "}
                      {v.gender === "男" ? (
                        <Image
                          src={Male}
                          className={styles.gender}
                          onClick={() => setVisible(true)}
                        />
                      ) : (
                        <Image
                          src={Female}
                          className={styles.gender}
                          onClick={() => setVisible(true)}
                        />
                      )}
                    </View>
                    <Text className={styles.birthday}>{v.birthday}</Text>
                  </View>
                </View>
                <View className={styles.actions}>
                  <Image
                    src={currentChildren.id === v.id ? Xuanzhong : Weixuanzhong}
                    className={styles.action}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      </Popup>
    </View>
  );
}
