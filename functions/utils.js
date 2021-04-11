const { db } = require("./api/firebase");
const { debug, info, error, warn } = require("firebase-functions/lib/logger");
const chunk = require("chunk-text");
const got = require("got");
const stream = require("stream");
const FileType = require("file-type");
const webp = require("webp-converter");
const fs = require("fs");
const os = require("os");
const { promisify } = require("util");
const pipeline = promisify(stream.pipeline);

const tempDirLocation = os.tmpdir();

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

function chunkSubstr(str, size, firstElementSize) {
  str = str.trim();
  if (firstElementSize) {
    let firstElementSizeChunks = chunk(str, firstElementSize);
    let mainChunks = chunk(firstElementSizeChunks.slice(1).join(" "), size);
    return [firstElementSizeChunks[0], ...mainChunks];
  }
  return chunk(str, size);
}

async function formatWebpImagesToJpg(images) {
  for (let i = 0; i < images.length; i++) {
    let image = images[i];

    // check file type
    let downloadStream = got.stream(image);
    let fileType = await FileType.fromStream(downloadStream);
    if (fileType.ext === "webp") {
      const webpFileName = `${tempDirLocation}/temp.webp`;
      const jpgFileName = `${tempDirLocation}/temp${i}.jpg`;
      // write temp images in directory
      const downloadStream = got.stream(image);
      const fileWriterStream = fs.createWriteStream(webpFileName);
      await pipeline(downloadStream, fileWriterStream);
      // format webp image
      await webp.dwebp(webpFileName, jpgFileName, "-o");
      // mutate webp image with Buffer of jpg image
      images[i] = await fs.readFileSync(jpgFileName);
    }
  }
  return images;
}

function cleanTemporary() {
  fs.readdir(tempDirLocation, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlink(`${tempDirLocation}/${file}`, (err) => {
        if (err) throw err;
      });
    }
  });
}

module.exports = {
  isPostUnique,
  isAllowedToSend,
  getPhotosUrlFromAttachments,
  chunkSubstr,
  formatWebpImagesToJpg,
  cleanTemporary,
};
