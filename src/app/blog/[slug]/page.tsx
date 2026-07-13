import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { Section, CTABand } from "@/components/ui";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { articleSchema } from "@/lib/schema";

export const dynamicParams = false;
export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-static";
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    type: "article",
    keywords: post.tags,
    publishedTime: post.publishedAt.toISOString(),
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, all] = await Promise.all([getBlogPostBySlug(slug), getBlogPosts()]);
  if (!post) notFound();

  const related = all.filter((p) => p.slug !== slug).slice(0, 3);
  const paragraphs = post.body.split("\n").filter(Boolean);

  return (
    <>
      <JsonLd
        data={articleSchema({
          title: post.title,
          description: post.excerpt,
          path: `/blog/${slug}`,
          author: post.author,
          publishedTime: post.publishedAt.toISOString(),
          modifiedTime: post.updatedAt.toISOString(),
        })}
      />
      <Breadcrumbs
        items={[
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${slug}` },
        ]}
      />
      <article>
        <div className="surface-subtle border-b">
          <div className="container-page py-12">
            <div className="mb-3 flex flex-wrap gap-1">
              {post.tags.map((t) => (
                <span key={t} className="rounded-full border px-2 py-0.5 text-xs text-muted">
                  {t}
                </span>
              ))}
            </div>
            <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight md:text-4xl">
              {post.title}
            </h1>
            <p className="mt-3 text-sm text-muted">
              By {post.author} · {post.readMinutes} min read ·{" "}
              {post.publishedAt.toLocaleDateString("en-IN", { dateStyle: "medium" })}
            </p>
          </div>
        </div>
        <Section>
          <div className="prose-content mx-auto max-w-3xl">
            <p className="text-lg">{post.excerpt}</p>
            {paragraphs.map((p, i) =>
              p.startsWith("## ") ? (
                <h2 key={i}>{p.replace("## ", "")}</h2>
              ) : (
                <p key={i}>{p}</p>
              ),
            )}
          </div>
        </Section>
      </article>
      {related.length > 0 && (
        <Section muted>
          <h2 className="mb-6 text-xl font-bold">Related articles</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="card p-5 hover:border-[var(--primary)]">
                <h3 className="font-bold">{p.title}</h3>
                <p className="mt-1 text-sm text-muted">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </Section>
      )}
      <CTABand />
    </>
  );
}
