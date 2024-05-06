import { AudioDocument } from "#/models/audio";
import { ObjectId } from "mongoose";

export type PopulatedFavList = AudioDocument<{ _id: ObjectId; name: string }>;
