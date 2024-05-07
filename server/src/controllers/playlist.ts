import { CreatePlaylistRequest, UpdatePlaylistRequest } from "#/@types/audio";
import Audio from "#/models/audio";
import Playlist from "#/models/playlist";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";

export const createPlaylist: RequestHandler = async (
  req: CreatePlaylistRequest,
  res
) => {
  const { title, resId, visibility } = req.body;
  const ownerId = req.user.id; // must auth dan

  if (resId) {
    const audio = await Audio.findById(resId);

    if (!audio) return res.status(404).json({ error: "Could not find audio" });
  }

  const newPlaylist = new Playlist({
    title: title,
    owner: ownerId,
    visibility: visibility,
  });
  if (resId) newPlaylist.items = [resId as any];
  await newPlaylist.save();

  res.status(201).json({
    playlist: {
      id: newPlaylist.id,
      title: newPlaylist.title,
      visibility: newPlaylist.visibility,
    },
  });
};

export const updatePlaylist: RequestHandler = async (
  req: UpdatePlaylistRequest,
  res
) => {
  const { id, item, title, visibility } = req.body;

  const playlist = await Playlist.findOneAndUpdate(
    { _id: id, owner: req.user.id },
    {
      title,
      visibility,
    },
    { new: true }
  );

  if (!playlist) return res.status(404).json({ error: "Playlist not found" });

  if (item) {
    const audio = await Audio.findById(item);

    if (!audio) return res.status(404).json({ error: "Audio not found" });

    playlist.items.push(audio._id);
    // await playlist.save();

    await Playlist.findByIdAndUpdate(playlist._id, {
      $addToSet: { items: item },
    });
  }

  res.status(201).json({
    playlist: {
      id: playlist.id,
      title: playlist.title,
      visibility: playlist.visibility,
    },
  });
};
export const removePlaylist: RequestHandler = async (req, res) => {
  const { playlistId, resId, all } = req.query;

  if (!isValidObjectId(playlistId))
    return res.status(422).json({ error: "Invalid playlist id" });

  if (all === "yes") {
    const playlist = await Playlist.findOneAndDelete({
      _id: playlistId,
      owner: req.user.id,
    });

    if (!playlist) return res.status(404).json({ error: "Playlist not found" });
  }

  if (resId) {
    if (!isValidObjectId(resId))
      return res.status(422).json({ error: "Invalid audio id" });

    const playlist = await Playlist.findOneAndUpdate(
      {
        _id: playlistId,
        owner: req.user.id,
      },
      {
        $pull: { items: resId },
      }
    );

    if (!playlist) return res.status(404).json({ error: "Playlist not found" });
  }

  res.json({ success: true });
};

export const getPlaylistByProfile: RequestHandler = async (req, res) => {
  const data = await Playlist.find({
    owner: req.user.id, // from mustAuth middleware
    visibility: { $ne: "auto" }, // visibility auto olmayanları bulmak istiyoruz
  }).sort("-createdAt"); // latest at the top

  // Format data:
  const playlist = data.map((item) => {
    return {
      id: item.id,
      title: item.title,
      itemsCount: item.items.length,
      visibility: item?.visibility,
    };
  });

  res.json({ playlist });
};
