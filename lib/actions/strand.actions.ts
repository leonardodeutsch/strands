"use server"

import { revalidatePath } from "next/cache";
import Strand from "../models/strand.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"
import { StrandValidation } from "../validations/strand";

interface Params {
  text: string,
  author: string,
  communityId: string | null,
  path: string
}

export async function createStrand({ text, author, communityId, path }: Params) {
  connectToDB();

  const createdStrand = await Strand.create({
    text,
    author,
    community: null
  });

  await User.findByIdAndUpdate(author, {
    $push: { strands: createdStrand._id}
  });

  revalidatePath(path);
}