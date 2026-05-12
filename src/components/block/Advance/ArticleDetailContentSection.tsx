import type { ReactNode } from 'react'

interface ArticleDetailContentData {
  // All content comes from articleItem; no extra CMS fields needed
}

interface ArticleDetailContentProps {
  data:         ArticleDetailContentData
  articleItem?: any
}

function renderLexicalNode(node: any, idx: number | string): ReactNode {
  if (!node) return null

  switch (node.type) {
    case 'text': {
      let content: ReactNode = node.text ?? ''
      if (!content) return null
      const fmt = node.format ?? 0
      if (fmt & 1)  content = <strong>{content}</strong>
      if (fmt & 2)  content = <em>{content}</em>
      if (fmt & 4)  content = <s>{content}</s>
      if (fmt & 8)  content = <u>{content}</u>
      return content
    }

    case 'linebreak':
      return <br key={idx} />

    case 'paragraph': {
      const children = node.children?.map((c: any, i: number) => renderLexicalNode(c, i)) ?? []
      const isEmpty   = children.every((c: ReactNode) => c === null || c === '' || c === undefined)
      if (isEmpty) return <div key={idx} style={{ height: '16px' }} />
      return (
        <p
          key={idx}
          style={{
            fontFamily: 'var(--font-work-sans, sans-serif)',
            fontSize:   '18px',
            color:      '#404040',
            lineHeight: '29.25px',
            margin:     '0 0 20px',
          }}
        >
          {children}
        </p>
      )
    }

    case 'heading': {
      const tag      = node.tag ?? 'h2'
      const children = node.children?.map((c: any, i: number) => renderLexicalNode(c, i)) ?? []
      const baseStyle = {
        fontFamily: 'var(--font-work-sans, sans-serif)',
        fontWeight: 400 as const,
        color:      '#171717',
        margin:     '32px 0 16px',
      }
      if (tag === 'h2') return <h2 key={idx} style={{ ...baseStyle, fontSize: '30px', lineHeight: '36px' }}>{children}</h2>
      if (tag === 'h3') return <h3 key={idx} style={{ ...baseStyle, fontSize: '24px', lineHeight: '32px' }}>{children}</h3>
      return <h4 key={idx} style={{ ...baseStyle, fontSize: '20px', lineHeight: '28px' }}>{children}</h4>
    }

    case 'list': {
      const children = node.children?.map((c: any, i: number) => renderLexicalNode(c, i)) ?? []
      if (node.listType === 'number') {
        return (
          <ol key={idx} style={{ paddingLeft: '24px', margin: '16px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {children}
          </ol>
        )
      }
      return (
        <ul key={idx} style={{ paddingLeft: 0, margin: '16px 0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {children}
        </ul>
      )
    }

    case 'listitem': {
      const children  = node.children?.map((c: any, i: number) => renderLexicalNode(c, i)) ?? []
      const isOrdered = node.value != null

      if (isOrdered) {
        return (
          <li key={idx} style={{ fontFamily: 'var(--font-work-sans, sans-serif)', fontSize: '18px', color: '#404040', lineHeight: '29.25px' }}>
            {children}
          </li>
        )
      }

      return (
        <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <span
            style={{
              flexShrink:     0,
              width:          '24px',
              height:         '24px',
              borderRadius:   '9999px',
              background:     '#171717',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              marginTop:      '3px',
            }}
          >
            <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
              <path d="M1 4.5L4.5 8L11 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span
            style={{
              fontFamily: 'var(--font-work-sans, sans-serif)',
              fontSize:   '18px',
              color:      '#404040',
              lineHeight: '29.25px',
            }}
          >
            {children}
          </span>
        </li>
      )
    }

    case 'quote': {
      const children = node.children?.map((c: any, i: number) => renderLexicalNode(c, i)) ?? []
      return (
        <blockquote
          key={idx}
          style={{
            borderLeft:  '4px solid #e5e5e5',
            paddingLeft: '24px',
            margin:      '24px 0',
            fontStyle:   'italic',
            color:       '#525252',
            fontFamily:  'var(--font-work-sans, sans-serif)',
            fontSize:    '18px',
            lineHeight:  '29.25px',
          }}
        >
          {children}
        </blockquote>
      )
    }

    case 'upload': {
      const src = node.value?.url ?? node.url
      const alt = node.value?.alt ?? node.altText ?? ''
      if (!src) return null
      return (
        <div key={idx} style={{ margin: '32px 0' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} style={{ width: '100%', height: 'auto', borderRadius: '12px', display: 'block' }} />
        </div>
      )
    }

    case 'link':
    case 'autolink': {
      const href     = node.fields?.url ?? node.url ?? '#'
      const children = node.children?.map((c: any, i: number) => renderLexicalNode(c, i)) ?? []
      return (
        <a key={idx} href={href} style={{ color: '#171717', textDecoration: 'underline' }}>
          {children}
        </a>
      )
    }

    default:
      if (Array.isArray(node.children) && node.children.length > 0) {
        return node.children.map((c: any, i: number) => renderLexicalNode(c, `${idx}-${i}`))
      }
      return null
  }
}

export default function ArticleDetailContentSection({ data: _data, articleItem }: ArticleDetailContentProps) {
  const a     = articleItem
  const image = a?.featuredImage
  const nodes: any[] = a?.content?.root?.children ?? []

  return (
    <div
      style={{
        background:    '#ffffff',
        paddingTop:    '80px',
        paddingBottom: '80px',
        paddingLeft:   '272px',
        paddingRight:  '272px',
      }}
    >
      <div style={{ maxWidth: '896px', margin: '0 auto' }}>
        {/* Featured image */}
        {image?.url && (
          <div style={{ marginBottom: '48px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.url}
              alt={image.alt ?? a?.title ?? ''}
              style={{
                width:        '100%',
                height:       '500px',
                objectFit:    'cover',
                borderRadius: '16px',
                display:      'block',
              }}
            />
          </div>
        )}

        {/* Article body */}
        <div>
          {nodes.map((node, i) => renderLexicalNode(node, i))}
        </div>
      </div>
    </div>
  )
}
