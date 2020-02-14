const confirmation = {
  type: "confirmation",
  group_id: 22222,
  secret: "secret"
};

const wrongConfirmation = {
  type: "confirmation",
  group_id: 22222,
  secret: "wrongsecret"
};

const post = {
  type: "wall_post_new",
  object: {
    id: 142,
    from_id: -22222,
    owner_id: -22222,
    date: 1581499661,
    marked_as_ads: 0,
    post_type: "post",
    text: "post",
    signer_id: 11111,
    can_edit: 1,
    created_by: 11111,
    can_delete: 1,
    comments: {
      count: 0
    },
    is_favorite: false
  },
  group_id: 22222,
  event_id: "2e75f9a82172073bb73e7bcc8e74094e237cb0dd",
  secret: "secret"
};
const postPicture = {
  type: "wall_post_new",
  object: {
    id: 143,
    from_id: -22222,
    owner_id: -22222,
    date: 1581499677,
    marked_as_ads: 0,
    post_type: "post",
    text: "postPicture",
    signer_id: 11111,
    can_edit: 1,
    created_by: 11111,
    can_delete: 1,
    attachments: [
      {
        type: "photo",
        photo: {
          id: 457243812,
          album_id: -7,
          owner_id: 11111,
          sizes: [
            {
              type: "m",
              url:
                "https://sun9-5.userapi.com/c205128/v205128105/39c06/kTB6Oc7H2jE.jpg",
              width: 130,
              height: 93
            },
            {
              type: "o",
              url:
                "https://sun9-27.userapi.com/c205128/v205128105/39c0a/VzFdu95_sKc.jpg",
              width: 130,
              height: 93
            },
            {
              type: "p",
              url:
                "https://sun9-7.userapi.com/c205128/v205128105/39c0b/u5oYOZj-gn4.jpg",
              width: 200,
              height: 143
            },
            {
              type: "q",
              url:
                "https://sun9-66.userapi.com/c205128/v205128105/39c0c/OmSVKDzro34.jpg",
              width: 320,
              height: 229
            },
            {
              type: "r",
              url:
                "https://sun9-67.userapi.com/c205128/v205128105/39c0d/PzFpYmdS9x4.jpg",
              width: 510,
              height: 365
            },
            {
              type: "s",
              url:
                "https://sun9-43.userapi.com/c205128/v205128105/39c05/xTHhwmzolHQ.jpg",
              width: 75,
              height: 54
            },
            {
              type: "x",
              url:
                "https://sun9-35.userapi.com/c205128/v205128105/39c07/sYFYHtaG5mY.jpg",
              width: 604,
              height: 433
            },
            {
              type: "y",
              url:
                "https://sun9-54.userapi.com/c205128/v205128105/39c08/OJUeauSUbAI.jpg",
              width: 807,
              height: 578
            },
            {
              type: "z",
              url:
                "https://sun9-8.userapi.com/c205128/v205128105/39c09/-XXZYob5QUs.jpg",
              width: 1024,
              height: 733
            }
          ],
          text: "",
          date: 1579039148,
          access_key: "cf3e4595d44cb7bb99"
        }
      }
    ],
    comments: {
      count: 0
    },
    is_favorite: false
  },
  group_id: 22222,
  event_id: "a7bdf9a707ba8fe5c39097859c8b8572195f2694",
  secret: "secret"
};
const postVideo = {
  type: "wall_post_new",
  object: {
    id: 144,
    from_id: -22222,
    owner_id: -22222,
    date: 1581499701,
    marked_as_ads: 0,
    post_type: "post",
    text: "postVideo",
    signer_id: 11111,
    can_edit: 1,
    created_by: 11111,
    can_delete: 1,
    attachments: [
      {
        type: "video",
        video: {
          access_key: "bf896d9a6fe043e253",
          can_comment: 1,
          can_edit: 1,
          can_like: 1,
          can_repost: 1,
          can_subscribe: 1,
          can_add_to_faves: 1,
          can_add: 1,
          can_attach_link: 1,
          comments: 0,
          date: 1581499700,
          description: "",
          duration: 12,
          image: [
            {
              height: 96,
              url:
                "https://sun9-20.userapi.com/c855124/v855124946/1f04ca/3I1rOmNahSM.jpg",
              width: 130,
              with_padding: 1
            },
            {
              height: 120,
              url:
                "https://sun9-31.userapi.com/c855124/v855124946/1f04c9/wzUDPan7VMo.jpg",
              width: 160,
              with_padding: 1
            },
            {
              height: 240,
              url:
                "https://sun9-3.userapi.com/c855124/v855124946/1f04c8/lFBh49ZYnlU.jpg",
              width: 320,
              with_padding: 1
            },
            {
              height: 450,
              url:
                "https://sun9-63.userapi.com/c855124/v855124946/1f04c2/ZWWg0VmfkhY.jpg",
              width: 800,
              with_padding: 1
            },
            {
              height: 720,
              url:
                "https://sun9-5.userapi.com/c855124/v855124946/1f04c3/IRUywaShMg8.jpg",
              width: 1280
            },
            {
              height: 180,
              url:
                "https://sun9-64.userapi.com/c855124/v855124946/1f04c4/GbPFEmtIPHk.jpg",
              width: 320
            },
            {
              height: 405,
              url:
                "https://sun9-58.userapi.com/c855124/v855124946/1f04c5/iNlSZjihVvM.jpg",
              width: 720
            },
            {
              height: 576,
              url:
                "https://sun9-70.userapi.com/c855124/v855124946/1f04c6/CGC2vKqd0AM.jpg",
              width: 1024
            },
            {
              height: 2304,
              url:
                "https://sun9-4.userapi.com/c855124/v855124946/1f04c7/0jiP2iZJgds.jpg",
              width: 4096
            }
          ],
          first_frame: [
            {
              height: 450,
              url:
                "https://sun9-2.userapi.com/c855332/v855332946/1fe666/PhxXAc-h01w.jpg",
              width: 800
            },
            {
              height: 720,
              url:
                "https://sun9-45.userapi.com/c855332/v855332946/1fe667/XHWR6wlk6UI.jpg",
              width: 1280
            },
            {
              height: 180,
              url:
                "https://sun9-18.userapi.com/c855332/v855332946/1fe668/U_kv6jLObaE.jpg",
              width: 320
            },
            {
              height: 405,
              url:
                "https://sun9-38.userapi.com/c855332/v855332946/1fe669/0-7lX-Qzxmw.jpg",
              width: 720
            },
            {
              height: 576,
              url:
                "https://sun9-16.userapi.com/c855332/v855332946/1fe66a/Gn2SuVjinWw.jpg",
              width: 1024
            },
            {
              height: 2304,
              url:
                "https://sun9-26.userapi.com/c855332/v855332946/1fe66b/KGDPO3UrIVA.jpg",
              width: 4096
            },
            {
              height: 180,
              url:
                "https://sun9-59.userapi.com/c855332/v855332946/1fe66c/BZ3rfYlRx5g.jpg",
              width: 320
            },
            {
              height: 90,
              url:
                "https://sun9-65.userapi.com/c855332/v855332946/1fe66d/Tm7VAeTEBjQ.jpg",
              width: 160
            },
            {
              height: 73,
              url:
                "https://sun9-20.userapi.com/c855332/v855332946/1fe66e/6BdnbwLqdts.jpg",
              width: 130
            }
          ],
          width: 640,
          height: 360,
          id: 456239019,
          owner_id: -22222,
          user_id: 11111,
          title: "Без названия",
          is_favorite: 0,
          track_code:
            "video_38274709MBi0QEnZ7IifPpx5BCbt08cnkiVVPZqptQoDggvYXtUDNahAQd_kipxYnnlvEtjl9RSr",
          type: "video",
          views: 1
        }
      }
    ],
    comments: {
      count: 0
    },
    is_favorite: false
  },
  group_id: 22222,
  event_id: "6e6892564117b30f576e3b5166a629d0822962ff",
  secret: "secret"
};
const postPictureAndVideo = {
  type: "wall_post_new",
  object: {
    id: 145,
    from_id: -22222,
    owner_id: -22222,
    date: 1581499725,
    marked_as_ads: 0,
    post_type: "post",
    text: "postPictureAndVideo",
    signer_id: 11111,
    can_edit: 1,
    created_by: 11111,
    can_delete: 1,
    attachments: [
      {
        type: "photo",
        photo: {
          id: 239072007,
          album_id: -6,
          owner_id: 11111,
          sizes: [
            {
              type: "s",
              url:
                "https://sun9-64.userapi.com/c10147/u11111/-6/s_1b709856.jpg",
              width: 0,
              height: 0
            },
            {
              type: "m",
              url:
                "https://sun9-64.userapi.com/c10147/u11111/-6/m_663bc163.jpg",
              width: 0,
              height: 0
            },
            {
              type: "x",
              url:
                "https://sun9-64.userapi.com/c10147/u11111/-6/x_173a8394.jpg",
              width: 0,
              height: 0
            }
          ],
          text: "",
          date: 1301005180,
          post_id: 78
        }
      },
      {
        type: "video",
        video: {
          access_key: "7a4bf6cb0081741a10",
          can_comment: 1,
          can_edit: 1,
          can_like: 1,
          can_repost: 1,
          can_subscribe: 1,
          can_add_to_faves: 1,
          can_add: 1,
          can_attach_link: 1,
          comments: 0,
          date: 1581499724,
          description: "",
          duration: 12,
          image: [
            {
              height: 96,
              url:
                "https://sun9-20.userapi.com/c855124/v855124946/1f04ca/3I1rOmNahSM.jpg",
              width: 130,
              with_padding: 1
            },
            {
              height: 120,
              url:
                "https://sun9-31.userapi.com/c855124/v855124946/1f04c9/wzUDPan7VMo.jpg",
              width: 160,
              with_padding: 1
            },
            {
              height: 240,
              url:
                "https://sun9-3.userapi.com/c855124/v855124946/1f04c8/lFBh49ZYnlU.jpg",
              width: 320,
              with_padding: 1
            },
            {
              height: 450,
              url:
                "https://sun9-63.userapi.com/c855124/v855124946/1f04c2/ZWWg0VmfkhY.jpg",
              width: 800,
              with_padding: 1
            },
            {
              height: 720,
              url:
                "https://sun9-5.userapi.com/c855124/v855124946/1f04c3/IRUywaShMg8.jpg",
              width: 1280
            },
            {
              height: 180,
              url:
                "https://sun9-64.userapi.com/c855124/v855124946/1f04c4/GbPFEmtIPHk.jpg",
              width: 320
            },
            {
              height: 405,
              url:
                "https://sun9-58.userapi.com/c855124/v855124946/1f04c5/iNlSZjihVvM.jpg",
              width: 720
            },
            {
              height: 576,
              url:
                "https://sun9-70.userapi.com/c855124/v855124946/1f04c6/CGC2vKqd0AM.jpg",
              width: 1024
            },
            {
              height: 2304,
              url:
                "https://sun9-4.userapi.com/c855124/v855124946/1f04c7/0jiP2iZJgds.jpg",
              width: 4096
            }
          ],
          first_frame: [
            {
              height: 450,
              url:
                "https://sun9-2.userapi.com/c855332/v855332946/1fe666/PhxXAc-h01w.jpg",
              width: 800
            },
            {
              height: 720,
              url:
                "https://sun9-45.userapi.com/c855332/v855332946/1fe667/XHWR6wlk6UI.jpg",
              width: 1280
            },
            {
              height: 180,
              url:
                "https://sun9-18.userapi.com/c855332/v855332946/1fe668/U_kv6jLObaE.jpg",
              width: 320
            },
            {
              height: 405,
              url:
                "https://sun9-38.userapi.com/c855332/v855332946/1fe669/0-7lX-Qzxmw.jpg",
              width: 720
            },
            {
              height: 576,
              url:
                "https://sun9-16.userapi.com/c855332/v855332946/1fe66a/Gn2SuVjinWw.jpg",
              width: 1024
            },
            {
              height: 2304,
              url:
                "https://sun9-26.userapi.com/c855332/v855332946/1fe66b/KGDPO3UrIVA.jpg",
              width: 4096
            },
            {
              height: 180,
              url:
                "https://sun9-59.userapi.com/c855332/v855332946/1fe66c/BZ3rfYlRx5g.jpg",
              width: 320
            },
            {
              height: 90,
              url:
                "https://sun9-65.userapi.com/c855332/v855332946/1fe66d/Tm7VAeTEBjQ.jpg",
              width: 160
            },
            {
              height: 73,
              url:
                "https://sun9-20.userapi.com/c855332/v855332946/1fe66e/6BdnbwLqdts.jpg",
              width: 130
            }
          ],
          width: 640,
          height: 360,
          id: 456239020,
          owner_id: -22222,
          user_id: 11111,
          title: "Без названия",
          is_favorite: 0,
          track_code:
            "video_2bea5334I71s2524NnHbwQnzsQZsRGQd34NkE0AvzPTvJc04tXsQkHDblb4-c9inC_PbMllyVi7m",
          type: "video",
          views: 1
        }
      }
    ],
    comments: {
      count: 0
    },
    is_favorite: false
  },
  group_id: 22222,
  event_id: "becd61b5dc77f2a3c9a24bf9ee8918f98d4d871c",
  secret: "secret"
};
const postAllowedTag = {
  type: "wall_post_new",
  object: {
    id: 149,
    from_id: -22222,
    owner_id: -22222,
    date: 1581499900,
    marked_as_ads: 0,
    post_type: "post",
    text: "postAllowedTag someallowedtag",
    signer_id: 11111,
    can_edit: 1,
    created_by: 11111,
    can_delete: 1,
    comments: {
      count: 0
    },
    is_favorite: false
  },
  group_id: 22222,
  event_id: "aea58390971d8e9b752546b24073ad30c4fad6f2",
  secret: "secret"
};
const postAllowedTagAndDeniedTag = {
  type: "wall_post_new",
  object: {
    id: 149,
    from_id: -22222,
    owner_id: -22222,
    date: 1581499900,
    marked_as_ads: 0,
    post_type: "post",
    text: "postAllowedTag someallowedtag",
    signer_id: 11111,
    can_edit: 1,
    created_by: 11111,
    can_delete: 1,
    comments: {
      count: 0
    },
    is_favorite: false
  },
  group_id: 22222,
  event_id: "aea58390971d8e9b752546b24073ad30c4fad6f2",
  secret: "secret"
};
const postDeniedTag = {
  type: "wall_post_new",
  object: {
    id: 148,
    from_id: -22222,
    owner_id: -22222,
    date: 1581499822,
    marked_as_ads: 0,
    post_type: "post",
    text: "postDeniedTag sometag",
    signer_id: 11111,
    can_edit: 1,
    created_by: 11111,
    can_delete: 1,
    comments: {
      count: 0
    },
    is_favorite: false
  },
  group_id: 22222,
  event_id: "1baf3d886b091a6fd4377bcd3556b7daa1d3ffd1",
  secret: "secret"
};
const postAllowedAuthor = {
  type: "wall_post_new",
  object: {
    id: 146,
    from_id: -22222,
    owner_id: -22222,
    date: 1581499737,
    marked_as_ads: 0,
    post_type: "post",
    text: "postAllowedAuthor",
    signer_id: 11111,
    can_edit: 1,
    created_by: 11111,
    can_delete: 1,
    comments: {
      count: 0
    },
    is_favorite: false
  },
  group_id: 22222,
  event_id: "da3f3c7b6799e6cd1f1d5a69c9d6c6a1b61cd98d",
  secret: "secret"
};
const postDeniedAuthor = {
  type: "wall_post_new",
  object: {
    id: 147,
    from_id: -22222,
    owner_id: -22222,
    date: 1581499766,
    marked_as_ads: 0,
    post_type: "post",
    text: "postDeniedAuthor",
    signer_id: 99999,
    can_edit: 1,
    created_by: 99999,
    can_delete: 1,
    comments: {
      count: 0
    },
    is_favorite: false
  },
  group_id: 22222,
  event_id: "b20f238804e63e8930ef196be329ffe390286abe",
  secret: "secret"
};

const postDeniedAuthorWithAllowedTag = {
  type: "wall_post_new",
  object: {
    id: 147,
    from_id: -22222,
    owner_id: -22222,
    date: 1581499766,
    marked_as_ads: 0,
    post_type: "post",
    text: "postDeniedAuthor someallowedtag",
    signer_id: 99999,
    can_edit: 1,
    created_by: 99999,
    can_delete: 1,
    comments: {
      count: 0
    },
    is_favorite: false
  },
  group_id: 22222,
  event_id: "b20f238804e63e8930ef196be329ffe390286abe",
  secret: "secret"
};

const postLongWithPicture = {
  type: "wall_post_new",
  object: {
    id: 143,
    from_id: -22222,
    owner_id: -22222,
    date: 1581499677,
    marked_as_ads: 0,
    post_type: "post",
    text:
      "postLongWithPicture Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    signer_id: 11111,
    can_edit: 1,
    created_by: 11111,
    can_delete: 1,
    attachments: [
      {
        type: "photo",
        photo: {
          id: 457243812,
          album_id: -7,
          owner_id: 11111,
          sizes: [
            {
              type: "m",
              url:
                "https://sun9-5.userapi.com/c205128/v205128105/39c06/kTB6Oc7H2jE.jpg",
              width: 130,
              height: 93
            },
            {
              type: "o",
              url:
                "https://sun9-27.userapi.com/c205128/v205128105/39c0a/VzFdu95_sKc.jpg",
              width: 130,
              height: 93
            },
            {
              type: "p",
              url:
                "https://sun9-7.userapi.com/c205128/v205128105/39c0b/u5oYOZj-gn4.jpg",
              width: 200,
              height: 143
            },
            {
              type: "q",
              url:
                "https://sun9-66.userapi.com/c205128/v205128105/39c0c/OmSVKDzro34.jpg",
              width: 320,
              height: 229
            },
            {
              type: "r",
              url:
                "https://sun9-67.userapi.com/c205128/v205128105/39c0d/PzFpYmdS9x4.jpg",
              width: 510,
              height: 365
            },
            {
              type: "s",
              url:
                "https://sun9-43.userapi.com/c205128/v205128105/39c05/xTHhwmzolHQ.jpg",
              width: 75,
              height: 54
            },
            {
              type: "x",
              url:
                "https://sun9-35.userapi.com/c205128/v205128105/39c07/sYFYHtaG5mY.jpg",
              width: 604,
              height: 433
            },
            {
              type: "y",
              url:
                "https://sun9-54.userapi.com/c205128/v205128105/39c08/OJUeauSUbAI.jpg",
              width: 807,
              height: 578
            },
            {
              type: "z",
              url:
                "https://sun9-8.userapi.com/c205128/v205128105/39c09/-XXZYob5QUs.jpg",
              width: 1024,
              height: 733
            }
          ],
          text: "",
          date: 1579039148,
          access_key: "cf3e4595d44cb7bb99"
        }
      }
    ],
    comments: {
      count: 0
    },
    is_favorite: false
  },
  group_id: 22222,
  event_id: "a7bdf9a707ba8fe5c39097859c8b8572195f2694",
  secret: "secret"
};

const postUnknownAuthor = {
  type: "wall_post_new",
  object: {
    id: 147,
    from_id: -22222,
    owner_id: -22222,
    date: 1581499766,
    marked_as_ads: 0,
    post_type: "post",
    text: "postUnknownAuthor",
    signer_id: 67777788,
    can_edit: 1,
    created_by: 67777788,
    can_delete: 1,
    comments: {
      count: 0
    },
    is_favorite: false
  },
  group_id: 22222,
  event_id: "b20f238804e63e8930ef196be329ffe390286abe",
  secret: "secret"
};

const postUnknownAuthorWithAllowedTag = {
  type: "wall_post_new",
  object: {
    id: 147,
    from_id: -22222,
    owner_id: -22222,
    date: 1581499766,
    marked_as_ads: 0,
    post_type: "post",
    text: "postUnknownAuthor someallowedtag",
    signer_id: 67777788,
    can_edit: 1,
    created_by: 67777788,
    can_delete: 1,
    comments: {
      count: 0
    },
    is_favorite: false
  },
  group_id: 22222,
  event_id: "b20f238804e63e8930ef196be329ffe390286abe",
  secret: "secret"
};

module.exports = {
  confirmation,
  wrongConfirmation,
  post,
  postPicture,
  postVideo,
  postPictureAndVideo,
  postAllowedAuthor,
  postDeniedAuthor,
  postLongWithPicture,
  postUnknownAuthor
};
