process.env.NTBA_FIX_319 = 1;
const { debug, info, error, warn } = require("firebase-functions/lib/logger");
const Telegram = require("node-telegram-bot-api");
const { db } = require("./api/firebase");
const { bots } = require("./config");

async function forwardPost(post, botConfig) {
  const telegram = new Telegram(botConfig.telegram.botToken);
  const postsIdCollection = db.collection("postsId");
  const restrictionsCollection = db.collection("restrictions");
  let restrictions = null;

  // check for post id in collection postsId
  // and if it is there then do nothing and leave
  // or if it is not there then add new post id and continue
  //   try {
  //     const postsIdSnapshot = await postsIdCollection
  //       .where("id", "==", post.id)
  //       .get();
  //     if (!postsIdSnapshot.empty) {
  //       warn("post duplication");
  //       return null;
  //     }
  //     await postsIdCollection.add({ id: post.id });
  //   } catch (err) {
  //     error(err);
  //   }

  // get bot restrictions
  try {
    const restrictionsSnapshot = await restrictionsCollection
      .where("botName", "==", botConfig.name)
      .get();
    if (!restrictionsSnapshot.empty) {
      restrictions = restrictionsSnapshot.docs[0].data();
    }
  } catch (err) {
    error(err);
  }

  if (isAllowedToSend(post, restrictions)) {
    sendMessage(botConfig.telegram.channelId, post, restrictions);
  }

  // checking for restrictions and allowing to send the message
  function isAllowedToSend(post, restrictions) {
    if (!restrictions) return true;

    // check for a video
    if (typeof restrictions.allowVideo !== "undefined" && post.attachments) {
      for (let attachment of post.attachments) {
        if (attachment.type === "video") {
          info("allowVideo", restrictions.allowVideo);
          return restrictions.allowVideo;
        }
      }
    }

    // check for tags
    if (restrictions.allowedTags || restrictions.deniedTags) {
      let text = post.text.toLowerCase();
      if (restrictions.allowedTags) {
        for (let tag of restrictions.allowedTags) {
          if (new RegExp(tag.toLowerCase()).test(text)) {
            info("allowedTags", tag);
            return true;
          }
        }
      }
      if (restrictions.deniedTags) {
        for (let tag of restrictions.deniedTags) {
          if (new RegExp(tag.toLowerCase()).test(text)) {
            info("deniedTags", tag);
            return false;
          }
        }
      }
    }

    // check for authors
    if (restrictions.allowedAuthors && post.created_by) {
      info(
        "allowedAuthors",
        restrictions.allowedAuthors.includes(post.created_by)
      );
      return restrictions.allowedAuthors.includes(post.created_by);
    }

    //  check if posts are restricted(boolean)
    if (typeof restrictions.restrictedPosts !== "undefined") {
      info("restrictedPosts", !restrictions.restrictedPosts);
      return !restrictions.restrictedPosts;
    }

    return true;
  }

  async function sendMessage(channelId, post, restrictions) {
    const options = {
      parse_mode: "HTML",
    };

    // check if multiple photos in post and send them as media group
    if (post.attachments && post.attachments.length > 1) {
      let attachments = post.attachments
        .filter((attachment) => attachment.type !== "video")
        .map(({ photo }) => {
          return {
            type: "photo",
            media: photo.sizes.find(
              (size) =>
                size.width === Math.max(...photo.sizes.map((s) => s.width), 0)
            ).url,
          };
        });

      if (attachments.length > 10) {
        attachments = attachments.slice(0, 10);
      }
      if (post.text.length <= 1024) {
        attachments[0].caption = post.text;
        await telegram.sendMediaGroup(-channelId, attachments, {
          disable_notification: false,
        });
      } else {
        attachments[0].caption = post.text.slice(0, 1024);
        textChunks = chunkSubstr(post.text.slice(1024), 4096);
        await telegram.sendMediaGroup(-channelId, attachments, {
          disable_notification: false,
        });
        for (textChunk of textChunks) {
          await telegram.sendMessage(-channelId, textChunk, {
            disable_notification: true,
            ...options,
          });
        }
      }
      return;
    }

    if (
      post.attachments &&
      post.attachments.length === 1 &&
      post.attachments[0].type === "photo"
    ) {
      const photo = post.attachments[0].photo;
      const photoUrl = photo.sizes.find(
        (size) => size.width === Math.max(...photo.sizes.map((s) => s.width), 0)
      ).url;

      await telegram.sendPhoto(-channelId, photoUrl, {
        caption: post.text.slice(0, 1024),
        disable_notification: false,
      });

      if (post.text.length > 1024) {
        textChunks = chunkSubstr(post.text.slice(1024), 4096);
        for (textChunk of textChunks) {
          await telegram.sendMessage(-channelId, textChunk, {
            disable_notification: true,
            ...options,
          });
        }
      }
      return;
    }

    if (post.text.length > 4096) {
      await telegram.sendMessage(-channelId, post.text.slice(0, 4096), {
        disable_notification: false,
        ...options,
      });
      textChunks = chunkSubstr(post.text.slice(4096), 4096);
      for (textChunk of textChunks) {
        await telegram.sendMessage(-channelId, textChunk, {
          disable_notification: true,
          ...options,
        });
      }
      return;
    }

    await telegram.sendMessage(-channelId, post.text, options);
  }
}

function chunkSubstr(str, size) {
  const numChunks = Math.ceil(str.length / size);
  const chunks = new Array(numChunks);

  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = str.substr(o, size);
  }

  return chunks;
}

module.exports = forwardPost;
