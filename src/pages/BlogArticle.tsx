import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { blogArticles } from '@/i18n/blogArticles';
import blog1Img from '@/assets/blog-1.avif';
import blog2Img from '@/assets/blog-2.avif';
import blog3Img from '@/assets/blog-3.avif';
import blog4Img from '@/assets/blog-4.avif';

const images: Record<string, string> = {
  '1': blog1Img,
  '2': blog2Img,
  '3': blog3Img,
  '4': blog4Img,
};

const BlogArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const articles = blogArticles[language];
  const article = articles[id || ''];
  const image = images[id || ''];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!article) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-white text-xl">{articles['1']?.notFound || 'Article not found'}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <section className="pt-24 pb-24 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate('/#noticias')}
            className="flex items-center gap-2 text-primary hover:underline mb-6 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {article.backToNews}
          </button>
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-black">{article.title}</h1>
          <figure className="mb-8">
            <img src={image} alt={article.title} className="w-full rounded-xl object-cover max-h-[400px]" />
            {article.caption && (
              <figcaption className="mt-2 text-sm text-black/50 italic">{article.caption}</figcaption>
            )}
          </figure>
          <div className="text-black/80 leading-relaxed whitespace-pre-line text-lg">
            {article.content}
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogArticle;
