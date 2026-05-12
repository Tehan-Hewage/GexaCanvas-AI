import { useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatSidebar from '../chat/ChatSidebar';
import TopBar from './TopBar';
import MobileSidebar from './MobileSidebar';
import ImageGeneratorPanel from '../image/ImageGeneratorPanel';

export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const { chatId } = useParams();

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-[300px] border-r border-gexa-border bg-gexa-bg/50 backdrop-blur-xl shrink-0">
        <ChatSidebar />
      </aside>

      {/* Mobile sidebar */}
      <MobileSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      >
        <ChatSidebar onClose={() => setSidebarOpen(false)} />
      </MobileSidebar>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          onMenuClick={() => setSidebarOpen(true)}
          onImageClick={() => setImageOpen(!imageOpen)}
          imageOpen={imageOpen}
        />

        <div className="flex-1 flex overflow-hidden">
          {/* Chat content */}
          <main className="flex-1 flex flex-col min-w-0">{children}</main>

          {/* Image panel — desktop */}
          {imageOpen && (
            <aside className="hidden md:block w-[340px] border-l border-gexa-border p-4 overflow-y-auto bg-gexa-bg/30 backdrop-blur-xl shrink-0">
              <ImageGeneratorPanel />
            </aside>
          )}
        </div>

        {/* Image panel — mobile (collapsible) */}
        {imageOpen && (
          <div className="md:hidden border-t border-gexa-border p-4 bg-gexa-bg/80 backdrop-blur-xl">
            <ImageGeneratorPanel />
          </div>
        )}
      </div>
    </div>
  );
}
