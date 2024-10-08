import Head from 'next/head';
import Search from '../components/Search';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Nuclia &hearts; Next.js!</h1>

        <div className={styles.description}>
          <h2>Nuclia search widget</h2>
          <script src="https://cdn.nuclia.cloud/nuclia-video-widget.umd.js"></script>
          <nuclia-search-bar knowledgebox="YOUR_KB_ID" zone="europe-1" features="answers"></nuclia-search-bar>
          <nuclia-search-results></nuclia-search-results>
        </div>

        <div className={styles.description}>
          <h2>Custom search</h2>
          <Search></Search>
        </div>
      </main>
    </div>
  );
}
