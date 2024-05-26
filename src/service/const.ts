export enum MediaType {
  PICTURE = 1,
  VIDEO,
  AUDIO,
}

export enum GenderType {
  MALE = 1,
  FEMALE,
}

export enum ScaleTableCode {
  BRAIN = 9,
  GMS,
  BRAIN_GMS,
  LEIBO_BRAIN,
  LEIBO_GMS,
  Griffiths,
  Product88 = 33,
  Duoyuan = 41,
  Shuimian3to12 = 42,
}

export enum OrderStatus {
  UNPAID = 1,
  PAID,
  USED,
  CANCELLED,
}

export enum EvaluateType {
  MENZHEN = 1,
  ZHUANSHU = 2, // 康复线下
  ZHINENG = 3,
  SHIPIN = 4,
  KANGFU_ONLINE = 6,
}

export enum PaymentType {
  OFFLINE = 1,
  ONLINE,
}

export const tabPages = ["/pages/index/index", "pages/mine/index"];

export const FushuAppId = "wxc662de75e52ad4d5";
export const LeiboAppId = "wxb7471fee564e0831";

export enum OrgId {
  ANQIER = "28",
}

export const DanjuTishi =
  "请上传院内就医导引单和特检收费清单，人工审核单据无误后即可预约成功";

export enum categoryEnum {
  isNormal = 1,
  isXianLiTi,
  isLingDaoYi,
}
