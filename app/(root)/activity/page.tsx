import UserCard from "@/components/cards/UserCard";
import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { profileTabs } from "@/constants";
import { fetchUser, fetchUsers, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user?.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const activity = await getActivity(userInfo._id);

  return (
    <section>
      <h1 className="head-text mb-10">Activty</h1>
      <section className="my-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {activity?.map((activity, index) => (
              <Link key={activity?._id} href={`/thread/${activity.parentID}`}>
                <article className="activity-card">
                  <Image
                    src={activity.author.image}
                    alt="Profile Pic ture"
                    width={20}
                    height={20}
                    className="rounded-full object-cover"
                  />
                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">
                      {activity.author.name}
                    </span>{" "}
                    replies to your thread
                  </p>
                </article>
              </Link>
            ))}
            thread
          </>
        ) : (
          <p className="!text-base-regular text-light-3">No activity yet.</p>
        )}
      </section>
    </section>
  );
};

export default Page;
