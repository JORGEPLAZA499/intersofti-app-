import { MessageSquare } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';


export default function GhostcodeMessenger() {
  const { t } = useLanguage();

  return (
    <>
      <section className="py-32 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <MessageSquare className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-6 text-foreground">{t.nav.messenger}</h1>
          <p className="text-xl text-muted-foreground mb-8">
            End-to-end encrypted messaging designed for absolute privacy. Every message is protected with military-grade AES-256 encryption.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { title: 'Self-Destructing Messages', desc: 'Set timers for messages to automatically delete after being read.' },
            { title: 'Encrypted Group Chats', desc: 'Secure group conversations with the same level of encryption as private chats.' },
            { title: 'Anonymous Mode', desc: 'Communicate without revealing your identity or metadata.' },
          ].map((item, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold mb-2 text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
