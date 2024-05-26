import { tabPages } from "@/service/const";
import { useAuth } from "@/service/hook";
import request from "@/service/request";
import { Button, Checkbox, Popup } from "@taroify/core";
import { Image, Text, View } from "@tarojs/components";
import Taro, { reLaunch, useRouter } from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";

export default function App() {
  const router = useRouter();
  const { getAuth } = useAuth();
  const [logo, setLogo] = useState("");
  const [value, setValue] = useState(false);
  const [open, setOpen] = useState(false);

  const onGetPhoneNumber = async (e) => {
    const login = await Taro.login();
    const userInfo = await Taro.getUserInfo();
    const res = await request({
      url: "/miniapp/login",
      method: "POST",
      data: {
        code: login.code,
        encryptedData: userInfo.encryptedData,
        iv: userInfo.iv,
        phoneCode: e.detail.code,
        channel: router.params.channel || "",
        orgid: router.params.orgid,
      },
    });
    if (res.code === 0) {
      await getAuth();
      if (router.params.returnUrl) {
        if (tabPages.includes(router.params.returnUrl)) {
          Taro.switchTab({ url: router.params.returnUrl });
        } else {
          reLaunch({ url: router.params.returnUrl });
        }
      } else {
        Taro.switchTab({ url: "/pages/index/index" });
      }
    }

    // console.log("🚀 ~ file: index.tsx ~ line 21 ~ App ~ res", res);
  };

  const back = () => {
    Taro.switchTab({ url: "/pages/index/index" });
  };

  useEffect(() => {
    (async () => {
      const res = await request({
        url: "/wx/portal/logo",
        data: {
          channel: router.params.channel || "",
          orgid: router.params.orgid || 0,
        },
      });
      setLogo(res.data.url);
    })();
  }, []);

  return (
    <View className={styles.box}>
      <View className={styles.shadow}>
        <View className={styles.imgBox}>
          <Image src={logo} className={styles.img} />
        </View>
        {/* <View className={styles.title}>脑科学数字化精准康复变革者</View> */}
        <View className={styles.btnBox}>
          <Button
            disabled={!value}
            className={styles.btn}
            color="primary"
            onGetPhoneNumber={onGetPhoneNumber}
            openType="getPhoneNumber"
          >
            手机号快捷登录
          </Button>
          <Button className={styles.btn} onClick={back}>
            拒绝
          </Button>
        </View>
        <View className={styles.agreement}>
          <Checkbox
            shape="square"
            checked={value}
            onChange={setValue}
            size={18}
          >
            <View className={styles.read}>我已阅读并同意 </View>
          </Checkbox>
          <Text className={styles.buy} onClick={() => setOpen(true)}>
            《用户协议与免责条款》
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
          <View className="WordSection1" style={{ padding: 10 }}>
            <View className={styles.head}>服务协议的法律声明及隐私权政策</View>

            <View className={styles.MsoNormal}>
              欢迎您使用我们的产品和服务，您在访问我们的平台、使用我们的产品和
              <Text>/</Text>
              或服务时，我们可能会收集和使用您的相关信息，我们知道任何用户的个人信息安全都是至关重要的，我们将高度重视并竭力保护好您的个人信息隐私的安全。
            </View>

            <View className={styles.MsoNormal}>
              本隐私政策适用于您对我们平台的访问以及我们平台提供的全部产品和
              <Text>/</Text>或服务<Text>(</Text>本隐私政策中统称为我们的产品和
              <Text>/</Text>或服务<Text>)</Text>
              的使用而提供或留存的信息，我们希望通过本隐私政策向您说明我们在您访问我们的平台、使用我们的产品和
              <Text>/</Text>
              或服务时是如何收集使用、保存、共享和转移这些信息，以及我们将为您提供查询、更新、保护这些信息的方式
            </View>

            <View className={styles.MsoNormal}>
              <Text></Text>
            </View>

            <View className={styles.MsoNormal}>
              <u>
                请您在继续使用我们产品或服务前务必认真仔细阅读并确认充分理解本隐私政策全部规则和要点，一旦您选择使用或在我们更新本隐私政策后
                <Text>(</Text>我们会及时提示您更新的情况<Text>)</Text>
                继续使用我们的产品和服务，即视为同本隐私政策<Text>(</Text>
                含更新版本<Text>)</Text>
                的全部内容，同意我们按本隐私政策收德，使用、共享和外理您的相关信息。
                <Text></Text>
              </u>
            </View>

            <View className={styles.MsoNormal}>
              如您在在阅读过程中，对本政策有任何疑问，可联系我们的客服咨询，向我们进行反债。如您不同意相关协议或其中的任何条款的，您应停止使用我们的产品和
              <Text>/</Text>或服务。
            </View>

            <View className={styles.MsoNormal}>
              本隐私政策帮助您了解以下内容：
            </View>

            <View className={styles.MsoNormal}>
              <Text>1.</Text>我们如何收集和使用您的个人信息；
            </View>

            <View className={styles.MsoNormal}>
              <Text>2.</Text>我们如何使用<Text>Cookie</Text>和其他追踪技术；
            </View>

            <View className={styles.MsoNormal}>
              <Text>3.</Text>我们如何共享、转让、公开披露您的个人信息；
            </View>

            <View className={styles.MsoNormal}>
              <Text>4.</Text>我们如何存储保存和保护您的个人信息；
            </View>

            <View className={styles.MsoNormal}>
              <Text>5.</Text>您的权利；
            </View>

            <View className={styles.MsoNormal}>
              <Text>6.</Text>我们如何处理未成年人的个人信息。
            </View>

            <View className={styles.MsoNormal}>
              <Text className={styles.subTitle}>
                一、我们如何收集和使用您的个人信息<Text></Text>
              </Text>
            </View>

            <View className={styles.MsoNormal}>
              <Text>1</Text>
              、个人信息指以电子或者其他方式记录的能够单独或者与其他信息结合识别特定自然人身份或者反映特定自然人活动情况的各种信息。
              <Text className={styles.subTitle}>
                <u>
                  如姓名、出生日期、身份证件号码、个人生物识别信息、住址、通信通讯联系方式、通信记录和内容、账号密码、财产信息、征信信息、行踪轨迹、住宿信息、健康生理信息、交易信息等。个人敏感信息包括身份证件号码、个人生物识别信息、银行账号、财产信息、行踪轨迹、交易信息、
                  <Text>14</Text>岁下<Text>(</Text>含<Text>)</Text>
                  儿童的个人信息等。
                </u>
              </Text>
            </View>

            <View className={styles.MsoNormal}>
              <Text>2</Text>
              、我们根据《中华人民共和国网络安全法》和《信息安全技术个人信息安全规范》
              <Text>(GB/T35273-2017)</Text>
              以及其它相关法律法规的要求，并严格遵循正当、合法、必要的原则，出于您访问我们的平台、使用我们提供的服务和
              <Text>/</Text>或产品等过程中而收集和使用您的个人信息。
            </View>

            <View className={styles.MsoNormal}>
              <Text>3</Text>
              、如在后续服务过程中，我们需将您的个人信息用于本隐私政策未载明的其它用途，或基于特定的服务或目的将收集而来的信息用于其他目的，我们将以合理的方式向您告知并再次征得您的同意。
            </View>

            <View className={styles.MsoNormal}>
              <Text>
                <Text>4</Text>
                、在收集您的个人信息后，我们将通过技术手段对数据进行去标识化处理，去标识化处理的信息将无法识别主体。请您了解并同意，在此情况下我们有权使用已经去标识化的信息，并在不透露您个人信息的前提下，我们有权对用户数据库进行分析并予以商业化的利用。
                <Text></Text>
              </Text>
            </View>

            <View className={styles.MsoNormal}>
              <Text>
                <Text>5</Text>、我们会对我们的产品与<Text>/</Text>
                或服务使用情况进行统计，并可能会与公众或第三方共享这些统计信息，以展示我们的产品与
                <Text>/</Text>
                或服务的整体使用趋势。但这些统计信息将进行匿名化处理，不包含您的任何身份识别信息。
                <Text></Text>
              </Text>
            </View>

            <View className={styles.MsoNormal}>
              <Text></Text>
            </View>

            <View className={styles.MsoNormal}>
              <Text className={styles.subTitle}>
                我们将在以下情况或出于以下目的，收集和使用您的个人信息：
                <Text></Text>
              </Text>
            </View>

            <View className={styles.MsoNormal}>
              <Text className={styles.subTitle}>
                <Text>(</Text>一<Text>)</Text>帮助您成为我们的在线注册用户
                <Text></Text>
              </Text>
            </View>

            <View className={styles.MsoNormal}>
              <Text>1</Text>
              、为接受我们全面的服务，您应首先注册一个用户账号，同时基于互联网医疗行业的敏感性、特殊性以及安全性的要求，您注册并登陆使用我们的产品和
              <Text>/</Text>
              或服务时，您可能需要提供如下信息：您准备使用的账户名、密码、您本人的电话号码和
              <Text>/</Text>或身份证号码<Text>(</Text>
              在不同的服务内容中用于身份验证或实名验证<Text>)</Text>
              、性别、出生日期、所在城市，此外如需为其他与您有亲属关系的患者在我们平台使用我们的产品
              <Text>/</Text>和或服务的<Text>(</Text>如下第<Text>(</Text>二
              <Text>)</Text>节我们为您提供的产品和<Text>/</Text>
              或服务中的相关内容<Text>)</Text>
              ，您还需进一步提供患者信息、与患者的关系等个人敏感信息。
            </View>

            <View className={styles.MsoNormal}>
              <Text>2</Text>
              、如您拒绝提供手机号码或身份证号码进行实名验证以及上述个人敏感信息的仅浏览平台内的相关信息内容，但不可进行任何其它的操作或接受平台提供的核心服务等
              <Text>(</Text>如下第<Text>(</Text>二<Text>)</Text>
              节我们为您提供的产品和<Text>/</Text>或服务中的相关内容
              <Text>)</Text>。
            </View>

            <View className={styles.MsoNormal}>
              <Text className={styles.subTitle}>
                <Text>(</Text>二<Text>)</Text>向您提供产品和<Text>/</Text>或服务
                <Text></Text>
              </Text>
            </View>

            <View className={styles.MsoNormal}>
              <Text>1</Text>、我们提供信息展示功能
            </View>

            <View className={styles.MsoNormal}>
              <Text>(1)</Text>
              我们提供医疗医药健康内容咨询供您浏览阅读，包括医院、科室、医生等的信息、健康百科内容
              <Text>(</Text>含药品百科、急救知识、读懂化验单<Text>)</Text>
              、医生文章、健康资讯、医院介绍、就医指南等等。为此，在您进行信息浏览时，我们可能会收集您在使用该等服务时的设备信息，包括设备名称、设备型号、唯一设备识别码、操作系统版本和应用程序版本、语言设置、分辨率、电信运营商信息，浏览器类型等等软硬件信息。
            </View>

            <View className={styles.MsoNormal}>
              <Text>(2)</Text>
              同时在您进行浏览时，还可根据个人需求和喜好选择搜索服务，通过搜索关键词精准找寻内容。为提供该等搜索服务，我们将可能收集您的日志信息，即您在搜索时，我们将自动搜集您使用我们平台的相关详细情况，并作为网络日志保存，包括但不限于您输入的搜索关键词信息和点击的链接，您发布的评论，咨询的相关问题，对我们服务的反债与评价，您上传的文字资料、图片、视频等信息以及您的
              <Text>IP</Text>
              地址、浏览器的类型和使用的语言、硬件，设备信息操作系统的版本、网络运营商的信息、您访问服务的日期、时间、时长等。
            </View>

            <View className={styles.MsoNormal}>
              <Text>(3)</Text>
              当您通过搜索来进一步搜索精确信息时，我们会保留您的搜索内容以方便您重复输入或为您展示与搜索的信息内容有相关性的内容。请您注意，您的搜索关键词信息无法单独识别您的身份，不属于您的个人信息，我们有权以任何的目的对其进行使用；只有当您的搜索关键词信息与您的其他信息相互结合使用并可以识别您的身份时，则在结合使用期间，我们会将您的搜索关键词信息作为您的个人信息，与您的搜索历史记录一同按照本隐私政策对其进行处理与保护。
            </View>

            <View className={styles.MsoNormal}>
              <Text>2</Text>、线上智慧就医服务
            </View>

            <View className={styles.MsoNormal}>
              我们提供在线智慧就医服务，在您成为注册用户后，您可在我们平台进行预约挂号、查询报告、预约取号、排队叫号、费用查询等服务，包括纳里健康科技有限公司提供的日间手术。使用此服务，我们可能需收集您的手机号码、患者姓名
              <Text>.</Text>
              性别、身份证号码、病案号、出生日期、所在城市、病情、既往病史、过敏情况与患者的关系等以及设备信息、浏览器信息、日志信息。如需为其他与您有亲属关系的患者在我们平台使用此服务，您也需进一步提供患者信息、与患者的关系等个人敏感信息。如您不提供该等信息，您将无法取得本服务。
            </View>

            <View className={styles.MsoNormal}>
              <Text>3</Text>、互联网医疗服务
            </View>

            <View className={styles.MsoNormal}>
              我们提供在线健康咨询<Text>\</Text>
              评估等功能，在您成为注册用户后，您可在我们平台进行咨询，包括图文、视频等方式向医生进行提问，并对医生的回答进行评论等，包括自愿加入医生的患者关爱目录等。使用此服务，我们可能需收集您的手机号码、患者姓名、性别、身份证号码、病案号、出生日期、所在城市、病情、既往病史、过敏情况、与患者的关系等以及设备信息、浏览器信息、日志信息。如需为其他与您有亲属关系的患者在我们平台使用此服务，您也需进一步提供患者信息、与患者的关系等个人敏感信息。如您不提供该等信息，您将无法取得本服务。
            </View>

            <View className={styles.MsoNormal}>
              <Text>4</Text>、处方开药功能
            </View>

            <View className={styles.MsoNormal}>
              作为可提供互联网诊疗服务的平台，我们可提供线上问诊处方开药功能，作为注册用户，您可在我们平台选择线上续方服务或者在您问诊后根据医生为您开具的用药处方。使用此服务，我们可能需收集您的前述个人信息以外，还需要收集您的详细收件地址。
            </View>

            <View className={styles.MsoNormal}>
              <Text>5</Text>、支付功能
            </View>

            <View className={styles.MsoNormal}>
              我们提供的在线健康咨询以及线上续方为收费服务，当您选择在我们平台使用或购买该类服务和
              <Text>/</Text>
              产品时，需要进行支付，在按照平台完成交易和支付的过程中，我们可能会收集您的第三方支付账号
              <Text>(</Text>如支付宝账号、微信支付账号、银行卡信息等
              <Text>)</Text>用于付款以及验证。
            </View>

            <View className={styles.MsoNormal}>
              <Text className={styles.subTitle}>
                <Text>(</Text>三<Text>)</Text>提供或改进我们的产品和
                <Text>/</Text>或服务所需要的附加功能<Text></Text>
              </Text>
            </View>

            <View className={styles.MsoNormal}>
              <Text>1</Text>、位置信息
            </View>

            <View className={styles.MsoNormal}>
              位置信息——当您通过设备使用我们的相关服务时，我们可能会收集和处理有关您的位置信息、行踪轨迹、网络身份标识信息等，例如来自您的设备的传感器数据就可以提供附近
              <Text>WiFi</Text>接入点和基站的信息或者通过<Text>IP</Text>
              地址、蓝牙、<Text>GPS</Text>等获取您的信息。
            </View>

            <View className={styles.MsoNormal}>
              <Text>2</Text>、客户服务
            </View>

            <View className={styles.MsoNormal}>
              当您向我们平台提起投诉、申诉或进行评价时，为了方便与您联系或帮助您解决问题，我们可能需要您提供姓名、手机号码、电子邮件及其他联系方式等个人信息。如您拒绝提供上述信息，我们可能无法向您及时反债投诉、申诉或咨询结果。
            </View>

            <View className={styles.MsoNormal}>
              <Text>3</Text>、个性化推送功能
            </View>

            <View className={styles.MsoNormal}>
              我们会基于收集的信息，对您的偏好、习惯、位置作特征分析和用户画像，以便为您提供更适合的定制化服务，例如向您展现或推荐相关程度更高
              <Text>(</Text>而非普遍推送<Text>)</Text>的搜索结果、信息流或者广告
              <Text>/</Text>
              推广信息结果。为此，我们需要收集的信息包括您的设备信息、浏览器型号、日志信息、浏览记录。
            </View>

            <View className={styles.MsoNormal}>
              <Text>4</Text>、基于摄像头<Text>(</Text>相机<Text>)</Text>
              的附加功能：您在使用视频咨询、扫一扫关注医生等服务，需要使用这个附加功能完成视频通话、拍摄、拍照、扫码等功能。
            </View>

            <View className={styles.MsoNormal}>
              <Text>5</Text>
              、基于图片上传的附加功能：您在使用图文咨询、团队咨询、专科护理等服务需要在我们平台上传您的本地照片
              <Text>(</Text>如病历、<Text>CT</Text>等医疗诊断<Text>)</Text>
              以及音视频等，让医生更充分了解您的病情，给出合理的建议。
            </View>

            <View className={styles.MsoNormal}>
              <Text>6</Text>
              、基于语音技术的附加功能：您可以直接使用麦克风来进行视频咨询。
            </View>

            <View className={styles.MsoNormal}>
              <Text className={styles.subTitle}>
                <Text>(</Text>四<Text>)</Text>需征得您同意的例外情形
                <Text></Text>
              </Text>
            </View>

            <View className={styles.MsoNormal}>
              您知晓，根据相关法律法规的规定，在以下情形中，我们可以在不征得您的知情同意的情况下而收集、使用相关个人信息：
            </View>

            <View className={styles.MsoNormal}>
              <Text>1.</Text>与国家安全、国防安全有关的；
            </View>

            <View className={styles.MsoNormal}>
              <Text>2.</Text>与公共安全、公共卫生、重大公共利益有关的；
            </View>

            <View className={styles.MsoNormal}>
              <Text>3.</Text>与犯罪侦查、起诉、审判和判决执行等有关的；
            </View>

            <View className={styles.MsoNormal}>
              <Text>4.</Text>
              出于维护个人信息主体瞌甭昂唉柄耙柏埃谤氨布唉板安伴靶谤拦培个人的生命、财产等重大合法权益但又很难得到本人同意的；
            </View>

            <View className={styles.MsoNormal}>
              <Text>5.</Text>
              所收集的个人信息是个人信息主体自行向社会公众公开的；
            </View>

            <View className={styles.MsoNormal}>
              <Text>6.</Text>
              从合法公开披露的信息中收集的您的个人信息的，如合法的新闻报道政府信息公开等渠道；
            </View>

            <View className={styles.MsoNormal}>
              <Text>7.</Text>根据您的要求签订合同所必需的；
            </View>

            <View className={styles.MsoNormal}>
              <Text>8.</Text>用于维护所提供的产品与<Text>/</Text>
              或服务的安全稳定运行所必需的，例如发现、处置产品与<Text>/</Text>
              或服务的故障；
            </View>

            <View className={styles.MsoNormal}>
              <Text>9.</Text>为合法的新闻报道所必需的；
            </View>

            <View className={styles.MsoNormal}>
              <Text>10.</Text>
              学术研究机构基于公共利益开展统计或学术研究所必要，且对外提供学术研究或描述的结果时，对结果中所包含的个人信息进行去标识化处理的；
            </View>

            <View className={styles.MsoNormal}>
              <Text>11.</Text>法律法规规定的其他情形。
            </View>

            <View className={styles.MsoNormal}>
              <Text className={styles.subTitle}>
                <Text>(</Text>五<Text>)</Text>
                如果您对我们收集和使用您的个人信息的法律依据有任何疑问或需要提供进一步的信息，请通过第八章节提供的联系方式与我们联系。
                <Text></Text>
              </Text>
            </View>

            <View className={styles.MsoNormal}>
              <Text className={styles.subTitle}>
                二、我们如何使用<Text>Cookie</Text>和其他追踪技术<Text></Text>
              </Text>
            </View>

            <View className={styles.MsoNormal}>
              <Text className={styles.subTitle}>
                <Text>(</Text>一<Text>)Cookie</Text>
              </Text>
            </View>

            <View className={styles.MsoNormal}>
              <Text>1</Text>
              、为确保网站正常运转，我们会在您的计算机或移动设备上存储名为
              <Text>Cookie</Text>的小数据文件。<Text>Cookie</Text>
              通常包含标识符、站点名称以及一些号码和字符。借助于
              <Text>Cookie</Text>
              ，我们能够存储您的偏好或商品等数据，并用以判断注册用户是否已经登录，提升服务
              <Text>/</Text>产品质量及优化用户体验。
            </View>

            <View className={styles.MsoNormal}>
              <Text>2</Text>、我们不会将<Text>Cookie</Text>
              用于本政策所述目的之外的任何用途。您可根据自己的偏好管理或删除
              <Text>Cookie</Text>。您可以清除计算机上保存的所有
              <Text>Cookie</Text>，大部分网络浏览器都设有阻止或禁用
              <Text>Cookie</Text>
              的功能，您可对浏览器进行配置。但如果您这么做，则需要在每一次访问我们的平台时亲自更改用户设置。阻止或禁用
              <Text>Cookie</Text>
              功能后，可能影响您使用或不能充分使用我们提供的全部产品和
              <Text>/</Text>或服务。
            </View>

            <View className={styles.MsoNormal}>
              <Text className={styles.subTitle}>
                <Text>(</Text>二<Text>)</Text>网站信标和像素标签<Text></Text>
              </Text>
            </View>

            <View className={styles.MsoNormal}>
              除<Text>Cookie</Text>
              外我们还会在网站上使用网站信标和像素标签等其他同类技术。例如我们向您发送的电子邮件或短信中可能含有链接至我们网站内容的点击
              <Text>URL</Text>如果您点击该链接<Text>,</Text>我们则会跟踪此次点击
              <Text>,</Text>
              帮助我们了解您的产品或服务偏好并改善客户服务。网站信标通常是一种嵌入到网站或电子邮件中的透明图像。借助于电子邮件中的像素标签
              <Text>,</Text>
              我们能够获知电子邮件是否被打开。如果您不希望自己的活动以这种方式被追踪
              <Text>,</Text>则可以随时从我们的寄信名单中退订。
            </View>

            <View className={styles.MsoNormal}>
              <Text className={styles.subTitle}>
                三、我们如何共享、转让与公开披露您的个人信息<Text></Text>
              </Text>
            </View>

            <View className={styles.MsoNormal}>
              <Text className={styles.subTitle}>
                <Text>(</Text>一<Text>)</Text>共享<Text></Text>
              </Text>
            </View>

            <View className={styles.MsoNormal}>
              <Text>1</Text>、我们不会向<Text>“</Text>我们平台<Text>”</Text>
              平台服务提供者以外的任何公司、组织和个人共享您的个人信息
              <Text>,</Text>但以下情况除外：
            </View>

            <View className={styles.MsoNormal}>
              <Text>(1)</Text>在获取明确同意的情况下共享：获得您的明确同意后
              <Text>,</Text>我们会与其他方共享您的个人信息。
            </View>

            <View className={styles.MsoNormal}>
              <Text>(2)</Text>我们可能会根据法律法规规定<Text>,</Text>
              或按政府主管部门的强制性要求<Text>,</Text>对外共享您的个人信息。
            </View>

            <View className={styles.MsoNormal}>
              <Text>(3)</Text>只有共享您的信息<Text>,</Text>才能实现我们的产品与
              <Text>/</Text>或服务的核心功能或提供您需要的服务<Text>(</Text>
              此种情形我们将在情形发生时专门提示您<Text>)</Text>。
            </View>

            <View className={styles.MsoNormal}>
              <Text>2</Text>、与授权合作伙伴共享：仅为实现本政策中声明的目的
              <Text>,</Text>
              我们的某些服务将由授权合作伙伴提供。我们可能会与合作伙伴共享您的某些个人信息
              <Text>,</Text>以提供更好的客户服务和用户体验。例如<Text>,</Text>
              您在获取验证码登录平台时<Text>,</Text>
              我们必须与短信务提供商共享您的个人信息才能发送短信验证码至您的手机上。我们仅会出于合法、正当、必要、特定、明确的目的共享您的个人信息
              <Text>,</Text>
              并且只会共享提供服务所必要的个人信息。我们的合作伙伴无权将共享的个人信息用于任何其他用途。如果您拒绝我们的合作伙伴在提供服务时收集为提供服务所必须的个人信息
              <Text>,</Text>将可能导致您无法在我们使用该第三方服务。
            </View>

            <View className={styles.MsoNormal}>
              我们的合作伙伴包含以下类型：
            </View>

            <View className={styles.MsoNormal}>
              <Text>(1)</Text>
              技术服务的供应商。我们可能会将您的个人信息共享给支持我们功能的第三方。这些支持包括为我们提供基础设施技术服务、提供视频服务
              <Text>SDK</Text>
              供应商提供处方流转技术服务、代表我们发出短信的通讯服务供应商、支付服务、数据处理等。我们共享这些信息的目的是可以实现我们产品与
              <Text>/</Text>
              或服务的核心功能，比如线上续方时，我们必须与药品合作供应商以及其选定的物流服务提供商共享您的订单信息才能安排送货；或者我们需要将您的订单号和订单金额与第三方支付机构共享以实现其确认您的支付指令并完成支付等。
            </View>

            <View className={styles.MsoNormal}>
              <Text>(2)</Text>
              分析服务类的授权合作伙伴。在征得您的许可，我们可能将不能识别您的个人身份信息的统计或匿名信息共享给提供分析服务的合作伙伴。对于分析数据的伙伴，为了更好的分析我们平台用户的使用情况，我们可能向其提供我们平台用户的数量、地区分布、活跃情况等数据，但我们仅会向这些合作伙伴提供不能识别个人身份的统计或匿名信息。
            </View>

            <View className={styles.MsoNormal}>
              <Text className={styles.subTitle}>
                <Text>(</Text>二<Text>)</Text>转让<Text></Text>
              </Text>
            </View>

            <View className={styles.MsoNormal}>
              我们不会将您的个人信息转让给任何公司、组织和个人，但以下情况除外：
            </View>

            <View className={styles.MsoNormal}>
              <Text>1.</Text>
              在获取明确同意的情况下转让：获得您的明确同意后，我们会向其他方转让您的个人信息；
            </View>

            <View className={styles.MsoNormal}>
              <Text>2.</Text>
              在涉及合并、收购或破产清算时，如涉及到个人信息转让，我们会在要求新的持有您个人信息的公司、组织继续受此隐私政策的约束，否则我们将要求该公司、组织重新向您征求授权同意。
            </View>

            <View className={styles.MsoNormal}>
              <Text className={styles.subTitle}>
                <Text>(</Text>三<Text>)</Text>公开披露<Text></Text>
              </Text>
            </View>

            <View className={styles.MsoNormal}>
              我们仅会在以下情况下，公开披露您的个人信息：
            </View>

            <View className={styles.MsoNormal}>
              <Text>1.</Text>获得您明确同意后；
            </View>

            <View className={styles.MsoNormal}>
              <Text>2.</Text>
              基于法律的披露：在法律、法律程序、诉讼或政府主管部门强制性要求的情况下，我们可能会公开披露您的个人信息；
            </View>

            <View className={styles.MsoNormal}>
              <Text>3.</Text>
              在符合法律法规的前提下，当我们收到上述披露信息的请求时，我们会要求必须出具与之相应的法律文件，如传票或调查函。我们坚信，对于要求我们提供的信息，应该在法律允许的范围内尽可能保持透明。
            </View>

            <View className={styles.MsoNormal}>
              <Text className={styles.subTitle}>
                <Text>(</Text>四<Text>)</Text>
                共享、转让、公开披露个人信息时事先征得授权同意的例外
                <Text></Text>
              </Text>
            </View>

            <View className={styles.MsoNormal}>
              在以下情形中，共享、转让、公开披露您的个人信息无需事先征得您的授权同意
            </View>

            <View className={styles.MsoNormal}>
              <Text>1.</Text>与国家安全、国防安全直接相关的；
            </View>

            <View className={styles.MsoNormal}>
              <Text>2.</Text>与公共安全、公共卫生、重大公共利益直接相关的；
            </View>

            <View className={styles.MsoNormal}>
              <Text>3.</Text>与犯罪侦查、起诉、审判和判决执行等直接相关的；
            </View>

            <View className={styles.MsoNormal}>
              <Text>4.</Text>
              出于维护您或其他个人的生命、财产等重大合法权益但又很难得到本人同意的；
            </View>

            <View className={styles.MsoNormal}>
              <Text>5.</Text>您自行向社会公众公开的个人信息；
            </View>

            <View className={styles.MsoNormal}>
              <Text>6.</Text>
              从合法公开披露的信息中收集个人信息的，如合法的新闻报道、政府信息公开等渠道；
            </View>

            <View className={styles.MsoNormal}>
              <Text>7.</Text>根据个人信息主体要求签订和履行合同所必需的；
            </View>

            <View className={styles.MsoNormal}>
              <Text>8.</Text>
              用于维护所提供的产品或服务的安全稳定运行所必需的，例如发现、处置产品或服务的故障；
            </View>

            <View className={styles.MsoNormal}>
              <Text>9.</Text>
              法律法规规定的其他情形。根据法律规定，共享、转让经去标识化处理的个人信息，且确保数据接收方无法复原并重新识别个人信息主体的，不属于个人信息的对外共享、转让及公开披露行为，对此类数据的保存及处理将无需另行向您通知并征得您的同意。
            </View>

            <View className={styles.MsoNormal}>
              <Text className={styles.subTitle}>
                四、我们如何保存和保护您的个人信息<Text></Text>
              </Text>
            </View>

            <View className={styles.MsoNormal}>
              <Text className={styles.subTitle}>
                <Text>(</Text>一<Text>)</Text>个人信息的保存<Text></Text>
              </Text>
            </View>

            <View className={styles.MsoNormal}>
              <Text>1</Text>、保存期限：请您注意，在您在使用我们的产品与
              <Text>/</Text>
              或服务时所提供的所有个人信息，除非您删除或通过系统设置拒绝我们收集，我们将在您使用我们的产品和
              <Text>/</Text>或服务期间持续授权我们持续使用。
            </View>

            <View className={styles.MsoNormal}>
              <Text>2</Text>
              、保存地域：上述信息将存储于中华人民共和国境内。如需跨境传输，我们将会在符合国家对于信息出境的相关法律规定情况下，再单独征得您的授权同意。
            </View>

            <View className={styles.MsoNormal}>
              <Text className={styles.subTitle}>
                <Text>(</Text>二<Text>)</Text>个人信息的保护<Text></Text>
              </Text>
            </View>

            <View className={styles.MsoNormal}>
              <Text className={styles.subTitle}>
                <Text>1</Text>、安全措施<Text></Text>
              </Text>
            </View>

            <View className={styles.MsoNormal}>
              <Text>(1)</Text>
              我们已使用符合业界标准的安全防护措施保护您提供的个人信息，防止数据遭到未经授权访问、公开披露、使用、修改、损坏或损失。我们会采取一切合理可行的措施，保护您的个人信息。
            </View>

            <View className={styles.MsoNormal}>
              <Text>(2)</Text>
              我们会使用加密技术确保数据的保密性：我们会使用受信赖的保护机制防止数据遭到恶意攻击。
            </View>

            <View className={styles.MsoNormal}>
              <Text>(3)</Text>我们会部署访问控制机制<Text>,</Text>
              确保只有授权人员才可访问个人信息；我们会与接触您个人信息的员工、合作伙伴签署保密协议
              <Text>,</Text>
              明确岗位职责及行为准则确保只有授权人员才可访问个人信息。若有违反保密协议的行为
              <Text>,</Text>会被追究相关责任。
            </View>

            <View className={styles.MsoNormal}>
              <Text>(4)</Text>我们会举办安全和隐私保护培训课程<Text>,</Text>
              加强员工对于保护个人信息重要性的认识。
            </View>

            <View className={styles.MsoNormal}>
              <Text>(5)</Text>我们会采取一切合理可行的措施<Text>,</Text>
              确保未收集无关的个人信息。我们只会在达成本政策所述目的所需的期限内保留您的个人信息
              <Text>,</Text>除非需要延长保留期或受到法律的允许。
            </View>

            <View className={styles.MsoNormal}>
              <Text className={styles.subTitle}>
                <Text>2</Text>、安全提醒<Text></Text>
              </Text>
            </View>

            <View className={styles.MsoNormal}>
              <Text>(1)</Text>互联网并非绝对安全的环境<Text>,</Text>
              而且电子邮件、即时通讯、及与其他用户的
              交流方式并未加密我们强烈建议您不要通过此类方式发送个人信息。请使用复杂密码
              <Text>,</Text>协助我们保证您的账号安全。
            </View>

            <View className={styles.MsoNormal}>
              <Text>(2)</Text>互联网环境并非百分之百安全<Text>,</Text>
              我们将尽力确保或担保您发送给我们的任何信息的安全性。如果我们的物理、技术、或管理防护设施遭到破坏
              <Text>,</Text>导致信息被非授权访问、公开披露、篡改、或毁坏
              <Text>,</Text>导致您的合法权益受损<Text>,</Text>
              我们将承担相应的法律责任。
            </View>

            <View className={styles.MsoNormal}>
              <Text>(3)</Text>
              您在使用我们平台服务时请勿将自认为隐私的信息发表、上传至我们平台也不可将该等信息通过我们平台的服务器传播给他人
              <Text>,</Text>若因您该等行为引起隐私泄露<Text>,</Text>
              由您自行承担责任。
            </View>

            <View className={styles.MsoNormal}>
              <Text>(4)</Text>
              您请勿在使用我们平台服务时公开透露自己的各类财产账户、银行卡、信用卡、第三方支付账户及对应密码等重要资料
              <Text>,</Text>否则由此带来的损失由您自行承担责任。
            </View>

            <View className={styles.MsoNormal}>
              <Text>(5)</Text>
              我们平台一旦发现假冒、仿冒、盗用他人名义进行平台认证的
              <Text>,</Text>
              平台有权立即删除用户信息并有权在用户提供充分证据前禁止其使用平台服务。
            </View>

            <View className={styles.MsoNormal}>
              <Text className={styles.subTitle}>
                <Text>3</Text>、安全事件通知<Text></Text>
              </Text>
            </View>

            <View className={styles.MsoNormal}>
              <Text>(1)</Text>
              我们会制定相应的网络安全事件应急预案，及时处置系统漏洞、计算机病毒、网络攻击、网络侵入等安全风险，在发生危害网络安全的事件时，我们会立即启动应急预案，采取相应的补救措施。
            </View>

            <View className={styles.MsoNormal}>
              <Text>(2)</Text>
              在不幸发生个人信息安全事件后，我们将按照法律法规的要求，及时向您告知：安全事件的基本情况和可能的影响、我们已采取或将要采取的处置措施您可自主防范和降低风险的建议、对您的补救措施等。我们将及时将事件相关情况以邮件、信函、电话、推送通知等方式告知您，难以逐一告知个人信息主体时，我们会采取合理、有效的方式发布公告。
            </View>

            <View className={styles.MsoNormal}>
              <Text>(3)</Text>
              如您发现自己的个人信息泄密，尤其是您的账户及密码发生泄露，请您立即通过我们平台提供的以及本政策第八章节的
              <Text>[</Text>如何联系我们<Text>]</Text>
              中的联系方式联络我们，以便我们采取相应措施。
            </View>

            <View className={styles.MsoNormal}>
              <Text className={styles.subTitle}>
                五、您的权利<Text></Text>
              </Text>
            </View>

            <View className={styles.MsoNormal}>
              按照中国相关的法律、法规、标准，以及其他国家、地区的通行做法，我们保障您对自己的个人信息行使以下权利：
            </View>

            <View className={styles.MsoNormal}>
              <Text className={styles.subTitle}>
                <Text>(</Text>一<Text>)</Text>访问和更正您的个人信息
                <Text></Text>
              </Text>
            </View>

            <View className={styles.MsoNormal}>
              <Text>1</Text>
              、除法律法规规定外，您有权随时访问和更正您的个人信息。
            </View>

            <View className={styles.MsoNormal}>
              <Text>2</Text>
              、如果您需要查阅您在使用我们平台过程中产生的其他个人信息，在合理要求下并经验证核实您的身份后，我们会向您提供。
            </View>

            <View className={styles.MsoNormal}>
              <Text className={styles.subTitle}>
                <Text>(</Text>二<Text>)</Text>响应您的上述请求<Text></Text>
              </Text>
            </View>

            <View className={styles.MsoNormal}>
              为保障安全，我们可能会先要求您验证自己的身份，然后再处理您的请求。您可能需要提供书面请求，或以其他方式证明您的身份。对于您的请求，我们原则上将于
              <Text>5</Text>
              日内做出答复。对于您合理的请求，我们原则上不收取费用，但对多次重复、超出合理限度的请求，我们将视情收取一定成本费用。对于那些无端重复、需要过多技术手段
              <Text>(</Text>例如，需要开发新系统或从根本上改变现行惯例
              <Text>)</Text>、给他人合法权益带来风险或者非常不切实际
              <Text>(</Text>例如，涉及备份磁带上存放的信息<Text>)</Text>
              的请求，我们可能会予以拒绝。
            </View>

            <View className={styles.MsoNormal}>
              <Text className={styles.subTitle}>
                <Text>(</Text>三<Text>)</Text>
                在以下情形中，按照法律法规要求，我们将无法响应您的请求：
                <Text></Text>
              </Text>
            </View>

            <View className={styles.MsoNormal}>
              <Text>1.</Text>与国家安全、国防安全直接相关的；
            </View>

            <View className={styles.MsoNormal}>
              <Text>2.</Text>与公共安全、公共卫生、重大公共利益直接相关的；
            </View>

            <View className={styles.MsoNormal}>
              <Text>3.</Text>与犯罪侦查、起诉、审判和判决执行等直接相关的；
            </View>

            <View className={styles.MsoNormal}>
              <Text>4.</Text>有充分证据表明您存在主观恶意或滥用权利的；
            </View>

            <View className={styles.MsoNormal}>
              <Text>5.</Text>
              响应您的请求将导致您或其他个人、组织的合法权益受到严重损害的；
            </View>

            <View className={styles.MsoNormal}>
              <Text>6.</Text>涉及商业秘密的。
            </View>

            <View className={styles.MsoNormal}>
              <Text className={styles.subTitle}>
                六、我们如何处理儿童的个人信息<Text></Text>
              </Text>
            </View>

            <View className={styles.MsoNormal}>
              我们的产品、网站和服务主要面向成人。如果没有父母或监护人的同意，儿童不得创建自己的用户账户。对于父母为其子女在我们平台进行在线咨询的，需经父母
              <Text>(</Text>监护人<Text>)</Text>
              同意而收集儿童个人信息的情况，我们只会在受到法律允许、父母或监护人明确同意或者保护儿童所必要的情况下收集、使用或公开披露此信息。尽管当地法律和习俗对儿童的定义不同，但我们将不满
              <Text>14</Text>
              周岁的任何人均视为儿童。如果我们发现自己在未事先获得可证实的父母同意的情况下收集了儿童的个人信息，则会设法尽快删除相关数据。若您是未成年人的监护人，当您对您所监护的未成年人使用我们的服务或其向我们提供的用户信息有任何疑问时，请您及时与我们联系。我们将根据国家相关法律法规及本政策的规定保护未成年人用户信息的保密性及安全性。如果我们发现自己在未事先获得可证实的父母或法定监护人同意的情况下收集了未成年人的个人信息，则会设法尽快删除相关数据
            </View>

            <View className={styles.MsoNormal}>
              <Text className={styles.subTitle}>
                七、本政策更新及通知<Text></Text>
              </Text>
            </View>

            <View className={styles.MsoNormal}>
              <Text>1</Text>、我们的隐私政策可能变更。
            </View>

            <View className={styles.MsoNormal}>
              <Text>2</Text>
              、未经您明确同意，我们不会削减您按照本隐私政策所应享有的权利。我们会在本页面上发布对本政策所做的任何变更。
            </View>

            <View className={styles.MsoNormal}>
              <Text>3</Text>、对于重大变更，我们可能还会提供更为显著的通知
              <Text>(</Text>
              包括对于某些服务，我们会通过电子邮件、站内信、短信、小程序通知、弹窗等方式发送通知说明隐私政策的具体变更内容
              <Text>)</Text>。
            </View>

            <View className={styles.MsoNormal}>
              <Text>4</Text>、本政策重大变更包括但不限于：
            </View>

            <View className={styles.MsoNormal}>
              <Text>(1)</Text>
              我们的服务模式发生重大变化。如处理个人信息的目的、处理的个人信息类型、个人信息的使用方式等；
            </View>

            <View className={styles.MsoNormal}>
              <Text>(2)</Text>
              我们在所有权结构、组织架构等方面发生重大变化。如业务调整、破产并购等引起的所有者变更等；
            </View>

            <View className={styles.MsoNormal}>
              <Text>(3)</Text>个人信息共享、转让或公开披露的主要对象发生变化；
            </View>

            <View className={styles.MsoNormal}>
              <Text>(4)</Text>
              您参与个人信息处理方面的权利及其行使方式发生重大变化；
            </View>

            <View className={styles.MsoNormal}>
              <Text>(5)</Text>
              我们负责处理个人信息安全的责任部门、联络方式及投诉渠道发生变化；
            </View>

            <View className={styles.MsoNormal}>
              <Text>(6)</Text>个人信息安全影响评估报告表明存在高风险时。
            </View>

            <View className={styles.MsoNormal}>
              <Text>5</Text>
              、若您不同意修改后的隐私保护政策，您有权并应立即停止使用我们平台的服务。如果您继续使用我们平台的服务，则视为您接受我们对本政策相关条款所做的修改。
            </View>

            <View className={styles.MsoNormal}>
              <Text className={styles.subTitle}>
                八、如何联系我们<Text></Text>
              </Text>
            </View>

            <View className={styles.MsoNormal}>
              <Text>1</Text>
              、如果您对本隐私政策有任何疑问、意见或建议，通过以下方式与我们联系通过小程序中的
              <Text>[</Text>联系客服<Text>]</Text>向我们反债意见。
            </View>

            <View className={styles.MsoNormal}>
              <Text>2</Text>
              、为保障我们高效处理您的问题并及时向您反债，需要您提交身份证明、有效联系方式和书面请求及相关证据，我们会在验证您的身份后处理您的请求。
            </View>

            <View className={styles.MsoNormal}>
              <Text className={styles.subTitle}>
                九、争议解决<Text></Text>
              </Text>
            </View>

            <View className={styles.MsoNormal}>
              因本政策以及我们处理您个人信息事宜引起的任何争议，您可随时联系我们要求给出回复，如果您对我们的回复不满意的，认为我们的个人信息处理行为严重损害了您的合法权益的，您还可以通过向本隐私政策服务提供商所在地有管辖权的人民法院提起诉讼来寻求解决方案。感谢您对我们平台以及我们平台产品和服务的信任用！
            </View>
          </View>
        </Popup>

        {/* <View className={styles.rights}>
          Copyright © {new Date().getFullYear()} 复数健康
        </View> */}
      </View>
    </View>
  );
}
