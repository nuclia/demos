import Head from "next/head";

export default function Posts() {
  return (
    <div>
      <Head>
        <title>All posts</title>
      </Head>

      <main>
        <ul>
          <li>
            <a href="./posts/ada-lovelace">Ada Lovelace</a>
          </li>
          <li>
            <a href="./posts/hedy-lamarr">Hedy Lamarr</a>
          </li>
        </ul>
      </main>
    </div>
  );
}
