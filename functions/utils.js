function getBotByName(db, botName) {
  const bots = db.collection("bots");
  return new Promise((resolve, reject) => {
    bots
      .where("name", "==", botName)
      .get()
      .then(snap => {
        if (snap.empty) {
          console.log("No matching bots.");
          reject("No matching bots.");
        }
        snap.forEach(doc => {
          resolve(doc.data());
        });
      });
  });
}

function removeTagsFromPost(post, tags) {
  for (let tag of tags) {
    post.text = post.text.replace(tag, "");
  }
  return post;
}

function getPreviewFromPost(post) {
  if (!post.attachments || !post.attachments.length) return "";
  for (let attach of post.attachments) {
    switch (attach.type) {
      case "photo":
        const photo = attach.photo;
        // get original photo size url
        const url = photo.sizes.find(
          size => size.width === Math.max(...photo.sizes.map(s => s.width), 0)
        ).url;
        return {
          type: attach.type,
          url
        };
      case "doc":
        const doc = attach.doc;
        if (doc.ext === "gif") {
          return {
            type: attach.type,
            url: doc.url
          };
        } else {
          console.error(`Unhandled attachment doc type extention`);
          console.error(doc);
          return "";
        }
      default:
        console.error(`Unhandled attachment type`);
        console.error(attach);
        return "";
    }
  }
}

async function sendPost(post, telegramChannelId, telegramAPI) {
  let text = post.text;
  if (text.length > 0) {
    try {
      await telegramAPI.sendMessage(-telegramChannelId, text, {
        parse_mode: "HTML"
      });
    } catch (error) {
      console.error(error);
    }
  }
}

function sendPostWithPreview(post, preview, telegramChannelId, telegramAPI) {
  let text = post.text;
  if (text.length <= 1024) {
    _sendPreviewWithCaption(preview, text, telegramChannelId, telegramAPI);
  } else {
    _sendPreviewLinkAfterText(preview, text, telegramChannelId, telegramAPI);
  }
}

async function _sendPreviewWithCaption(
  preview,
  text,
  telegramChannelId,
  telegramAPI
) {
  try {
    if (preview.type === "photo") {
      await telegramAPI.sendPhoto(-telegramChannelId, preview.url, {
        caption: text,
        parse_mode: "HTML"
      });
    } else if (preview.type === "doc") {
      await telegramAPI.sendDocument(-telegramChannelId, preview.url, {
        caption: text,
        parse_mode: "HTML"
      });
    } else {
      throw "Unknown preview type";
    }
  } catch (error) {
    console.error(`Couldn't send photo with caption to telegram channel`);
    console.error(error);
  }
}

async function _sendPreviewLinkAfterText(
  preview,
  text,
  telegramChannelId,
  telegramAPI
) {
  let previewLink = `<a href="${preview.url}">&#160;</a>`;
  text = text + "\n" + previewLink;
  try {
    await telegramAPI.sendMessage(-telegramChannelId, text, {
      parse_mode: "HTML"
    });
  } catch (error) {
    console.error(`Couldn't send photo and text separate to telegram channel`);
    console.error(error);
  }
}

function isAllowedAuthor(authorId, authors) {
  if (!authors) return true;
  return authors.includes(authorId);
}

function isPostWithTags(post, tags) {
  if (!tags) return false;
  for (let tag of tags) {
    let regexp = new RegExp(tag);
    if (regexp.test(post.text)) {
      return true;
    }
  }
  return false;
}

module.exports = {
  getBotByName,
  getPreviewFromPost,
  isPostWithTags,
  removeTagsFromPost,
  sendPost,
  sendPostWithPreview,
  isAllowedAuthor
};
