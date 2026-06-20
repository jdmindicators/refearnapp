// apps/landing-page/src/utils/relatedPosts.ts

/**
 * Returns 2 older + 2 newer posts relative to the current post,
 * sorted by date with slug as a tiebreaker for stable, repeatable ordering.
 *
 * This guarantees zero orphan pages: every post (including the very first
 * and very last published) always has both inbound and outbound links,
 * since "older/newer" wraps based on position in the sorted array, not
 * a fixed chain.
 */

interface PostLike {
  id: string;
  data: {
    title: string;
    date: string;
    image: string;
    imageExt?: string;
  };
}

export function getRelatedPosts(allPosts: PostLike[], currentId: string) {
  // Stable sort: date ascending, then slug as tiebreaker for same-date posts
  const sorted = [...allPosts].sort((a, b) => {
    const dateDiff = new Date(a.data.date).getTime() - new Date(b.data.date).getTime();
    if (dateDiff !== 0) return dateDiff;
    return a.id.localeCompare(b.id);
  });

  const currentIndex = sorted.findIndex((p) => p.id === currentId);
  if (currentIndex === -1) return [];

  const older = [];
  const newer = [];

  // Walk backwards for older posts
  for (let i = currentIndex - 1; i >= 0 && older.length < 2; i--) {
    older.push(sorted[i]);
  }

  // Walk forwards for newer posts
  for (let i = currentIndex + 1; i < sorted.length && newer.length < 2; i++) {
    newer.push(sorted[i]);
  }

  let related = [...older, ...newer];

  // Edge case: if we're at the very start or very end of the list,
  // backfill from the other direction so we still show up to 4 posts
  // (e.g. the oldest post has no "older" posts, so pull more "newer" ones instead)
  if (related.length < 4 && related.length < sorted.length - 1) {
    const usedIds = new Set([currentId, ...related.map((p) => p.id)]);
    for (let i = 0; i < sorted.length && related.length < 4; i++) {
      const candidate = sorted[i];
      if (!usedIds.has(candidate.id)) {
        related.push(candidate);
        usedIds.add(candidate.id);
      }
    }
  }

  return related;
}