const { db } = require("./api/firebase");
const { debug, info, error, warn } = require("firebase-functions/lib/logger");

function isPostUnique(post) {
  const postsIdCollection = db.collection("postsId");
  return new Promise((resolve, reject) => {
    postsIdCollection
      .where("id", "==", post.id)
      .get()
      .then(async (snap) => {
        if (snap.empty) {
          await postsIdCollection.add({
            id: post.id,
          });
          return resolve(true);
        }

        warn("post duplication");
        resolve(false);
      })
      .catch((error) => reject(error));
  });
}

async function isAllowedToSend(post, botConfig) {
  const restrictionsCollection = db.collection("restrictions");
  let restrictions = null;
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

  if (!restrictions) return true;

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
  if (typeof restrictions.forwardAllPosts !== "undefined") {
    info("forwardAllPosts", restrictions.forwardAllPosts);
    return restrictions.forwardAllPosts;
  }

  return true;
}

function getPhotosUrlFromAttachments(attachments) {
  return attachments
    .filter((attachment) => attachment.type === "photo")
    .map(
      (attachment) =>
        attachment.photo.sizes.find(
          (size) =>
            size.width ===
            Math.max(...attachment.photo.sizes.map((s) => s.width), 0)
        ).url
    );
}

function chunkSubstr(str, size) {
  const numChunks = Math.ceil(str.length / size);
  const chunks = new Array(numChunks);

  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = str.substr(o, size);
  }

  return chunks;
}

module.exports = {
  isPostUnique,
  isAllowedToSend,
  getPhotosUrlFromAttachments,
  chunkSubstr,
};
