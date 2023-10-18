import { currentUser } from "@clerk/nextjs";
import { redirect } from 'next/navigation';
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import ProfileHeader from "@/components/shared/ProfileHeader";
import Image from "next/image";
import { profileTabs } from "@/constants";
import StrandsTab from "@/components/shared/StrandsTab";
import UserCard from "@/components/cards/UserCard";

const Page = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect('/onboarding');
  
  return (
    <section>
      <h1 className="head-text">Activity</h1>
    </section>
  )
}

export default Page;