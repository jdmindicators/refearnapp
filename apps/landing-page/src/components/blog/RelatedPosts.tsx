// apps/landing-page/src/components/blog/RelatedPosts.tsx
import React from 'react';

interface RelatedPost {
  title: string;
  date: string;
  slug: string;
  image: string;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ posts }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="mt-20 border-t border-slate-200 pt-12">
      <h2 className="mb-8 text-2xl font-black tracking-tight text-slate-900">
        Continue Reading
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((post) => (
          <a
            href={`/blog/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/10"
          >
            <div className="relative aspect-16/10 w-full overflow-hidden border-b border-slate-100">
              <img
                src={post.image}
                alt={post.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <time className="mb-2 text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">
                {post.date}
              </time>
              <h3 className="line-clamp-2 text-sm leading-snug font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
                {post.title}
              </h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;