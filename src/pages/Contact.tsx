import { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export default function Contact() {
  const { t, language } = useLanguage();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const id = crypto.randomUUID();
      const { error } = await supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'contact-notification',
          recipientEmail: 'info@rpjsoftware.com',
          idempotencyKey: `contact-${id}`,
          templateData: {
            lang: language,
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            message: form.message,
          },
        },
      });
      if (error) throw error;
      toast.success(t.contact.successMessage);
      setForm({ firstName: '', lastName: '', email: '', message: '' });
    } catch {
      toast.error('Error sending message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <section className="py-32 px-4">
        <div className="max-w-xl mx-auto">
          <h1 className="text-5xl font-bold mb-8 text-center text-foreground">{t.contact.title}</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">{t.contact.firstName}</label>
                <Input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">{t.contact.lastName}</label>
                <Input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">{t.contact.email}</label>
              <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">{t.contact.message}</label>
              <Textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5} required />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={sending}>
              {sending ? '...' : t.contact.send}
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}
