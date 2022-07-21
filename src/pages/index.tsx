import { GetStaticProps } from 'next';
import { FaCalendar, FaUser } from 'react-icons/fa';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';
import { useState } from 'react';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const { results, next_page } = postsPagination;

  const [posts, setPosts] = useState(results);
  const [page, setPage] = useState(next_page);

  const handleLoadPosts = (): void => {
    fetch(page)
      .then(response => response.json())
      .then(result => {
        setPage(result.next_page);
        const newPosts = result.results.map(post => {
          return {
            uid: post.uid,
            first_publication_date: format(
              new Date(post.first_publication_date),
              'II MMM yyyy',
              {
                locale: ptBR,
              }
            ),
            data: {
              title: post.data.title,
              subtitle: post.data.subtitle,
              author: post.data.author,
            },
          };
        });
        const allPosts = posts.concat(newPosts);
        setPosts(allPosts);
      });
  };

  return (
    <>
      <main className={commonStyles.container}>
        <section className={commonStyles.content}>
          <div className={styles.logo}>
            <img src="/logo.svg" alt="logo" />
          </div>
          {posts.map(post => (
            <div className={styles.post} key={post.uid}>
              <Link href={`/post/${post.uid}`}>
                <a>
                  <strong className={styles.title}>{post.data.title}</strong>
                  <p>{post.data.subtitle} </p>
                  <div className={styles.info}>
                    <time>
                      <FaCalendar />
                      {format(
                        new Date(post.first_publication_date),
                        'd MMM yyy',
                        {
                          locale: ptBR,
                        }
                      )}
                    </time>
                    <p>
                      <FaUser />
                      {post.data.author}
                    </p>
                  </div>
                </a>
              </Link>
            </div>
          ))}
          {next_page !== null && (
            <button
              type="button"
              className={styles.loadMore}
              onClick={handleLoadPosts}
            >
              Carregar mais posts
            </button>
          )}
        </section>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts', {
    pageSize: 1,
  });

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        author: post.data.author,
        subtitle: post.data.subtitle,
        title: post.data.title,
      },
    };
  });

  const postsPagination: PostPagination = {
    results: posts,
    next_page: postsResponse.next_page,
  };

  return {
    props: {
      postsPagination,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
