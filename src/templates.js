import socialProfilePicture from "./assets/previews/social_profile_pic.png";

const TEMPLATES = {
  social_profile_picture: {
    name: "Rámeček pro sociální sítě",
    image: socialProfilePicture,
    path: "/",
    /* path: "/nakopneme-basic-photo-banner", */
    component: () =>
      import(
        "./views/social_profile_pic/SocialProfilePicture.vue"
      ),
    meta: {
      title: "Rámeček pro sociální sítě",
    },
  },

  /*
  
    NOTE: They don't want it anymore I guess.
  
    */

  /* urgent_text_banner: {
    name: "Urgentní banner pouze s textem",
    image: urgentTextBannerImage,
    path: "/urgent-text-banner",
    component: () => import("./views/urgent_text_banner/UrgentTextBanner.vue"),
    meta: {
      title: "Urgentní banner pouze s textem",
    },
  },
  text_banner: {
    name: "Banner pouze s textem",
    image: textBannerImage,
    path: "/text-banner",
    component: () => import("./views/text_banner/TextBanner.vue"),
    meta: {
      title: "Banner pouze s textem",
    },
  },
  newspaper_quote_bottom: {
    name: "Novinová citace s obrázkem",
    image: newspaperQuoteBottomImage,
    path: "/newspaper-quote-bottom",
    component: () =>
      import("./views/newspaper_quote_bottom/NewspaperQuoteBottom.vue"),
    meta: {
      title: "Novinová citace s obrázkem",
    },
  },
  newspaper_quote_middle: {
    name: "Novinová citace - pouze text",
    image: newspaperQuoteMiddleImage,
    path: "/newspaper-quote-middle",
    component: () =>
      import("./views/newspaper_quote_middle/NewspaperQuoteMiddle.vue"),
    meta: {
      title: "Novinová citace - pouze text",
    },
  },
  facebook_survey: {
    name: "Facebook anketa",
    image: facebookSurveyImage,
    path: "/facebook-survey",
    component: () => import("./views/facebook_survey/FacebookSurvey.vue"),
    meta: {
      title: "Facebook anketa",
    },
  },
  poster: {
    name: "Plakát",
    image: posterImage,
    path: "/poster",
    component: () => import("./views/poster/Poster.vue"),
    meta: {
      title: "Plakát",
    },
  },
  event_poster: {
    name: "Plakát - událost",
    image: eventPosterImage,
    path: "/event-poster",
    component: () => import("./views/event_poster/EventPoster.vue"),
    meta: {
      title: "Plakát - událost",
    },
  },
  twitter_banner: {
    name: "Twitter banner",
    image: twitterBannerImage,
    path: "/twitter-banner",
    component: () => import("./views/twitter_banner/TwitterBanner.vue"),
    meta: {
      title: "Twitter banner",
    },
  },
  regional_success: {
    name: "Povedlo se v kraji",
    image: regionalSuccessImage,
    path: "/regional-success",
    component: () => import("./views/regional_success/RegionalSuccess.vue"),
    meta: {
      title: "Povedlo se v kraji",
    },
  },
  base_event: {
    name: "Událost - pouze text, vprostřed",
    image: baseEventImage,
    path: "/base-event",
    component: () => import("./views/base_event/BaseEvent.vue"),
    meta: {
      title: "Událost - pouze text, vprostřed",
    },
  },
  right_event: {
    name: "Událost - pouze text, vpravo",
    image: rightEventImage,
    path: "/right-event",
    component: () => import("./views/right_event/RightEvent.vue"),
    meta: {
      title: "Událost - pouze text, vpravo",
    },
  },
  angle_event_right: {
    name: "Událost - pruh pod úhlem, vpravo",
    image: angleEventRightImage,
    path: "/angle-event-right",
    component: () => import("./views/angle_event_right/AngleEventRight.vue"),
    meta: {
      title: "Událost - pruh pod úhlem, vpravo",
    },
  },
  angle_event_left: {
    name: "Událost - pruh pod úhlem, vlevo",
    image: angleEventLeftImage,
    path: "/angle-event-left",
    component: () => import("./views/angle_event_left/AngleEventLeft.vue"),
    meta: {
      title: "Událost - pruh pod úhlem, vlevo",
    },
  },

  social_cover_large_text: {
    name: "Cover na sociální sítě - velký text",
    image: socialCoverLargeTextImage,
    path: "/social-cover-large-text",
    component: () =>
      import("./views/social_cover_large_text/SocialCoverLargeText.vue"),
    meta: {
      title: "Cover na sociální sítě - velký text",
    },
  },

  reel: {
    name: "Reel na sociální sítě",
    image: reelImage,
    path: "/reel",
    component: () => import("./views/reel/Reel.vue"),
    meta: {
      title: "Reel na sociální sítě",
    },
  }, */

  // NOTE: The following 2 templates have been disabled on request.
  // people_banner_with_predefined_text: {
  //   name: 'Osoba v šipce s textem "Odvaha pro Evropu"',
  //   image: peopleBannerWithPredefinedTextImage,
  //   path: "/people-banner-with-predefined-text",
  //   component: () =>
  //     import(
  //       "./views/people_banner_with_predefined_text/PeopleBannerWithPredefinedText.vue"
  //     ),
  //   meta: {
  //     title: 'Osoba v šipce s textem "Odvaha pro Evropu"',
  //   },
  // },
  // people_banner_with_custom_text: {
  //   name: "Osoba v šipce s vlastním textem",
  //   image: peopleBannerWithCustomTextImage,
  //   path: "/people-banner-with-custom-text",
  //   component: () =>
  //     import(
  //       "./views/people_banner_with_custom_text/PeopleBannerWithCustomText.vue"
  //     ),
  //   meta: {
  //     title: "Osoba v šipce s vlastním textem",
  //   },
  // },

  // base_person_event: {
  //   name: "Událost - text a obrázek na pozadí, vprostřed",
  //   image: basePersonEventImage,
  //   path: "/base-person-event",
  //   component: () => import("./views/base_person_event/BasePersonEvent.vue"),
  //   meta: {
  //     title: "Událost - text a obrázek na pozadí, vprostřed",
  //   },
  // },
  // right_person_event: {
  //   name: "Událost - text a obrázek na pozadí, vpravo",
  //   image: rightPersonEventImage,
  //   path: "/right-person-event",
  //   component: () => import("./views/right_person_event/RightPersonEvent.vue"),
  //   meta: {
  //     title: "Událost - text a obrázek na pozadí, vpravo",
  //   },
  // },
  // angle_person_event_right: {
  //   name: "Událost - pruh pod úhlem s obrázkem na pozadí, vpravo",
  //   image: anglePersonEventRightImage,
  //   path: "/angle-person-event-right",
  //   component: () =>
  //     import("./views/angle_person_event_right/AnglePersonEventRight.vue"),
  //   meta: {
  //     title: "Událost - pruh pod úhlem s obrázkem na pozadí, vpravo",
  //   },
  // },
  // angle_person_event_left: {
  //   name: "Událost - pruh pod úhlem s obrázkem na pozadí, vlevo",
  //   image: anglePersonEventLeftImage,
  //   path: "/angle-person-event-left",
  //   component: () =>
  //     import("./views/angle_person_event_left/AnglePersonEventLeft.vue"),
  //   meta: {
  //     title: "Událost - pruh pod úhlem s obrázkem na pozadí, vlevo",
  //   },
  // },
};

export default TEMPLATES;
