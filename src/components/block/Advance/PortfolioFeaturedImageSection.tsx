interface MediaRef { url?: string; alt?: string }

interface PortfolioFeaturedImageData {
  image?:     MediaRef | null
  pdCaption?: string
}

interface PortfolioFeaturedImageProps {
  data:           PortfolioFeaturedImageData
  portfolioItem?: any
}

export default function PortfolioFeaturedImageSection({ data, portfolioItem }: PortfolioFeaturedImageProps) {
  // Portfolio featuredImage takes priority over block CMS image
  const image: MediaRef | null =
    portfolioItem?.featuredImage?.url
      ? { url: portfolioItem.featuredImage.url, alt: portfolioItem.featuredImage.alt ?? portfolioItem.title ?? '' }
      : data.image ?? null

  const caption = data.pdCaption ?? portfolioItem?.title ?? ''

  return (
    <div
      style={{
        background:    '#f5f5f5',
        paddingLeft:   '104px',
        paddingRight:  '104px',
        paddingTop:    '48px',
        paddingBottom: '48px',
      }}
    >
      <div
        style={{
          background:     image?.url ? 'transparent' : '#d4d4d4',
          height:         '600px',
          width:          '100%',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          overflow:       'hidden',
        }}
      >
        {image?.url ? (
          <img
            src={image.url}
            alt={image.alt ?? caption}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          caption && (
            <p
              style={{
                fontFamily: 'var(--font-work-sans, sans-serif)',
                fontSize:   '16px',
                color:      '#525252',
                margin:     0,
              }}
            >
              {caption}
            </p>
          )
        )}
      </div>
    </div>
  )
}
