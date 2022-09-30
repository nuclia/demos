import "../styles/globals.css";
import { MDXProvider } from "@mdx-js/react";

function MyApp({ Component, pageProps }) {
  return (
    <MDXProvider>
      <Component {...pageProps} />
    </MDXProvider>
  );
}

export default MyApp;
