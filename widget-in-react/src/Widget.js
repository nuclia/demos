import React, { useEffect, useState } from 'react';

export default function Widget() {
  const [loaded, setLoaded] = useState(false);
  let loading = false;

  useEffect(() => {
    if (!loaded && !loading) {
      loading = true;
      const script = document.createElement('script');
      script.src = 'https://cdn.nuclia.cloud/nuclia-video-widget.umd.js';
      script.async = true;
      script.onload = () => {
        setLoaded(true);
        loading = false;
      };
      document.body.appendChild(script);
    }
  }, [loaded]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '2em',
      }}
    >
      <div
        style={{
          margin: '0 auto 2em',
        }}
      >
        <nuclia-search-bar
          knowledgebox="df8b4c24-2807-4888-ad6c-ae97357a638b"
          zone="europe-1"
          features="answers,navigateToLink,permalink,hideThumbnails"
        ></nuclia-search-bar>
      </div>
      <nuclia-search-results></nuclia-search-results>
    </div>
  );
}
