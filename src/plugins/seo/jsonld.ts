export type JsonLdInput = {
  doc: Record<string, any>
  collectionSlug: string
  siteUrl: string
  siteName: string
  siteDescription?: string
}

function breadcrumbs(slug: string, siteUrl: string, title: string) {
  const parts = slug.replace(/^\//, '').split('/').filter(Boolean)
  const items = [{ '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl }]
  let path = siteUrl
  parts.forEach((part, i) => {
    path = `${path}/${part}`
    items.push({
      '@type': 'ListItem',
      position: i + 2,
      name: i === parts.length - 1 ? title : part.replace(/-/g, ' '),
      item: path,
    })
  })
  return { '@type': 'BreadcrumbList', itemListElement: items }
}

export function buildJsonLd({ doc, collectionSlug, siteUrl, siteName, siteDescription }: JsonLdInput): object[] {
  const url = `${siteUrl}/${doc.slug ?? ''}`.replace(/\/\//g, '/')
  const title = doc.title ?? doc.name ?? siteName
  const description = doc.meta?.description ?? doc.excerpt ?? siteDescription ?? ''
  const image = doc.meta?.image?.url ?? null

  const organization = {
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    ...(siteDescription && { description: siteDescription }),
  }

  const schemaList: object[] = []

  if (collectionSlug === 'posts') {
    schemaList.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description,
      url,
      ...(image && { image }),
      ...(doc.createdAt && { datePublished: doc.createdAt }),
      ...(doc.updatedAt && { dateModified: doc.updatedAt }),
      author: { '@type': 'Organization', name: siteName },
      publisher: organization,
    })
  } else if (collectionSlug === 'portfolio') {
    schemaList.push({
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: title,
      description,
      url,
      ...(image && { image }),
      creator: organization,
    })
  } else if (collectionSlug === 'job-vacancies') {
    schemaList.push({
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title,
      description,
      url,
      hiringOrganization: organization,
      ...(doc.createdAt && { datePosted: doc.createdAt.split('T')[0] }),
      ...(doc.deadline && { validThrough: doc.deadline }),
      jobLocation: doc.location
        ? { '@type': 'Place', address: doc.location }
        : { '@type': 'Place', address: { '@type': 'PostalAddress', addressCountry: 'ID' } },
    })
  } else {
    // pages (default)
    schemaList.push({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description,
      url,
      ...(image && { image }),
      isPartOf: { '@type': 'WebSite', name: siteName, url: siteUrl },
    })
  }

  // BreadcrumbList for all types
  if (doc.slug) {
    schemaList.push({
      '@context': 'https://schema.org',
      ...breadcrumbs(doc.slug, siteUrl, title),
    })
  }

  return schemaList
}
