import StrandCard from "@/components/cards/StrandCard";
import { fetchStrands } from "@/lib/actions/strand.actions"
import { currentUser } from "@clerk/nextjs";

 
export default async function Home() {
  const result = await fetchStrands(1, 30);
  const user = await currentUser();
  return (
    <div>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result.strands.length === 0 ? (
          <p className="no-result">No strands found</p>
        ) : (
          <>
            {result.strands.map((strand) => (
              <StrandCard
                key={strand._id}
                id={strand._id}
                currentUserId={user?.id || ''}
                parentId={strand.parentId}
                content={strand.text}
                author={strand.author}
                community={strand.community}
                createdAt={strand.createdAt}
                comments={strand.children}
              />
            ))}
          </>
        )}
      </section>
    </div>
  )
}
