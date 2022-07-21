import { GetStaticPaths, GetStaticProps } from 'next';
import { FaCalendar, FaUser, FaClock } from 'react-icons/fa';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useRouter } from 'next/router';
import { PrismicRichText } from '@prismicio/react';
import { RichText } from 'prismic-dom';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface PostParamsProps {
  params: {
    slug: string;
  };
}

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <Header />
      <main className={commonStyles.container}>
        <img
          src={post.data.banner?.url}
          alt="banner"
          className={styles.banner}
        />
        <div className={commonStyles.content}>
          <section className={styles.post}>
            <div>
              <strong className={styles.title}>{post.data.title}</strong>
              <div className={styles.info}>
                <time>
                  <FaCalendar />{' '}
                  {format(new Date(post.first_publication_date), 'd MMM yyy', {
                    locale: ptBR,
                  })}
                </time>
                <p>
                  <FaUser />
                  {post.data.author}
                </p>
                <p>
                  <FaClock />4 min
                </p>
              </div>
            </div>

            <div className={styles.content}>
              {post.data.content.map((postContent, index) => {
                return (
                  <div key={Number(index)}>
                    <h1 className={styles.heading}>{postContent.heading}</h1>
                    <div
                      className={styles.body}
                      dangerouslySetInnerHTML={{
                        __html: RichText.asHtml(postContent.body),
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts', {});
  const paths = [];
  posts.results.forEach(post => {
    paths.push({
      params: {
        slug: post.uid,
      },
    });
  });
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: PostParamsProps) => {
  const { slug } = params;
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', String(slug), {});

  /*
  const posts = {
    first_publication_date: format(
      new Date(response.first_publication_date),
      'II MMM yyyy',
      {
        locale: ptBR,
      }
    ),
    data: {
      title: response.data.title,
      banner: response.data.banner,
      author: response.data.author,
      content: response.data.content,
    },
  };
  */

  return {
    props: {
      post: response,
    },
  };
};
