import PublicNavigation from '@/shared/components/PublicNavigation';
import PublicFooter from '@/shared/components/PublicFooter';
import ChatWidget from '@/shared/components/ChatWidget';
import AnimateLayout from '@/components/AnimateLayout';

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <PublicNavigation />
      <main id="main-content" className="flex-1" role="main" tabIndex={-1}>
        <AnimateLayout>
          {children}
        </AnimateLayout>
      </main>
      <PublicFooter />
      <ChatWidget />
    </div>
  );
}

