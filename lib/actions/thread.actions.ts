/**
 * "use server " must be added because we cannot create database action through our browser side.
 */

"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { models } from "@/constants";
import Community from "../models/community.model";

interface Params {
  text: string;
  author: string;
  communityID: string | null;
  path: string;
}

/**
 * for posting a thread
 */
export async function createThread({
  text,
  author,
  communityID,
  path,
}: Params) {
  try {
    connectToDB(); //performing connection status on Database

    const communityIdObject = await Community.findOne(
      { id: communityID },
      { _id: 1 }
    );

    const createdThread = await Thread.create({
      text,
      author,
      community: communityIdObject,
    });

    //udpdate User model after every thread created
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    if (communityIdObject) {
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { threads: createdThread._id },
      });
    }

    //revalidatePath() makes sure that the change has happen immediately in the website.
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Unable to create Thread : ${error.message}`);
  }
}
/**
 * fetching all the thread that has been posted with pagination
 */
export async function fetchThreads(pageNumber = 1, pageSize = 20) {
  try {
    connectToDB();

    //calculate the number of posts to skip
    const skipAmount = (pageNumber - 1) * pageSize;

    //Fetch the thread that have no parents (i.e.: top level threads)
    const threadQuery = Thread.find({
      parentID: { $in: [null, undefined] },
    })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({
        path: "author",
        model: models.user,
      })
      .populate({
        path: "community",
        model: models.community,
      })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: models.user,
          select: "_id name parentID image",
        },
      });

    // Count the total number of top-level posts (threads) i.e., threads that are not comments.
    const totalThreadsCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    }); // Get the total count of posts

    const threads = await threadQuery.exec();
    const isNext = totalThreadsCount > skipAmount + threads.length;
    return { threads, isNext };
  } catch (error: any) {
    throw new Error(`Error fetching Threads : ${error.message}`);
  }
}

/**
 * fetching a single thread deatil by thread id
 */
export async function fetchThreadById(id: string) {
  try {
    connectToDB();
    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        model: models.user,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: models.user,
            select: "_id name parentID image",
          },
          {
            path: "children",
            model: models.thread,
            populate: {
              path: "author",
              model: models.user,
              select: "_id id name parentID image",
            },
          },
        ],
      })
      .exec();
    return thread;
  } catch (error: any) {
    throw new Error(`Error fetching thread : ${error.message}`);
  }
}

/**
 * Commenting to Thread
 */
export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();
  try {
    //Find the original thread by id
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) {
      throw new Error("Thread not found");
    }

    //create a new thread with the comment text
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentID: threadId,
    });

    //save the new thread
    const savedCommentThread = await commentThread.save();

    //update the original thread to include the new comments.
    originalThread.children.push(savedCommentThread._id);

    //Save the original thread
    await originalThread.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error adding comment: ${error.message}`);
  }
}

/**
 * fetching user threads to its profile
 */
export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();
    //Find all the threads authored by user with the given userId

    const threads = User.findOne({ id: userId })
      .populate({
        path: "threads",
        model: models.thread,
        populate: {
          path: "children",
          model: models.thread,
          populate: {
            path: "author",
            model: models.user,
            select: "name image id",
          },
        },
      })
      .exec();
    return threads;
  } catch (error: any) {
    throw new Error(`Error fetching profile data:${error.message}`);
  }
}
