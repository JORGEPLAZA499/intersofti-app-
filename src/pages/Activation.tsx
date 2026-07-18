import { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function Activation() {
  const { t, language } = useLanguage();
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Product activated successfully!');
    setCode('');
  };

  return (
    <>
      <section className="py-32 px-4">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-5xl font-bold mb-8 text-foreground">{t.activation.title}</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">{t.activation.code}</label>
              <Input
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="XXXX-XXXX-XXXX-XXXX"
                className="text-center text-lg tracking-widest"
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg">{t.activation.activate}</Button>
            <Button type="button" variant="outline" className="w-full" size="lg" asChild>
              <Link to="/">{language === 'en' ? 'Cancel' : 'Cancelar'}</Link>
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}
