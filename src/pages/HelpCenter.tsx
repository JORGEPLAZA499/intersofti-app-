import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';

import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Search, HelpCircle, ShoppingBag, Smartphone, Shield, Headphones, Briefcase, Mail, Send, CheckCircle, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type TicketCategory = 'technical' | 'commercial' | 'general';

export default function HelpCenter() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TicketCategory | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#contacto') {
      setShowTicketForm(true);
      setTimeout(() => {
        const el = document.getElementById('ticket-title');
        if (!el) return;
        const header = document.querySelector('header');
        const headerHeight = header ? header.getBoundingClientRect().height : (window.innerWidth < 1024 ? 64 : 80);
        const y = el.getBoundingClientRect().top + window.scrollY - headerHeight - 8;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }, 150);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.hash, location.pathname]);

  const categories = useMemo(() => [
    {
      id: 'general',
      icon: HelpCircle,
      title: t.helpCenter.categories.general,
      faqs: [
        { q: t.helpCenter.faqs.general.q1, a: t.helpCenter.faqs.general.a1 },
        { q: t.helpCenter.faqs.general.q2, a: t.helpCenter.faqs.general.a2 },
        { q: t.helpCenter.faqs.general.q3, a: t.helpCenter.faqs.general.a3 },
      ],
    },
    {
      id: 'products',
      icon: ShoppingBag,
      title: t.helpCenter.categories.products,
      faqs: [
        { q: t.helpCenter.faqs.products.q1, a: t.helpCenter.faqs.products.a1 },
        { q: t.helpCenter.faqs.products.q2, a: t.helpCenter.faqs.products.a2 },
        { q: t.helpCenter.faqs.products.q3, a: t.helpCenter.faqs.products.a3 },
      ],
    },
    {
      id: 'esim',
      icon: Smartphone,
      title: t.helpCenter.categories.esim,
      faqs: [
        { q: t.helpCenter.faqs.esim.q1, a: t.helpCenter.faqs.esim.a1 },
        { q: t.helpCenter.faqs.esim.q2, a: t.helpCenter.faqs.esim.a2 },
        { q: t.helpCenter.faqs.esim.q3, a: t.helpCenter.faqs.esim.a3 },
      ],
    },
    {
      id: 'security',
      icon: Shield,
      title: t.helpCenter.categories.security,
      faqs: [
        { q: t.helpCenter.faqs.security.q1, a: t.helpCenter.faqs.security.a1 },
        { q: t.helpCenter.faqs.security.q2, a: t.helpCenter.faqs.security.a2 },
        { q: t.helpCenter.faqs.security.q3, a: t.helpCenter.faqs.security.a3 },
      ],
    },
  ], [t]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase();
    return categories
      .map(cat => ({ ...cat, faqs: cat.faqs.filter(faq => faq.q.toLowerCase().includes(q) || faq.a.toLowerCase().includes(q)) }))
      .filter(cat => cat.faqs.length > 0);
  }, [categories, searchQuery]);

  const ticketCategories = [
    { id: 'technical' as TicketCategory, icon: Headphones, title: t.helpCenter.ticket.categories.technical.title, description: t.helpCenter.ticket.categories.technical.description, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { id: 'commercial' as TicketCategory, icon: Briefcase, title: t.helpCenter.ticket.categories.commercial.title, description: t.helpCenter.ticket.categories.commercial.description, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { id: 'general' as TicketCategory, icon: Mail, title: t.helpCenter.ticket.categories.general.title, description: t.helpCenter.ticket.categories.general.description, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-support-ticket', {
        body: {
          category: selectedCategory,
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim() || null,
          subject: form.subject.trim(),
          message: form.message.trim(),
        },
      });
      if (error) throw error;
      if (!data) throw new Error('No data');
      setTicketNumber(data.ticket_number);
      setSubmitted(true);
      toast.success(t.helpCenter.ticket.form.success);
    } catch {
      toast.error(t.helpCenter.ticket.form.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    setSubmitted(false);
    setTicketNumber('');
    setShowTicketForm(false);
  };

  if (submitted) {
    return (
      <>
        <div className="min-h-[60vh] flex items-center justify-center px-4 py-20">
          <Card className="max-w-lg w-full text-center">
            <CardContent className="p-8 space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mx-auto">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">{t.helpCenter.ticket.success.title}</h2>
                <p className="text-muted-foreground">{t.helpCenter.ticket.success.description}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">{t.helpCenter.ticket.success.ticketNumber}</p>
                <p className="text-xl font-mono font-bold text-primary">{ticketNumber}</p>
              </div>
              <Button onClick={handleReset} className="w-full">{t.helpCenter.ticket.success.newTicket}</Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen">
        {/* Header */}
        <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto pt-16 pb-12 md:pt-20 md:pb-16 px-4 text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">{t.helpCenter.title}</h1>
            <p className="text-muted-foreground text-lg">{t.helpCenter.description}</p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t.helpCenter.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto py-12 pb-32 md:pb-48 px-4">
          {filteredCategories.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">{t.helpCenter.noResults}</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredCategories.map((category) => (
                <Card key={category.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="p-1.5 rounded-lg bg-primary/10">
                        <category.icon className="h-4 w-4 text-primary" />
                      </div>
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Accordion type="single" collapsible>
                      {category.faqs.map((faq, i) => (
                        <AccordionItem key={i} value={`item-${i}`} className="border-border/30">
                          <AccordionTrigger className="text-sm text-left hover:no-underline py-2">{faq.q}</AccordionTrigger>
                          <AccordionContent className="text-sm text-muted-foreground pb-2">{faq.a}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Ticket Section */}
          <div id="contacto" className="mt-16 text-center">
            <p className="text-muted-foreground mb-4">{t.helpCenter.stillNeedHelp}</p>
            {!showTicketForm ? (
              <Button
                onClick={() => {
                  setShowTicketForm(true);
                  setTimeout(() => {
                    const el = document.getElementById('ticket-title');
                    if (!el) return;
                    const header = document.querySelector('header');
                    const headerHeight = header ? header.getBoundingClientRect().height : (window.innerWidth < 1024 ? 64 : 80);
                    const y = el.getBoundingClientRect().top + window.scrollY - headerHeight - 8;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }, 100);
                }}
                size="lg"
              >
                {t.helpCenter.contactSupport}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <div className="max-w-4xl mx-auto mt-8">
                <h2 id="ticket-title" className="text-2xl font-bold mb-2 scroll-mt-24">{t.helpCenter.ticket.title}</h2>
                <p className="text-muted-foreground mb-8">{t.helpCenter.ticket.subtitle}</p>

                {!selectedCategory ? (
                  <div className="grid md:grid-cols-3 gap-6">
                    {ticketCategories.map((cat) => (
                      <Card
                        key={cat.id}
                        className="cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all"
                        onClick={() => setSelectedCategory(cat.id)}
                      >
                        <CardHeader className="text-center pb-4">
                          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full ${cat.bgColor} mx-auto mb-3`}>
                            <cat.icon className={`h-7 w-7 ${cat.color}`} />
                          </div>
                          <CardTitle className="text-lg">{cat.title}</CardTitle>
                          <CardDescription>{cat.description}</CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="max-w-xl mx-auto text-left">
                    <CardHeader>
                      {(() => {
                        const cat = ticketCategories.find(c => c.id === selectedCategory);
                        if (!cat) return null;
                        return (
                          <div className="flex items-center gap-3">
                            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${cat.bgColor}`}>
                              <cat.icon className={`h-5 w-5 ${cat.color}`} />
                            </div>
                            <div>
                              <CardTitle>{cat.title}</CardTitle>
                              <CardDescription>{cat.description}</CardDescription>
                            </div>
                          </div>
                        );
                      })()}
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>{t.helpCenter.ticket.form.name} *</Label>
                            <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required maxLength={100} />
                          </div>
                          <div className="space-y-2">
                            <Label>{t.helpCenter.ticket.form.email} *</Label>
                            <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required maxLength={255} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>{t.helpCenter.ticket.form.phone}</Label>
                          <Input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} maxLength={20} />
                        </div>
                        <div className="space-y-2">
                          <Label>{t.helpCenter.ticket.form.subject} *</Label>
                          <Input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required maxLength={200} />
                        </div>
                        <div className="space-y-2">
                          <Label>{t.helpCenter.ticket.form.message} *</Label>
                          <Textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required rows={5} maxLength={2000} />
                        </div>
                        <div className="flex gap-3 pt-2">
                          <Button type="button" variant="outline" onClick={() => setSelectedCategory(null)} className="flex-1">
                            {t.helpCenter.ticket.form.back}
                          </Button>
                          <Button type="submit" disabled={isSubmitting} className="flex-1">
                            {isSubmitting ? '...' : <><Send className="h-4 w-4 mr-2" />{t.helpCenter.ticket.form.submit}</>}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
