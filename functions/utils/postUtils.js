const { db } = require("../api/firebase");
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

async function isAllowedToSend(post, botName) {
  const restrictionsCollection = db.collection("restrictions");
  let restrictions = null;
  try {
    const restrictionsSnapshot = await restrictionsCollection
      .where("botName", "==", botName)
      .get();
    if (!restrictionsSnapshot.empty) {
      restrictions = restrictionsSnapshot.docs[0].data();
    }
  } catch (err) {
    error(err);
  }

  if (!restrictions) return true;

  if (restrictions.allowedTags) {
    let text = post.text.toLowerCase();
    for (let tag of restrictions.allowedTags) {
      if (new RegExp(tag.toLowerCase()).test(text)) {
        info("allowedTags", tag);
        return true;
      }
    }
  }

  if (restrictions.deniedTags) {
    let text = post.text.toLowerCase();
    for (let tag of restrictions.deniedTags) {
      if (new RegExp(tag.toLowerCase()).test(text)) {
        info("deniedTags", tag);
        return false;
      }
    }
  }

  if (!restrictions.restrictAuthors) return true;

  if (restrictions.allowedAuthors && post.created_by) {
    info(
      "allowedAuthors",
      restrictions.allowedAuthors.includes(post.created_by)
    );
    return restrictions.allowedAuthors.includes(post.created_by);
  }

  return false;
}

async function shouldForwardPost(post, config) {
  try {
    if ((await isPostUnique(post)) && (await isAllowedToSend(post, config)))
      return true;
  } catch (err) {
    error(err);
  }
  return false;
}

module.exports = {
  isPostUnique,
  isAllowedToSend,
  shouldForwardPost,
};
