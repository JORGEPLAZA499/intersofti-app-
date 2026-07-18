
import { useLanguage } from '@/i18n/LanguageContext';
import { Link } from 'react-router-dom';

const postSlugs = ['future-encrypted-communication', 'digital-privacy-matters', 'ghostcode-s10-new-era'];
const postDates = ['2024-01-15', '2024-02-10', '2024-03-05'];

export default function Blog() {
  const { t } = useLanguage();

  return (
    <>
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-12 text-center text-foreground">{t.blog.title}</h1>
          <div className="space-y-8">
            {t.blog.posts.slice(0, 3).map((post, i) => (
              <article key={postSlugs[i]} className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-colors">
                <time className="text-sm text-muted-foreground">{postDates[i]}</time>
                <h2 className="text-2xl font-semibold mt-2 mb-3 text-foreground">{post.title}</h2>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <Link to={`/blog/${postSlugs[i]}`} className="text-primary hover:underline text-sm">{t.blog.readMore} →</Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}