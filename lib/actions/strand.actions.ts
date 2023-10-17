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

export async function fetchStrands(pageNumber = 1, pageSize = 20) {
  connectToDB();
  const skipAmount = (pageNumber - 1) * pageSize;
  const strandsQuery = Strand
    .find({ parentId: {$in: [null, undefined]}})
    .sort({ createdAt: 'desc'})
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: 'author', model: User})
    .populate({ 
      path: 'children', 
      populate: {
        path: 'author',
        model: User,
        select: "_id name parentId image"
      }
    })

    const totalStrandsCount = await Strand.countDocuments({ parentId: {$in: [null, undefined]} });
    const strands = await strandsQuery.exec();

    const isNext = totalStrandsCount > skipAmount + strands.length;
    
    return { strands, isNext };
}