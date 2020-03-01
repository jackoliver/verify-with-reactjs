export const LOGIN_OPTIONS = [
  {
    Id: 0,
    ShortName: "NO BankID",
    FullName: "Norwegian BankID",
    AcrValues: "urn:grn:authn:no:bankid",
    isForIFrame: true
  },
  {
    Id: 1,
    ShortName: "NO Vipps",
    FullName: "Norwegian Vipps",
    AcrValues: "urn:grn:authn:no:vipps",
    isForIFrame: false
  },
  {
    Id: 2,
    ShortName: "SE BankID SD",
    FullName: "Swedish BankID Same Device",
    AcrValues: "urn:grn:authn:se:bankid:same-device",
    isForIFrame: false
  },
  {
    Id: 3,
    ShortName: "SE BankID AD",
    FullName: "Swedish BankID Another Device",
    AcrValues: "urn:grn:authn:se:bankid:another-device",
    isForIFrame: true
  },
  {
    Id: 4,
    ShortName: "DK NemID PCC",
    FullName: "Danish NemID Personal with code card",
    AcrValues: "urn:grn:authn:dk:nemid:poces",
    isForIFrame: true
  },
  {
    Id: 5,
    ShortName: "DK NemID ECC",
    FullName: "Danish NemID Employee with code card",
    AcrValues: "urn:grn:authn:dk:nemid:moces",
    isForIFrame: true
  },
  {
    Id: 6,
    ShortName: "DK NemID ECF",
    FullName: "Danish NemID Employee with code file",
    AcrValues: "urn:grn:authn:dk:nemid:moces:codefile",
    isForIFrame: true
  },
  {
    Id: 7,
    ShortName: "FI e-ID BankID",
    FullName: "Finish e-ID - BankID",
    AcrValues: "urn:grn:authn:fi:bankid",
    isForIFrame: false
  },
  {
    Id: 8,
    ShortName: "FI e-ID MC",
    FullName: "Finish e-ID - Mobile certificate",
    AcrValues: "urn:grn:authn:fi:mobile-id",
    isForIFrame: true
  },
  {
    Id: 9,
    ShortName: "FI e-ID ALL",
    FullName: "Finish e-ID - ALL",
    AcrValues: "urn:grn:authn:fi:all",
    isForIFrame: true
  }
];