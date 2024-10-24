/**
 * to change the favicon, just go to https://favicon.io/favicon-converter/ and drop the required icon and download the file then extract the zip and used the favicon.ico from there
 */

import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreads } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  const result = await fetchThreads(1, 30);
  const user = await currentUser();
  return (
    <div>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {result?.threads?.length === 0 ? (
          <p className="no-result">No Threads found</p>
        ) : (
          <>
            {result?.threads?.map((thread, index) => (
              <ThreadCard
                key={thread?._id}
                id={thread?._id}
                currentUserId={user?.id || ""}
                parentId={thread?.parentId}
                content={thread?.text}
                author={thread?.author}
                community={thread?.community}
                createdAt={thread?.createdAt}
                comments={thread?.children}
              />
            ))}
          </>
        )}
      </section>
    </div>
  );
}
