import Image from "next/image";
import React from "react";

interface Props {
  accountId: string;
  authUserId: string;
  name: string;
  userName: string;
  imgUrl: string;
  bio: string;
  type?: "User" | "Community";
}

const ProfileHeader = ({
  accountId,
  authUserId,
  name,
  userName,
  imgUrl,
  bio,
  type,
}: Props) => {
  return (
    <div className="flex flex-col w-full justify-start">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative h-20 w-20 object-cover">
            <Image
              src={imgUrl}
              alt="profile image"
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-left text-light-1 text-heading3-bold ">
              {name}
            </h2>
            <p className="text-base-medium text-gray-1">@{userName}</p>
          </div>
        </div>
      </div>
      //TODO Communit
      <p className="mt-6 max-w-lg text-light-2 text-base-regular">{bio}</p>
      <div className="mt-12 h-0.5 w-full bg-dark-3" />
    </div>
  );
};

export default ProfileHeader;