import React from 'react'

interface Props {
  header: Boolean
  scripts: Boolean
  noScripts: Boolean
}

const Head: React.FC<Props> = ({header, scripts, noScripts}) => {
  return header ? (
    <React.Fragment>
      {/* prevent robots and crowlers from indexing website */}
      <meta name='robots' key='noindex' content='noindex,nofollow' />
      {/* icons for page */}
      <link
        rel='icon'
        type='image/png'
        sizes='32x32'
        href='/static/images/favicon/favicon-32x32.png'
      />
      <link
        rel='icon'
        type='image/png'
        sizes='96x96'
        href='/static/images/favicon/favicon-96x96.png'
      />
      <link
        rel='icon'
        type='image/png'
        sizes='16x16'
        href='/static/images/favicon/favicon-16x16.png'
      />

      {scripts ? (
        <React.Fragment>
          {/*  google tag manager */}
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || []
              window.dataLayer.push({
                originalLocation:
                  document.location.protocol +
                  '//' +
                  document.location.hostname +
                  document.location.pathname +
                  document.location.search
              })`,
            }}
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                            })(window,document,'script','dataLayer','${process.env.GTM_CODE}');`,
            }}
          ></script>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  ) : noScripts ? (
    // Google Tag Manager (noscript)
    <noscript>
      <iframe
        title={'tag manager'}
        src={`https://www.googletagmanager.com/ns.html?id=${process.env.GTM_CODE}`}
        height='0'
        width='0'
        style={{display: 'none', visibility: 'hidden'}}
      ></iframe>
    </noscript>
  ) : // Google Tag Manager (noscript)
  null
}

export default Head
