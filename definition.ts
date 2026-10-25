import { f, type LinkValue } from '@briskcms/kit/fields.js';
import type { SiteDefinition } from '@briskcms/kit/site.js';
import type { RichText } from '@briskcms/kit/rich-text.js';
import type { Settings } from '@briskcms/kit/settings.js';

// A services business: what it does, who does it, what clients say, what it
// costs, its work, and how to reach it. Its services, people, testimonials,
// plans and gallery are collections, which sections show; its name and
// details are settings, which editors change. Its pages run no script.

export type Image = { asset: string; alt: string };
export type Section =
  | {
      id: string;
      type: 'hero';
      heading: string;
      body: string;
      image: Image;
      cta: LinkValue;
      ctaLabel: string;
    }
  | Showing
  | {
      id: string;
      type: 'pricing';
      heading: string;
      intro: string;
      cta: LinkValue;
      ctaLabel: string;
    }
  | {
      id: string;
      type: 'call-to-action';
      heading: string;
      body: string;
      action: LinkValue;
      actionLabel: string;
    }
  | { id: string; type: 'text'; heading: string; body: string };
/** A section showing a collection, or the contact details: a heading and an introduction. */
export type Showing = {
  id: string;
  type: 'services' | 'team' | 'testimonials' | 'gallery' | 'contact';
  heading: string;
  intro: string;
};
export type FaqItem = { question: string; answer: string };
export type Page = {
  slug: string;
  title: string;
  description: string;
  updatedAt?: string | undefined;
  publishedAt?: string | undefined;
  faqs: FaqItem[];
  sections: Section[];
};
export type Post = {
  slug: string;
  title: string;
  description: string;
  headline: string;
  summary: string;
  cover: Image;
  body: RichText;
  author: string;
  status: 'published' | 'unpublished';
  updatedAt?: string | undefined;
  publishedAt?: string | undefined;
  faqs: FaqItem[];
};
export type Author = {
  slug: string;
  name: string;
  bio?: string | undefined;
  kind?: 'organization' | undefined;
};
export type NavigationEntry =
  | (({ page: string } | { post: string } | { blog: true }) & {
      label?: string | undefined;
    })
  // Another website, under its own label.
  | { url: string; label: string };
export type Service = {
  slug: string;
  name: string;
  summary: string;
  image: Image;
};
export type Person = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  photo: Image;
};
export type Testimonial = {
  slug: string;
  quote: string;
  name: string;
  detail: string;
};
export type Plan = {
  slug: string;
  name: string;
  price: string;
  period: string;
  summary: string;
  /** What it includes, one item a line. */
  includes: string;
  emphasis: 'standard' | 'highlighted';
};
export type GalleryImage = { slug: string; image: Image; caption: string };
export type Content = {
  version: 1;
  pages: Page[];
  posts: Post[];
  authors: Author[];
  navigation: NavigationEntry[];
  blog: { title: string; description: string };
  redirects: { from: string; to: string }[];
  gone: string[];
  /** Who the business is and how to reach it. */
  settings: Settings;
  collections: {
    services: Service[];
    team: Person[];
    testimonials: Testimonial[];
    plans: Plan[];
    gallery: GalleryImage[];
  };
};

const image = (asset: string, alt: string) => ({ asset, alt });
const paragraphs = (...texts: string[]): RichText =>
  texts.map((text) => ({ t: 'p' as const, c: [text] }));
// A section that shows a collection: its heading and introduction.
const showing = (label: string, description: string) => ({
  label,
  description,
  fields: {
    heading: f.text('Heading', 120),
    intro: f.text('Introduction', 300),
  },
});
// Drawn for this package: placeholders a business replaces with its own.
const assets = [
  [
    'garden-hero.svg',
    'A garden of trees, shrubs and a sandy path under a low sun',
    1600,
    900,
  ],
  [
    'service-design.svg',
    'A garden plan drawn on paper, with a dotted path',
    1200,
    800,
  ],
  [
    'service-planting.svg',
    'Young flowering plants in a freshly dug bed',
    1200,
    800,
  ],
  [
    'service-care.svg',
    'A mown, striped lawn between two rounded shrubs',
    1200,
    800,
  ],
  [
    'gallery-courtyard.svg',
    'A paved courtyard with two planted terracotta boxes',
    1200,
    800,
  ],
  [
    'gallery-backyard.svg',
    'A backyard lawn with a tree and a timber bench',
    1200,
    800,
  ],
  [
    'gallery-natives.svg',
    'A bed of native grasses with small red flowers',
    1200,
    800,
  ],
  [
    'gallery-vegetables.svg',
    'Two raised vegetable beds with seedlings',
    1200,
    800,
  ],
  [
    'gallery-path.svg',
    'A sandy path winding between shrubs and flowers',
    1200,
    800,
  ],
  [
    'gallery-pots.svg',
    'A row of terracotta pots holding round shrubs',
    1200,
    800,
  ],
  ['team-maya.svg', 'An illustrated portrait in a green shirt', 800, 800],
  ['team-sam.svg', 'An illustrated portrait in a rust shirt', 800, 800],
  ['team-lena.svg', 'An illustrated portrait in a blue shirt', 800, 800],
] as const;
const art = (asset: (typeof assets)[number][0]) =>
  image(asset, assets.find(([name]) => name === asset)![1]);

export const services: SiteDefinition = {
  id: 'services',
  name: 'Services business',
  contentVersion: 1,
  assets: assets.map(([asset, alt, width, height]) => ({
    asset,
    alt,
    width,
    height,
  })),
  components: {
    hero: {
      label: 'Hero',
      description:
        'Opens every page: its heading, an introduction, an image and a call to action.',
      fields: {
        heading: f.text('Heading', 120),
        body: f.text('Introduction', 400),
        image: f.image('Image'),
        cta: f.link('Call to action', {
          email: true,
          phone: true,
          external: true,
        }),
        ctaLabel: f.text('Call to action label', 40),
      },
    },
    services: showing(
      'Services',
      'Every service the business offers (the services collection), as cards; not shown while the collection is empty.',
    ),
    team: showing(
      'Team',
      'Everyone in the team collection, with their role and a short bio; not shown while the collection is empty.',
    ),
    testimonials: showing(
      'Testimonials',
      'Every quote in the testimonials collection; not shown while the collection is empty.',
    ),
    pricing: {
      label: 'Pricing',
      description:
        'Every plan in the plans collection, with its price and what it includes, then a call to action; not shown while the collection is empty.',
      fields: {
        heading: f.text('Heading', 120),
        intro: f.text('Introduction', 300),
        cta: f.link('Call to action', {
          email: true,
          phone: true,
          external: true,
        }),
        ctaLabel: f.text('Call to action label', 40),
      },
    },
    gallery: showing(
      'Gallery',
      'Every image in the gallery collection, with its caption; not shown while the collection is empty.',
    ),
    contact: showing(
      'Contact',
      'How to reach the business, from the site settings: phone, email, address with a link to a map, opening hours and pages elsewhere, each where it is given.',
    ),
    'call-to-action': {
      label: 'Call to action',
      description:
        'A heading, a line of text and a button: to a page, an email address, a phone number or another website (a booking page). A static site sends no forms.',
      fields: {
        heading: f.text('Heading', 120),
        body: f.text('Text', 400),
        action: f.link('Where it leads', {
          email: true,
          phone: true,
          external: true,
        }),
        actionLabel: f.text('Button label', 40),
      },
    },
    text: {
      label: 'Text',
      description:
        'A heading and plain text; a blank line starts a new paragraph.',
      fields: {
        heading: f.text('Heading', 120),
        body: f.body('Text', 4000),
      },
    },
  },
  collections: {
    services: {
      label: 'Services',
      description: 'What the business does, each with an image.',
      max: 24,
      fields: {
        name: f.text('Name', 60),
        summary: f.text('Summary', 300),
        image: f.image('Image'),
      },
    },
    team: {
      label: 'Team',
      description: 'The people who do the work.',
      max: 24,
      fields: {
        name: f.text('Name', 80),
        role: f.text('Role', 80),
        bio: f.text('Bio', 400),
        photo: f.image('Photo'),
      },
    },
    testimonials: {
      label: 'Testimonials',
      description:
        'What clients say, with their consent: the quote, a name and a short detail (such as "Homeowner, Lane Cove").',
      max: 24,
      fields: {
        quote: f.text('Quote', 600),
        name: f.text('Name', 80),
        detail: f.text('Detail', 80),
      },
    },
    plans: {
      label: 'Plans',
      description:
        'Prices: each plan’s name, price and period, a summary and what it includes. A highlighted plan stands out.',
      max: 6,
      fields: {
        name: f.text('Name', 40),
        price: f.text('Price (such as $95 or From $1,200)', 40),
        period: f.text('Period (such as a visit)', 40),
        summary: f.text('Summary', 300),
        includes: f.body('What it includes, one item a line', 1000),
        emphasis: f.choice('Emphasis', ['standard', 'highlighted']),
      },
    },
    gallery: {
      label: 'Gallery',
      description: 'Images of the work, each with a caption.',
      max: 48,
      fields: {
        image: f.image('Image'),
        caption: f.text('Caption', 160),
      },
    },
  },
  page: { opening: 'hero', maxSections: 12, maxFaqs: 12 },
  postPrefix: 'news',
  fixedRoutes: ['home'],
  navigation: { max: 8 },
  // No scripts but structured data, and its font from its own files.
  security: { scripts: 'none', fonts: true },
  // Its name and details are settings, which editors change.
  settings: {},
  seo: { lang: 'en-AU', timeZone: 'Australia/Sydney' },
  // A fictional business, with details reserved for fiction: a number in
  // ACMA's range for drama, and example.com.
  seed: {
    version: 1,
    pages: [
      {
        slug: 'home',
        title: 'Quillwood Gardens — garden design and care in Sydney',
        description:
          'Quillwood Gardens designs, plants and looks after gardens across Sydney. See what we do, what it costs and how to book a visit.',
        faqs: [
          {
            question: 'Which suburbs do you work in?',
            answer:
              'Most of Sydney, from the Inner West to the Northern Beaches. Ask us if you are further out.',
          },
          {
            question: 'Do you look after gardens you didn’t design?',
            answer:
              'Yes. Most of the gardens we care for were planted by someone else.',
          },
          {
            question: 'How soon can you start?',
            answer:
              'A consultation is usually within two weeks, and a design takes about a month from the first visit.',
          },
        ],
        sections: [
          {
            id: 'intro',
            type: 'hero',
            heading: 'Gardens planned for the way you live',
            body: 'We design, plant and look after gardens across Sydney, from small courtyards to family backyards.',
            image: art('garden-hero.svg'),
            cta: { page: 'contact' },
            ctaLabel: 'Book a visit',
          },
          {
            id: 'services',
            type: 'services',
            heading: 'What we do',
            intro: 'Three ways we can help, on their own or together.',
          },
          {
            id: 'testimonials',
            type: 'testimonials',
            heading: 'What our clients say',
            intro: 'A few words from gardens we design and look after.',
          },
          {
            id: 'start',
            type: 'call-to-action',
            heading: 'Not sure where to start?',
            body: 'An hour in your garden with one of our designers is the easiest first step.',
            action: { phone: '+61255501234' },
            actionLabel: 'Call us',
          },
        ],
      },
      {
        slug: 'services',
        title: 'Our services — garden design, planting and care',
        description:
          'Garden design, planting and regular care from Quillwood Gardens, with prices for a consultation, a full design and each care visit.',
        faqs: [],
        sections: [
          {
            id: 'intro',
            type: 'hero',
            heading: 'From the first sketch to the weekly visit',
            body: 'Choose the help you need: a plan to follow yourself, a garden planted for you, or regular care.',
            image: art('gallery-backyard.svg'),
            cta: { page: 'contact' },
            ctaLabel: 'Ask for a quote',
          },
          {
            id: 'services',
            type: 'services',
            heading: 'Our services',
            intro: 'Each starts with a visit to your garden.',
          },
          {
            id: 'pricing',
            type: 'pricing',
            heading: 'Prices',
            intro:
              'Prices include GST. Planting is quoted once the design is agreed.',
            cta: { page: 'contact' },
            ctaLabel: 'Book a consultation',
          },
          {
            id: 'start',
            type: 'call-to-action',
            heading: 'Questions about a service?',
            body: 'Email us a few photos of your garden and we’ll tell you where we would start.',
            action: { email: 'hello@example.com' },
            actionLabel: 'Email us',
          },
        ],
      },
      {
        slug: 'about',
        title:
          'About Quillwood Gardens — the people who look after your garden',
        description:
          'Meet the small team behind Quillwood Gardens, and see some of the courtyards, backyards and beds we have designed and planted.',
        faqs: [],
        sections: [
          {
            id: 'intro',
            type: 'hero',
            heading: 'A small team that knows Sydney gardens',
            body: 'We started Quillwood to make gardens that suit the people who use them, and the climate they grow in.',
            image: art('gallery-path.svg'),
            cta: { page: 'services' },
            ctaLabel: 'See our services',
          },
          {
            id: 'story',
            type: 'text',
            heading: 'How we work',
            body: 'Every garden starts with a visit. We walk it with you, ask how you use it, and look at the soil, the light and what already grows well.\n\nThen we draw a plan, choose plants that suit, and either plant it for you or hand it over for you to build at your own pace.',
          },
          {
            id: 'team',
            type: 'team',
            heading: 'Our team',
            intro: 'The people you’ll meet in your garden.',
          },
          {
            id: 'gallery',
            type: 'gallery',
            heading: 'Recent work',
            intro: 'A few of the gardens we have designed and planted.',
          },
        ],
      },
      {
        slug: 'contact',
        title: 'Contact Quillwood Gardens — book a visit or ask a question',
        description:
          'Call, email or visit Quillwood Gardens to book a consultation or ask about a garden. Our opening hours and address are here.',
        faqs: [],
        sections: [
          {
            id: 'intro',
            type: 'hero',
            heading: 'Talk to us about your garden',
            body: 'Call or email us to book a consultation, or ask a question. We reply within a working day.',
            image: art('gallery-courtyard.svg'),
            cta: { email: 'hello@example.com' },
            ctaLabel: 'Email us',
          },
          {
            id: 'contact',
            type: 'contact',
            heading: 'Get in touch',
            intro: 'Our office is open on weekdays and Saturday mornings.',
          },
        ],
      },
    ],
    posts: [
      {
        slug: 'getting-a-garden-ready-for-summer',
        title: 'Getting a garden ready for summer — Quillwood Gardens',
        description:
          'Five things to do in spring so a Sydney garden comes through the summer heat: mulch, water deeply, feed, prune and plan for shade.',
        headline: 'Getting a garden ready for summer',
        summary:
          'A few hours of work in spring saves a garden from the worst of the summer heat.',
        cover: art('gallery-natives.svg'),
        body: paragraphs(
          'Mulch every bed to about seven centimetres, and keep it clear of stems.',
          'Water deeply once or twice a week rather than a little every day, so roots grow down.',
          'Feed in early spring, prune after flowering, and plan some shade for the plants that need it in January.',
        ),
        author: 'quillwood',
        status: 'published',
        publishedAt: '2026-10-01T00:00:00.000Z',
        faqs: [],
      },
    ],
    authors: [
      { slug: 'quillwood', name: 'Quillwood Gardens', kind: 'organization' },
    ],
    navigation: [
      { page: 'home' },
      { page: 'services', label: 'Services' },
      { page: 'about', label: 'About' },
      { blog: true, label: 'News' },
      { page: 'contact', label: 'Contact' },
    ],
    blog: {
      title: 'News from Quillwood Gardens — seasonal notes and tips',
      description:
        'Seasonal notes from Quillwood Gardens: what to plant, when to prune and how to keep a Sydney garden going through summer.',
    },
    redirects: [],
    gone: [],
    settings: {
      name: 'Quillwood Gardens',
      tagline: 'Garden design and care in Sydney',
      summary:
        'Quillwood Gardens designs, plants and looks after gardens across Sydney, from small courtyards to family backyards.',
      phone: '+61255501234',
      email: 'hello@example.com',
      address: {
        street: '12 Example Street',
        locality: 'Sydney',
        region: 'NSW',
        postcode: '2000',
        country: 'AU',
      },
      hours: [
        {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          opens: '07:30',
          closes: '16:30',
        },
        { days: ['saturday'], opens: '08:00', closes: '12:00' },
      ],
      hoursNote: 'Closed on public holidays.',
      footer: 'Looking after Sydney gardens since 2014.',
    },
    collections: {
      services: [
        {
          slug: 'garden-design',
          name: 'Garden design',
          summary:
            'A plan for the whole garden, drawn with you: its layout, paths, planting and the way you’ll use it.',
          image: art('service-design.svg'),
        },
        {
          slug: 'planting',
          name: 'Planting',
          summary:
            'Plants chosen for your soil, your light and your time, put in properly and watered in.',
          image: art('service-planting.svg'),
        },
        {
          slug: 'garden-care',
          name: 'Garden care',
          summary:
            'Regular visits to prune, weed, feed and mow, so the garden keeps the shape it was planned for.',
          image: art('service-care.svg'),
        },
      ],
      team: [
        {
          slug: 'maya',
          name: 'Maya Collins',
          role: 'Garden designer',
          bio: 'Maya draws every Quillwood garden, and has spent twelve years learning what grows well in Sydney clay.',
          photo: art('team-maya.svg'),
        },
        {
          slug: 'sam',
          name: 'Sam Okafor',
          role: 'Head gardener',
          bio: 'Sam leads the care team, and knows most of the gardens we look after by their roses.',
          photo: art('team-sam.svg'),
        },
        {
          slug: 'lena',
          name: 'Lena Ruiz',
          role: 'Horticulturist',
          bio: 'Lena chooses the plants, buys them from local nurseries and checks that they settle in.',
          photo: art('team-lena.svg'),
        },
      ],
      testimonials: [
        {
          slug: 'priya',
          quote:
            'Our backyard went from bare lawn to the place we spend every weekend. The plan was clear, and the planting took two days.',
          name: 'Priya',
          detail: 'Homeowner, Lane Cove',
        },
        {
          slug: 'tom',
          quote:
            'They turn up when they say they will, every second Thursday. The garden has never looked better.',
          name: 'Tom',
          detail: 'Homeowner, Marrickville',
        },
        {
          slug: 'alex-and-jo',
          quote:
            'We asked for a courtyard that needed little water and less time. That is exactly what we got.',
          name: 'Alex and Jo',
          detail: 'Apartment owners, Surry Hills',
        },
      ],
      plans: [
        {
          slug: 'consultation',
          name: 'Consultation',
          price: '$150',
          period: 'a visit',
          summary:
            'An hour in your garden with a designer, and a written list of what to do next.',
          includes:
            'A one-hour visit\nWritten recommendations\nA plant list for your conditions',
          emphasis: 'standard',
        },
        {
          slug: 'design',
          name: 'Garden design',
          price: 'From $1,200',
          period: 'a design',
          summary:
            'A full plan for your garden, drawn with you, ready for us or anyone else to build.',
          includes:
            'A site visit and measure\nA scaled plan and planting list\nTwo rounds of changes',
          emphasis: 'highlighted',
        },
        {
          slug: 'care',
          name: 'Garden care',
          price: '$95',
          period: 'a visit',
          summary:
            'Regular visits, every week, fortnight or month, to keep the garden in shape.',
          includes:
            'Pruning and weeding\nFeeding and mulching\nMowing and edging',
          emphasis: 'standard',
        },
      ],
      gallery: [
        {
          slug: 'courtyard',
          image: art('gallery-courtyard.svg'),
          caption: 'A paved courtyard in Surry Hills, planted for shade.',
        },
        {
          slug: 'backyard',
          image: art('gallery-backyard.svg'),
          caption: 'A family backyard in Lane Cove, with room to play.',
        },
        {
          slug: 'natives',
          image: art('gallery-natives.svg'),
          caption: 'Native grasses that need little water once settled.',
        },
        {
          slug: 'vegetables',
          image: art('gallery-vegetables.svg'),
          caption: 'Raised vegetable beds, built to sitting height.',
        },
        {
          slug: 'path',
          image: art('gallery-path.svg'),
          caption: 'A sandstone path between flowering shrubs.',
        },
        {
          slug: 'pots',
          image: art('gallery-pots.svg'),
          caption: 'Potted shrubs for a north-facing balcony.',
        },
      ],
    },
  },
};
