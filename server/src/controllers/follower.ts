import User from "#/models/user";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";

export const updateFollower: RequestHandler = async (req, res) => {
  const { profileId } = req.params;
  let status: "added" | "removed";

  if (!isValidObjectId(profileId))
    return res.status(403).json({ error: "Invalid profile ID" });

  const profile = await User.findById(profileId);

  if (!profile) return res.status(404).json({ error: "Profile not found" });

  const alreadyFollower = await User.findOne({
    _id: profileId,
    followers: req.user.id,
  });

  if (alreadyFollower) {
    // unfollow
    await User.updateOne(
      {
        _id: profileId,
      }, // bulduk
      {
        $pull: { followers: req.user.id },
      } // sildik
    );
    status = "removed";
  } else {
    // follow the user
    await User.updateOne(
      {
        _id: profileId,
      }, // bulduk
      {
        $addToSet: { followers: req.user.id },
      } // ekledik
    );
    status = "added";
  }

  if (status === "added") {
    // update following list
    await User.updateOne(
      { _id: req.user.id },
      { $addToSet: { followings: profileId } }
    );
  }

  if (status === "removed") {
    // remove from the following list
    await User.updateOne(
      { _id: req.user.id },
      { $pull: { followings: profileId } }
    );
  }

  return res.json({ status });
};
