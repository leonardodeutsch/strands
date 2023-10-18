import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import StrandCard from "../cards/StrandCard";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const StrandsTab = async ({ currentUserId, accountId, accountType} : Props) => {
  let result: any;
  if (accountType === 'Community') {
    result = await fetchCommunityPosts(accountId);
  } else {
    result = await fetchUserPosts(accountId);
  }
  if (!result) redirect('/');
  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.strands.map((strand: any) => (
        <StrandCard
        key={strand._id}
        id={strand._id}
        currentUserId={currentUserId}
        parentId={strand.parentId}
        content={strand.text}
        author={
          accountType === 'User'
            ? { name: result.name, image: result.image, id: result.id }
            : {name: strand.author.name, image: strand.author.image, id: strand.author.id}
        }
        community={strand.community}
        createdAt={strand.createdAt}
        comments={strand.children}
      />
      ))}
    </section>
  )
}

export default StrandsTab;