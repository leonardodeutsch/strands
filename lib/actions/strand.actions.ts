"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import User from "../models/user.model";
import Strand from "../models/strand.model";
import Community from "../models/community.model";

export async function fetchStrands(pageNumber = 1, pageSize = 20) {
  connectToDB();

  // Calculate the number of posts to skip based on the page number and page size.
  const skipAmount = (pageNumber - 1) * pageSize;

  // Create a query to fetch the posts that have no parent (top-level strands) (a thread that is not a comment/reply).
  const strandsQuery = Strand.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "community",
      model: Community,
    })
    .populate({
      path: "children", // Populate the children field
      populate: {
        path: "author", // Populate the author field within children
        model: User,
        select: "_id name parentId image", // Select only _id and username fields of the author
      },
    });

  // Count the total number of top-level posts (strands) i.e., strands that are not comments.
  const totalStrandsCount = await Strand.countDocuments({
    parentId: { $in: [null, undefined] },
  }); // Get the total count of posts

  const strands = await strandsQuery.exec();

  const isNext = totalStrandsCount > skipAmount + strands.length;

  return { strands, isNext };
}

interface Params {
  text: string,
  author: string,
  communityId: string | null,
  path: string,
}

export async function createStrand({ text, author, communityId, path }: Params
) {
  try {
    connectToDB();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdStrand = await Strand.create({
      text,
      author,
      community: communityIdObject, // Assign communityId if provided, or leave it null for personal account
    });

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { strands: createdStrand._id },
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { strands: createdStrand._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }
}

async function fetchAllChildStrands(threadId: string): Promise<any[]> {
  const childStrands = await Strand.find({ parentId: threadId });

  const descendantStrands = [];
  for (const childStrand of childStrands) {
    const descendants = await fetchAllChildStrands(childStrand._id);
    descendantStrands.push(childStrand, ...descendants);
  }

  return descendantStrands;
}

export async function deleteStrand(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    // Find the thread to be deleted (the main thread)
    const mainStrand = await Strand.findById(id).populate("author community");

    if (!mainStrand) {
      throw new Error("Strand not found");
    }

    // Fetch all child strands and their descendants recursively
    const descendantStrands = await fetchAllChildStrands(id);

    // Get all descendant thread IDs including the main thread ID and child thread IDs
    const descendantStrandIds = [
      id,
      ...descendantStrands.map((thread) => thread._id),
    ];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantStrands.map((thread) => thread.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainStrand.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantStrands.map((thread) => thread.community?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainStrand.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child strands and their descendants
    await Strand.deleteMany({ _id: { $in: descendantStrandIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { strands: { $in: descendantStrandIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { strands: { $in: descendantStrandIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete thread: ${error.message}`);
  }
}

export async function fetchStrandById(threadId: string) {
  connectToDB();

  try {
    const thread = await Strand.findById(threadId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      }) // Populate the author field with _id and username
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      }) // Populate the community field with _id and name
      .populate({
        path: "children", // Populate the children field
        populate: [
          {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id id name parentId image", // Select only _id and username fields of the author
          },
          {
            path: "children", // Populate the children field within children
            model: Strand, // The model of the nested children (assuming it's the same "Strand" model)
            populate: {
              path: "author", // Populate the author field within nested children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
          },
        ],
      })
      .exec();

    return thread;
  } catch (err) {
    console.error("Error while fetching thread:", err);
    throw new Error("Unable to fetch thread");
  }
}

export async function addCommentToStrand(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();

  try {
    // Find the original thread by its ID
    const originalStrand = await Strand.findById(threadId);

    if (!originalStrand) {
      throw new Error("Strand not found");
    }

    // Create the new comment thread
    const commentStrand = new Strand({
      text: commentText,
      author: userId,
      parentId: threadId, // Set the parentId to the original thread's ID
    });

    // Save the comment thread to the database
    const savedCommentStrand = await commentStrand.save();

    // Add the comment thread's ID to the original thread's children array
    originalStrand.children.push(savedCommentStrand._id);

    // Save the updated original thread to the database
    await originalStrand.save();

    revalidatePath(path);
  } catch (err) {
    console.error("Error while adding comment:", err);
    throw new Error("Unable to add comment");
  }
}