module.exports = (req, res, config, telegram) => {
  const { type, object: data, group_id } = req.body;

  if (type === 'wall_post_new') {
    let post = data;

    if (isPostWithTags(post)) {
      console.log(`~~~ NEW POST IN GROUP: ${group_id} ~~~`);
      console.log(post.text);

      post = removeTagsFromPost(post);
      const preview = getPreviewFromPost(post);
      if (preview && preview.type && preview.url) {
        sendPostWithPreview(post, preview);
      } else {
        sendPost(post);
      }
    }
  }

  function isPostWithTags(post) {
    for (let tag of config.vk.postTags) {
      let regexp = new RegExp(tag);
      if (regexp.test(post.text)) {
        return true;
      }
    }
    return false;
  }

  function removeTagsFromPost(post) {
    for (let tag of config.vk.postTags) {
      post.text = post.text.replace(tag, '');
    }
    return post;
  }

  function getPreviewFromPost(post) {
    if (!post.attachments || !post.attachments.length) return '';
    for (let attach of post.attachments) {
      switch (attach.type) {
        case 'photo':
          const photo = attach.photo;
          // get original photo size url
          const url = photo.sizes.find(
            size => size.width === Math.max(...photo.sizes.map(s => s.width), 0)
          ).url;
          return {
            type: attach.type,
            url,
          };
        case 'doc':
          const doc = attach.doc;
          if (doc.ext === 'gif') {
            return {
              type: attach.type,
              url: doc.url,
            };
          } else {
            console.error(`Unhandled attachment doc type extention`);
            console.error(doc);
            return '';
          }
        default:
          console.error(`Unhandled attachment type`);
          console.error(attach);
          return '';
      }
    }
  }

  async function sendPost(post) {
    let text = post.text;
    if (text.length > 0) {
      try {
        await telegram.sendMessage(-config.telegram.channelId, text, {
          parse_mode: 'HTML',
        });
      } catch (error) {
        console.error(error);
      }
    }
  }

  function sendPostWithPreview(post, preview) {
    let text = post.text;
    if (text.length <= 1024) {
      _sendPreviewWithCaption(preview, text);
    } else {
      _sendPreviewLinkAfterText(preview, text);
    }
  }

  async function _sendPreviewWithCaption(preview, text) {
    try {
      if (preview.type === 'photo') {
        await telegram.sendPhoto(-config.telegram.channelId, preview.url, {
          caption: text,
          parse_mode: 'HTML',
        });
      } else if (preview.type === 'doc') {
        await telegram.sendDocument(-config.telegram.channelId, preview.url, {
          caption: text,
          parse_mode: 'HTML',
        });
      } else {
        throw 'Unknown preview type';
      }
    } catch (error) {
      console.error(`Couldn't send photo with caption to telegram channel`);
      console.error(error);
    }
  }

  async function _sendPreviewLinkAfterText(preview, text) {
    let previewLink = `<a href="${preview.url}">&#160;</a>`;
    text = text + '\n' + previewLink;
    try {
      await telegram.sendMessage(-config.telegram.channelId, text, {
        parse_mode: 'HTML',
      });
    } catch (error) {
      console.error(
        `Couldn't send photo and text separate to telegram channel`
      );
      console.error(error);
    }
  }
};
