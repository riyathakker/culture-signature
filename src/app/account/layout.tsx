import { AccountSidebar } from "@/components/account/AccountSidebar";
import { HomePageContainer } from "@/components/common/HomePageContainer";
import { AccountMobileHeader } from "@/components/account/AccountMobileHeader";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AccountMobileHeader />
      <HomePageContainer
        label={[{ label: "My Account" }]}
        heading="My Account"
        description="Manage your account, orders and preferences."
        breadcrumbClassName="[@media(display-mode:standalone)]:hidden"
        headerClassName="hidden lg:block [@media(display-mode:standalone)]:hidden [@media(display-mode:standalone)]:py-0"
      >
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-18">
          <AccountSidebar />
          <div className="flex-1 min-w-0 pt-2 [@media(display-mode:standalone)]:pt-4">
            {children}
          </div>
        </div>
      </HomePageContainer>
    </>
  );
}
