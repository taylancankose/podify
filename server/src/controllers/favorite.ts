import { PopulatedFavList } from "#/@types/audio";
import { paginationQuery } from "#/@types/misc";
import Audio from "#/models/audio";
import Favorite from "#/models/favorite";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";

export const toggleFavorite: RequestHandler = async (req, res) => {
  const audioId = req.query.audioId as string;
  let status: "added" | "removed";

  if (!isValidObjectId(audioId))
    return res.status(422).json({ error: "Audio id is not valid" });

  const audio = await Audio.findById(audioId);
  if (!audio) return res.status(404).json({ error: "Audio not found" });

  // audio is already in favs
  const alreadyExists = await Favorite.findOne({
    owner: req.user.id,
    items: audioId,
  }); // mustAuth middlewaresinden owner id geliyor
  // hem bu owner id hem de bu audio id sine sahip var mı
  if (alreadyExists) {
    // remove audio from favorites
    await Favorite.updateOne(
      { owner: req.user.id },
      {
        $pull: { items: audioId }, // silmeye yarıyo mongodb den
      }
    );

    status = "removed";
  } else {
    const favorite = await Favorite.findOne({ owner: req.user.id });
    if (favorite) {
      // trying to add new audio to the old list
      await Favorite.updateOne(
        { owner: req.user.id },
        {
          $addToSet: { items: audioId },
        }
      );
    } else {
      // trying to create fresh fav list
      await Favorite.create({ owner: req.user.id, items: [audioId] });
    }

    status = "added";
  }

  if (status === "added") {
    await Audio.findByIdAndUpdate(audioId, {
      $addToSet: { likes: req.user.id }, // id yi array e ekle
    });
  }

  if (status === "removed") {
    await Audio.findByIdAndUpdate(audioId, {
      $pull: { likes: req.user.id }, // id yi array den çıkar
    });
  }

  res.json({ status });
};

export const getFavorites: RequestHandler = async (req, res) => {
  const userID = req.user.id;
  const { limit = "20", pageNo = "0" } = req.query as paginationQuery;

  const favorites = await Favorite.aggregate([
    { $match: { owner: userID } },
    {
      $project: {
        audioIds: {
          $slice: [
            "$items",
            parseInt(limit) * parseInt(pageNo),
            parseInt(limit),
          ],
        },
      },
    },
    { $unwind: "$audioIds" },
    {
      $lookup: {
        from: "audios",
        localField: "audioIds",
        foreignField: "_id",
        as: "audioInfo",
      },
    },
    { $unwind: "$audioInfo" },
    {
      $lookup: {
        from: "users",
        localField: "audioInfo.owner",
        foreignField: "_id",
        as: "ownerInfo",
      },
    },
    { $unwind: "$ownerInfo" },
    {
      $project: {
        _id: 0,
        id: "$audioInfo._id",
        title: "$audioInfo.title",
        about: "$audioInfo.about",
        category: "$audioInfo.category",
        file: "$audioInfo.file.url",
        poster: "$audioInfo.poster.url",
        owner: { name: "$ownerInfo.name", id: "$ownerInfo._id" },
      },
    },
  ]);

  res.json({ audios: favorites });
};

export const getIsFavorite: RequestHandler = async (req, res) => {
  const audioId = req.query["audioId?"] as string;
  if (!isValidObjectId(audioId))
    return res.status(422).json({ error: "invalid audio id" });

  const favorite = await Favorite.findOne({
    owner: req.user.id,
    items: audioId,
  });
  res.json({ result: favorite ? true : false });
};
