import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Params {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    id: string;
    image: string;
  };
  community: {
    name: string;
    id: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      iamge: string;
    };
  }[];
  isComment?: boolean;
}

const ThreadCard = ({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
}: Params) => {
  return (
    <article
      className={` card flex w-full flex-col rounded-xl ${
        isComment ? "px-0 sm:px-7" : "bg-dark-2 p-7"
      }`}
    >
      <div className="flex item-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image}
                alt="profile image"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>
            <div className="thread-card_bar" />
          </div>
          <div className="flex w-full flex-col">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base1-semibold text-light-1">
                {author.name}
              </h4>
            </Link>
            <p className={`mt-2 text-small-regular text-light-2`}>{content}</p>
            <div
              className={`${isComment && "mb-10"}  mt-5 flex flex-col gap-3`}
            >
              <div className="flex gap-3.5">
                <Image
                  src={"/assets/heart-gray.svg"}
                  alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Link href={`/thread/${id}`}>
                  <Image
                    src={"/assets/reply.svg"}
                    alt="reply"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </Link>
                <Image
                  src={"/assets/repost.svg"}
                  alt="repost"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Image
                  src={"/assets/share.svg"}
                  alt="share"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                {isComment && comments?.length > 0 && (
                  <Link href={`{thread/${id}}`}>
                    <p className="mt-1 text-subtle-medium text-gray-1">
                      {" "}
                      {comments.length} replies
                    </p>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {!isComment && community && (
        <Link
          href={`/communities/${community?.id}`}
          className="mt-5 flex items-center"
        >
          <p className="text-subtle-medium text-gray-1">
            {formatDateString(createdAt)}
            {"  "} - {community?.name} Community
          </p>
          <Image
            alt={community?.name}
            src={community?.image}
            width={24}
            height={24}
            className="ml-1 object-cover rounded-full"
          />
        </Link>
      )}
    </article>
  );
};

export default ThreadCard;
