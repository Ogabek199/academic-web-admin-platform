import PublicNavigation from '@/shared/components/PublicNavigation';
import PublicFooter from '@/shared/components/PublicFooter';
import ChatWidget from '@/shared/components/ChatWidget';

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavigation />
      <main id="main-content" className="flex-1" role="main" tabIndex={-1}>
        {children}
      </main>
      <PublicFooter />
      <ChatWidget />
    </div>
  );
}
