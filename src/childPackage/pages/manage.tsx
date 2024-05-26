import { ChildContext } from "@/service/context";
import request from "@/service/request";
import Female from "@/static/icons/female.svg";
import Male from "@/static/icons/male.svg";
import editImg from "@/static/imgs/edit.png";
import Nanhai from "@/static/imgs/nanhai.png";
import Nvhai from "@/static/imgs/nvhai.png";
import removeImg from "@/static/imgs/remove.png";
import Tianjia from "@/static/imgs/tianjiaertong.png";
import { Button, Dialog, Notify } from "@taroify/core";
import { Image, Text, View } from "@tarojs/components";
import { navigateTo, useDidShow, useRouter } from "@tarojs/taro";
import { useContext, useEffect, useState } from "react";

import React from "react";
import { cls } from "reactutils";
import styles from "./manage.module.scss";

export default function App() {
  const router = useRouter();
  const [updateFlag, setUpdateFlag] = useState(Date.now());
  const [page, setPage] = useState({ pageNo: 1, pageSize: 10 });
  const [children, setChildren] = useState<any>([]);
  const [dataIndex, setDataIndex] = useState(0);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const childContext = useContext(ChildContext);

  // 页面加载时调用该方法获取儿童信息
  useEffect(() => {
    getChildrenList();
  }, [updateFlag]);

  // 每次页面显示时获取儿童信息
  useDidShow(() => {
    getChildrenList();
  });

  const getChildrenList = async () => {
    const res = await request({ url: "/children/list", data: page });
    setChildren(res.data.children);
    childContext.updateChild({ len: res.data.children.length });
  };

  // 跳转至添加儿童页面，以添加儿童信息
  const add = () => {
    if (router.params.returnUrl) {
      navigateTo({
        url: `/childPackage/pages/edit?code=${router.params.code}&returnUrl=${router.params.returnUrl}`,
      });
    } else {
      navigateTo({
        url: `/childPackage/pages/edit?code=${router.params.code}`,
      });
    }
  };
  // 跳转至添加儿童页面，并带上儿童 ID，以编辑儿童信息
  const edit = (index) => {
    navigateTo({
      url: `/childPackage/pages/edit?childId=${children[index].id}`,
    });
  };

  // 显示删除儿童信息对话框
  const showRemove = (index) => {
    setDataIndex(index);
    setShowRemoveModal(true);
  };

  // 删除当前儿童信息
  const doRemove = async (index) => {
    const res = await request({
      url: `/children/delete?id=${children[index].id}`,
    });

    setShowRemoveModal(false);

    if (res.code === 0) {
      children.splice(
        children.findIndex((ele) => ele.id === dataIndex),
        0
      );
      setChildren(children);
      Notify.open({ color: "success", message: "儿童信息已删除" });
      setUpdateFlag(Date.now());
    } else {
      Notify.open({ color: "danger", message: "儿童信息删除失败" });
    }
  };

  return (
    <View className={cls(styles.index, "common-bg")}>
      <Notify id="notify" />
      <Image src={Tianjia} className={styles.add} onClick={add} />
      <View className={styles["list-wrap"]}>
        <View className={styles["list"]}>
          {children.map((v, index) => (
            <View key={index}>
              <View className={styles["child-info"]}>
                <View className={styles["left"]}>
                  <Image
                    src={v.gender === "男" ? Nanhai : Nvhai}
                    className={styles.head}
                  />
                  <View className={styles["text-info"]}>
                    <View className={styles.name}>
                      {v.name}{" "}
                      {v.gender === "男" ? (
                        <Image src={Male} className={styles.gender} />
                      ) : (
                        <Image src={Female} className={styles.gender} />
                      )}
                    </View>
                    <Text className={styles.birthday}>{v.birthday}</Text>
                  </View>
                </View>
                <View className={styles.actions}>
                  <Image
                    onClick={() => showRemove(index)}
                    src={removeImg}
                    className={styles.action}
                  />
                  <Image
                    onClick={() => edit(index)}
                    src={editImg}
                    className={styles.action}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
      <Dialog open={showRemoveModal} onClose={setShowRemoveModal}>
        <Dialog.Content>
          <View style={{ textAlign: "center" }}>
            <View> 确认删除儿童{children?.[dataIndex]?.name}？</View>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onClick={() => setShowRemoveModal(false)}>取消</Button>
          <Button onClick={() => doRemove(dataIndex)}>确认</Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
}
