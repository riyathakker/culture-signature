import { AccountSidebar } from "@/components/account/AccountSidebar";
import { AccountMobileHeader } from "@/components/account/AccountMobileHeader";
import { HomePageContainer } from "@/components/common/HomePageContainer";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AccountMobileHeader />
      <div className="pwa-page-account">
        <HomePageContainer label={[{ label: "My Account" }]} heading="My Account" description="Manage your personal collection and artisanal preferences." breadcrumbClassName="[@media(display-mode:standalone)]:hidden">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-18">
            <AccountSidebar />
            <div className="flex-1 min-w-0">
              {children}
            </div>
          </div>
        </HomePageContainer>
      </div>
    </>
  );
}
