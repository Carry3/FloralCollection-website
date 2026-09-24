/** 联系方式与社交媒体 —— 客户文档《Website Overview》指定 */
export const CONTACT = {
    email: "Contact@thefloralcollections.com",
    phone: "+1 (954) 218-4569",
    phoneHref: "tel:+19542184569",
    smsHref: "sms:+19542184569",
    area: "South Florida",
    hours: "8am - 7:30pm",
};

/** TODO: 客户尚未提供各平台账号链接，拿到后替换 href */
export const SOCIAL_LINKS = [
    { label: "Facebook", href: "https://www.facebook.com/" },
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "Twitter", href: "https://x.com/" },
    { label: "TikTok", href: "https://www.tiktok.com/" },
    { label: "YouTube", href: "https://www.youtube.com/" },
    { label: "Snapchat", href: "https://www.snapchat.com/" },
] as const;
