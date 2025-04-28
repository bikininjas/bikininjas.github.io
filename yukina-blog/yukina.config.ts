import I18nKeys from "./src/locales/keys";
import type { Configuration } from "./src/types/config";

const YukinaConfig: Configuration = {
  title: "Bikininjas",
  subTitle: "Bikininjas Blog",
  brandTitle: "Bikininjas",

  description: "Demo Site",

  site: "https://bikininjas.github.io",

  locale: "en", // set for website language and date format

  navigators: [
    {
      nameKey: I18nKeys.nav_bar_home,
      href: "/",
    },
    {
      nameKey: I18nKeys.nav_bar_archive,
      href: "/archive",
    },
    {
      nameKey: I18nKeys.nav_bar_about,
      href: "/about",
    },
    {
      nameKey: I18nKeys.nav_bar_github,
      href: "https://github.com/SebPikPik",
    },
  ],

  username: "Bikininjas",
  sign: "100% des gagnants ont tenté leur chance",
  avatarUrl: "https://robertsspaceindustries.com/media/o8yk577me0mvpr/heap_infobox/2020-11-07-20_15_58-Window.png",
  socialLinks: [
    {
      icon: "line-md:github-loop",
      link: "https://github.com/bikininjas",
    },
    {
      icon: "heroicons:chat-bubble-left-ellipsis",
      link: "https://x.com/SebPikPik",
    },
    {
      icon: "heroicons:play-circle",
      link: "https://www.twitch.tv/redpikpik",
    },
  ],
  maxSidebarCategoryChip: 6, // It is recommended to set it to a common multiple of 2 and 3
  maxSidebarTagChip: 12,
  maxFooterCategoryChip: 6,
  maxFooterTagChip: 24,

  banners: [
    "https://pbs.twimg.com/media/Gpj4qYeWEAAp9Xk?format=jpg&name=4096x4096",
    "https://pbs.twimg.com/media/Go849RobYAExzi_?format=jpg&name=4096x4096",
    "https://pbs.twimg.com/media/Go010LwWkAAvEHA?format=jpg&name=4096x4096",
    "https://pbs.twimg.com/media/Gpj6IIVXoAAZkoZ?format=jpg&name=4096x4096",
    "https://pbs.twimg.com/media/GjskJKdacAA67I9?format=jpg&name=4096x4096",
    "https://pbs.twimg.com/media/GomGfGZWkAAvQRk?format=jpg&name=4096x4096",
    "https://pbs.twimg.com/media/GpJbIl9W0AET5rK?format=jpg&name=4096x4096",
    "https://pbs.twimg.com/media/GowCXb7XEAA521n?format=jpg&name=4096x4096",
  ],

  slugMode: "HASH", // 'RAW' | 'HASH'

  license: {
    name: "CC BY-NC-SA 4.0",
    url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
  },

  // WIP functions
  bannerStyle: "LOOP", // 'loop' | 'static' | 'hidden'
};

export default YukinaConfig;
