import React from 'react';
import BlogPostItem from '@theme-original/BlogPostItem';
import Head from '@docusaurus/Head';
import { useLocation } from '@docusaurus/router';
import Remark42 from '@site/src/components/Remark42';

export default function BlogPostItemWrapper(props) {
  const location = useLocation();

  // Check if we're on a full blog post page
  const isBlogPostPage =
    location.pathname.startsWith('/blog/') &&
    location.pathname !== '/blog' &&
    location.pathname !== '/blog/' &&
    !location.pathname.includes('/tags') &&
    !location.pathname.includes('/author') &&
    !location.pathname.includes('/page/');

  return (
    <>
      <BlogPostItem {...props} />
      {isBlogPostPage && (
        <>
          <Head>
            <meta property="og:type" content="article" />
          </Head>
          <Remark42 />
        </>
      )}
    </>
  );
}
