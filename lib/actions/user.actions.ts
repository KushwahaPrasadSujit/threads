"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { FilterQuery, SortOrder } from "mongoose";
import Thread from "../models/thread.model";
import { models } from "@/constants";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

/**
 *   the userId,username, name, bio, image, path is comming from props or rather to say params to this function
 * */
export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> {
  connectToDB();

  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      {
        upsert: true, //upsert means both updating and inserting
      }
    );

    /**
     * revalidatePath allows you to revalidate data associated with a specific path. This is useful for scenarios where you want to update your cached data without waiting for a revalidation period to expire.
     */
    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to created/update user : ${error?.message}`);
  }
}

/**
 * for fetching user information from mongodb
 */
export async function fetchUser(userID: string) {
  try {
    connectToDB(); //performing connection status on Database
    return await User.findOne({ id: userID }).populate({
      path: "communities",
      model: models.community,
    });
  } catch (error: any) {
    throw new Error(`Failed to fetched User Info : ${error.message}`);
  }
}

/**
 * Fetching all the users in threads application
 */
export async function fetchUsers({
  pageNumber = 1,
  pageSize = 20,
  searchString = "",
  userId,
  sortBy = "desc",
}: {
  userId: string;
  pageNumber?: number;
  pageSize?: number;
  searchString?: string;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();
    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, //$ne => not equals
    };

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOption = {
      createdAt: sortBy,
    };

    const usersQuery = User.find(query)
      .sort(sortOption)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    const isNext = totalUsersCount > skipAmount + users.length;

    return {
      users,
      isNext,
    };
  } catch (error: any) {
    throw new Error(`Error to fetch users: ${error?.message}`);
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDB();
    //find all the threads created by the user
    const userThreads = await Thread.find({ author: userId });

    //collect all the child thread ids (replies) from the 'children' field
    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: models.user,
      select: "name image _id",
    });

    return replies;
  } catch (error: any) {
    throw new Error(`Error to fetch activity: ${error?.message}`);
  }
}
