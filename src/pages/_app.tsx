import { AppProps } from 'next/app';
import { DefaultSeo } from 'next-seo';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <DefaultSeo
      titleTemplate="%s | BikiNinjas Blog"
      defaultTitle="BikiNinjas Blog"
      description="A blog about society, mental health, video games, programming, game dev, and modding games."
      openGraph={{
        type: 'website',
        locale: 'en_US',
        url: 'https://bikininjas.github.io/',
        site_name: 'BikiNinjas Blog',
        images: [
          {
            url: 'https://bikininjas.github.io/og-image.jpg',
            width: 1200,
            height: 630,
            alt: 'BikiNinjas Blog',
          },
        ],
      }}
      twitter={{
        handle: '@bikininjas',
        site: '@bikininjas',
        cardType: 'summary_large_image',
      }}
    />
    <Component {...pageProps} />
  </>
);

export default MyApp;
