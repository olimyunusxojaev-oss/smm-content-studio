import { PostVariant } from '@/types/post';

/**
 * Format a complete post for clean clipboard copy
 */
export const formatFullPost = (variant: PostVariant): string => {
  const parts: string[] = [];

  if (variant.headline) {
    parts.push(variant.headline.trim());
  }

  if (variant.body) {
    parts.push(variant.body.trim());
  }

  if (variant.cta) {
    parts.push(`👉 ${variant.cta.trim()}`);
  }

  if (variant.hashtags && variant.hashtags.length > 0) {
    const formattedTags = variant.hashtags
      .map(tag => tag.startsWith('#') ? tag : `#${tag}`)
      .join(' ');
    parts.push(formattedTags);
  }

  return parts.join('\n\n');
};
