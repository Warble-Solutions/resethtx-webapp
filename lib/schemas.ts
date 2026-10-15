const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://resethtx.com'

export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['BarOrPub', 'Restaurant', 'NightClub'],
    name: 'Reset HTX',
    alternateName: 'Reset Rooftop Lounge Houston',
    description: "Houston's premier rooftop lounge in Midtown. Featuring craft cocktails, elevated rooftop dining, weekday happy hours, private event venue rentals, and curated nightlife.",
    url: BASE_URL,
    logo: `${BASE_URL}/logos/logo-main.png`,
    image: [
      `${BASE_URL}/logos/logo-main.png`,
      `${BASE_URL}/private_page/5.jpeg`,
      `${BASE_URL}/events_cover/friday_exchange.jpeg`,
    ],
    telephone: '(832) 281-9991',
    email: 'resethtx@gmail.com',
    priceRange: '$$',
    servesCuisine: ['American', 'Bar Bites', 'Small Plates', 'Cocktails'],
    hasMenu: `${BASE_URL}/menu`,
    acceptsReservations: 'True',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '606 Dennis St Ste 200',
      addressLocality: 'Houston',
      addressRegion: 'TX',
      postalCode: '77006',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 29.7483,
      longitude: -95.3789,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Wednesday', 'Thursday'],
        opens: '16:00',
        closes: '00:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Friday'],
        opens: '16:00',
        closes: '02:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '18:00',
        closes: '02:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '15:00',
        closes: '22:00',
      },
    ],
    sameAs: [
      'https://www.instagram.com/resethtx',
      'https://www.facebook.com/resethtx',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '150',
      bestRating: '5',
      worstRating: '1',
    },
  }
}

export const HOMEPAGE_FAQS = [
  {
    question: 'What are Reset HTX’s hours of operation?',
    answer:
      'We are open Wednesday through Sunday. Wednesday & Thursday: 4:00 PM – 12:00 AM (Happy Hour 4–8 PM). Friday: 4:00 PM – 2:00 AM (Happy Hour 4–8 PM, nightlife until 2 AM). Saturday: 6:00 PM – 2:00 AM. Sunday: 3:00 PM – 10:00 PM (Daytime lounge & brunch vibe). Closed Mondays and Tuesdays.',
  },
  {
    question: 'What is the dress code at Reset HTX?',
    answer:
      'Our dress code is Upscale Chic. We encourage our guests to dress to impress. Please note that athletic wear, flip flops, jerseys, and excessively baggy clothing are not permitted.',
  },
  {
    question: 'Is valet or street parking available?',
    answer:
      'Yes, convenient valet parking is available right at our entrance on 606 Dennis St for $15 ($10 discounted valet during Wednesday–Friday Happy Hour). Limited street parking is also available in the surrounding Midtown area.',
  },
  {
    question: 'Can I host a private event or corporate buyout?',
    answer:
      'Absolutely. Reset HTX hosts private gatherings from intimate client dinners of 10+ guests up to full rooftop venue buyouts of 450 guests. We offer custom catering menus, craft cocktail packages, full AV capabilities, and skyline views. Inquire via our Venue Rental page.',
  },
]

export function getFaqSchema(faqs: Array<{ question: string; answer: string }> = HOMEPAGE_FAQS) {
  const list = Array.isArray(faqs) ? faqs : HOMEPAGE_FAQS
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: list.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function getMenuSchema(items: Array<{ name: string; description?: string; price?: number; category?: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: 'Reset HTX Rooftop Lounge & Kitchen Menu',
    url: `${BASE_URL}/menu`,
    hasMenuItem: items.map((item) => ({
      '@type': 'MenuItem',
      name: item.name,
      description: item.description || '',
      offers: {
        '@type': 'Offer',
        price: item.price ?? 0,
        priceCurrency: 'USD',
      },
      menuAddOn: item.category || 'Bar Bites',
    })),
  }
}

export function getEventSchema(event: {
  title: string
  date: string
  description?: string
  image_url?: string
  price?: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.date,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Reset HTX',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '606 Dennis St Ste 200',
        addressLocality: 'Houston',
        addressRegion: 'TX',
        postalCode: '77006',
        addressCountry: 'US',
      },
    },
    image: event.image_url ? [event.image_url] : [`${BASE_URL}/logos/logo-main.png`],
    description: event.description || `Join us at Reset HTX for ${event.title}.`,
    offers: {
      '@type': 'Offer',
      price: event.price ?? 0,
      priceCurrency: 'USD',
      url: `${BASE_URL}/events`,
      availability: 'https://schema.org/InStock',
    },
    organizer: {
      '@type': 'Organization',
      name: 'Reset HTX',
      url: BASE_URL,
    },
  }
}
