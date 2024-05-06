import { PopulatedFavList } from "#/@types/audio";
import Audio, { AudioDocument } from "#/models/audio";
import Favorite from "#/models/favorite";
import { RequestHandler } from "express";
import { ObjectId, isValidObjectId } from "mongoose";

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
  // owner id ye göre bulcaz
  const userID = req.user.id;

  const favorite = await Favorite.findOne({ owner: userID }).populate<{
    items: PopulatedFavList[];
  }>({
    path: "items",
    populate: {
      path: "owner",
    },
  }); // bu sefer de ayrıca tüm audio datasına ek olarak ownerın da tüm datasını çektik ekledik

  // .populate("items");
  // graphql deki gibi id den postun detayına gidicez ref de var zaten populate bu işe yarıyor
  // böylece items da sadece id değil tüm data çıkacak
  // ayrıca bunu da sadece belirli yerlerini göstermeyi ypaabiliyorsun

  if (!favorite) return res.json({ audios: [] });

  const audios = favorite.items.map((item) => {
    return {
      id: item._id,
      title: item.title,
      category: item.category,
      file: item.file.url,
      poster: item.poster?.url,
      owner: {
        name: item.owner.name,
        id: item.owner._id,
      },
    };
  });
  // böylece sadece göndermek istediğimiz datayı seçip bunu response olarak yollayabiliriz. formatted
  res.json({ audios });
};
