const { debug, info, error, warn } = require("firebase-functions/lib/logger");
const chunk = require("chunk-text");
const got = require("got");
const stream = require("stream");
const FileType = require("file-type");
const webp = require("webp-converter");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { promisify } = require("util");
const postUtils = require("./postUtils");
const pipeline = promisify(stream.pipeline);

const tempDirLocation = os.tmpdir();

function isAuthenticated(req, res, config) {
  const data = req.body;
  try {
    if (data.secret !== config.vk.secret) {
      res.send("Wrong secret");
      throw `Wrong secret. Received: ${data.secret}, stored: ${config.vk.secret}`;
    }
    if (data.type === "confirmation") {
      info("confirmation");
      if (data.group_id !== config.vk.groupId) {
        res.send("Wrong group");
        throw `Wrong group: Received: ${data.group_id}, stored: ${config.vk.groupId}`;
      }
      res.send(config.vk.callbackString);
      return false;
    }
    return true;
  } catch (err) {
    error(err);
    return false;
  }
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
      // create temp directory
      fs.mkdir(
        __dirname + `/${tempDirLocation}`,
        { recursive: true },
        (err) => {}
      );
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
      let extension = path.extname(file);
      if (extension === "webp" || extension === "jpg")
        fs.unlink(path.join(tempDirLocation, file), (err) => {
          if (err) throw err;
        });
    }
  });
}

// WIP
function getBiggestImageSizeUrl(imageSizes) {
  return imageSizes.find(
    (size) => size.width === Math.max(...imageSizes.map((s) => s.width), 0)
  ).url;
}
async function getImageBuffer(image) {
  const imageUrl = getBiggestImageSizeUrl(image.photo.sizes);
  let downloadStream = got.stream(imageUrl);
  const fileType = await FileType.fromStream(downloadStream);
  let imageFileName = `${image.photo.id}.${fileType.ext}`;
  let imageLocation = path.join(tempDirLocation, imageFileName);
  const fileWriterStream = fs.createWriteStream(imageLocation);
  downloadStream = got.stream(imageUrl);
  await pipeline(downloadStream, fileWriterStream);
  const imageSize = fs.statSync(imageLocation).size;
  debug(imageSize);
  // if (imageSize > 123) dosome
  if (fileType.ext === "webp") {
    const jpgFileLocation = path.join(tempDirLocation, `${image.photo.id}.jpg`);
    // format webp image
    await webp.dwebp(imageLocation, jpgFileLocation, "-o");
    image.photo.buffer = fs.readFileSync(jpgFileLocation);
  }
  return image;
}
function handleAttachments(attachments) {
  attachments.map((attachment) => {
    if (attachment.type === "photo") {
      // ... photo
      attachment = getImageBuffer(attachment);
    }
    if (attachment.type === "doc") {
      // ... doc
    }
    return attachment;
  });
  return attachments;
}

module.exports = {
  getPhotosUrlFromAttachments,
  chunkSubstr,
  formatWebpImagesToJpg,
  cleanTemporary,
  isAuthenticated,
  handleAttachments,
  ...postUtils,
};
