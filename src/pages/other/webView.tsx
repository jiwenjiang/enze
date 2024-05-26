import { Base64 } from "@/service/utils";
import { WebView } from "@tarojs/components";
import { useRouter } from "@tarojs/taro";
import React, { useEffect } from "react";

export default function App() {
  const router = useRouter();

  useEffect(() => {
    console.log("router.params.url", Base64.decode(router.params.url));
  }, []);

  return <WebView src={Base64.decode(router.params.url) || ""}></WebView>;
}
