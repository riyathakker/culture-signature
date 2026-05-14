import { AccountSidebar } from "@/components/account/AccountSidebar";
import { HomePageContainer } from "@/components/common/HomePageContainer";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <HomePageContainer label={[{ label: "My Account" }]} heading="My Account" description="Manage your personal collection and artisanal preferences.">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          <AccountSidebar />
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
    </HomePageContainer>
  );
}
