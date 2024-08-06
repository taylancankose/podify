import { PopulatedFavList } from "#/@types/audio";
import cloudinary from "#/cloud";
import { RequestWithFiles } from "#/middleware/fileParser";
import Audio from "#/models/audio";
import { categoriesTypes } from "#/utils/audio_category";
import { RequestHandler } from "express";

interface CreateAudioRequest extends RequestWithFiles {
  body: {
    title: string;
    about: string;
    category: categoriesTypes;
  };
}

export const createAudio: RequestHandler = async (
  req: CreateAudioRequest,
  res
) => {
  try {
    const { title, about, category } = req.body;
    const poster = req.files?.poster;
    const audioFile = req.files?.file;
    const ownerId = req.user.id;

    if (!audioFile)
      return res.status(422).json({ error: "Audio file is missing!" });

    const audioRes = await cloudinary.uploader.upload(audioFile[0].filepath, {
      resource_type: "video",
    });

    const newAudio = new Audio({
      title: title[0],
      about: about[0],
      category: category[0],
      owner: ownerId,
      file: { url: audioRes.url, publicId: audioRes.public_id },
    });
    if (poster) {
      const posterRes = await cloudinary.uploader.upload(poster[0].filepath, {
        width: 300,
        height: 300,
        crop: "thumb",
        gravity: "face",
      });

      newAudio.poster = {
        url: posterRes.secure_url,
        publicId: posterRes.public_id,
      };
    }
    await newAudio.save();

    res.status(201).json({
      audio: {
        title,
        about,
        file: newAudio.file.url,
        poster: newAudio.poster?.url,
      },
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const updateAudio: RequestHandler = async (
  req: CreateAudioRequest,
  res
) => {
  try {
    const { title, about, category } = req.body;
    const poster = req.files?.poster;
    const ownerId = req.user.id;
    const { audioId } = req.params;

    const audio = await Audio.findOneAndUpdate(
      { owner: ownerId, _id: audioId },
      { title: title[0], about: about[0], category: category[0] },
      { new: true }
    );

    if (!audio) return res.status(404).json({ error: "Record not found" });

    if (poster) {
      if (audio.poster?.publicId) {
        await cloudinary.uploader.destroy(audio.poster?.publicId);
      }

      const posterRes = await cloudinary.uploader.upload(poster[0].filepath, {
        width: 300,
        height: 300,
        crop: "thumb",
        gravity: "face",
      });

      audio.poster = {
        url: posterRes.secure_url,
        publicId: posterRes.public_id,
      };

      await audio.save();
    }

    res.status(201).json({
      audio: {
        title,
        about,
        file: audio.file.url,
        poster: audio.poster?.url,
      },
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getLatestUploads: RequestHandler = async (req, res) => {
  const list = await Audio.find()
    .sort("-createdAt")
    .limit(10)
    .populate<PopulatedFavList>("owner");

  const audios = list.map((item) => {
    return {
      id: item._id,
      title: item.title,
      about: item.about,
      category: item.category,
      file: item.file.url,
      poster: item.poster?.url,
      owner: { name: item.owner.name, id: item.owner._id },
    };
  });

  res.json({ audios });
};
