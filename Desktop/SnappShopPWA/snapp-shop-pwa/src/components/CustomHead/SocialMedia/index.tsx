import React from 'react'
import Head from 'next/head'
import {useTranslation} from 'react-i18next'

interface Props {
  title: string
  description: string | undefined
  url: string
  image: string
}
export default function SocialMedia(props: Props) {
  const {t} = useTranslation()
  const {title, url, image, description} = props
  const {
    og_type,
    og_locale,
    og_site_name,
    og_locale_alternate,
    og_image_type,
    og_image_width,
    og_image_height,
    twitter_card,
    twitter_site,
    twitter_creator,
    twitter_id_iphone,
    twitter_id_ipad,
    googleplay,
    twitter_url_iphone,
    twitter_url_ipad,
    twitter_url_googlePlay,
    twitter_country,
    twitter_name_googleplay,
    twitter_name_ipad,
    twitter_name_iphone,
  } = t('seo.socialMedia', {returnObjects: true})
  return (
    <Head>
      <meta property='og:title' content={title} />
      <meta property='og:sitename' content={og_site_name} />
      <meta property='og:url' content={url} />
      <meta property='og:image' content={image} />
      <meta property='og:type' content={og_type} />
      <meta property='og:locale' content={og_locale} />
      <meta property='og:locale:alternate' content={og_locale_alternate} />
      <meta property='og:image:secure_url' content={image} />
      <meta property='og:image:type' content={og_image_type} />
      <meta property='og:image:width' content={og_image_width} />
      <meta property='og:image:height' content={og_image_height} />
      <meta name='twitter:card' content={twitter_card} />
      <meta name='twitter:site' content={twitter_site} />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:text:description' content={description} />
      <meta name='twitter:creator' content={twitter_creator} />
      <meta name='twitter:url' content={url} />
      <meta name='twitter:image' content={image} />
      <meta property='twitter:app:id:iphone' content={twitter_id_iphone} />
      <meta property='twitter:app:id:ipad' content={twitter_id_ipad} />
      <meta property='twitter:app:id:googleplay' content={googleplay} />
      <meta property='twitter:app:url:iphone' content={twitter_url_iphone} />
      <meta property='twitter:app:url:ipad' content={twitter_url_ipad} />
      <meta
        property='twitter:app:url:googleplay'
        content={twitter_url_googlePlay}
      />
      <meta property='twitter:app:country' content={twitter_country} />
      <meta
        property='twitter:app:name:googleplay'
        content={twitter_name_googleplay}
      />
      <meta property='twitter:app:name:ipad' content={twitter_name_ipad} />
      <meta property='twitter:app:name:iphone' content={twitter_name_iphone} />
    </Head>
  )
}
