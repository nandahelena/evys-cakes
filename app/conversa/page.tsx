import type { Metadata } from 'next';
import { Chat } from '@/components/agent/Chat';
import { SiteHeader } from '@/components/SiteHeader';
import './conversa.css';

export const metadata: Metadata = {
  title: 'Conversar com a assistente · Evys Cakes',
  description: 'Conte da sua festa para a assistente da Evys Cakes e monte o seu pedido.',
};

export default function ConversaPage() {
  return (
    <>
      <SiteHeader />
      <main className="w chat-page">
        <Chat />
      </main>
    </>
  );
}
