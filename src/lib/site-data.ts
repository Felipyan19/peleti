import heroFallback from '@/data/hero.json';
import aboutFallback from '@/data/about.json';
import styleGalleryFallback from '@/data/styleGallery.json';
import workProcessFallback from '@/data/workProcess.json';
import portfolioFallback from '@/data/portfolio.json';
import contactFallback from '@/data/contact.json';
import { prisma } from '@/lib/prisma';

type SocialPlatform = 'INSTAGRAM' | 'FACEBOOK' | 'WHATSAPP';

export interface HomeHeroData {
  id?: string;
  title: string;
  description: string;
  buttonText: string;
  imageUrl?: string;
}

export interface HomeAboutData {
  id?: string;
  title: string;
  paragraphs: string[];
  imageUrl?: string;
}

export interface HomeStyleGalleryData {
  settings: {
    id?: string;
    title: string;
    description: string;
  };
  styles: Array<{
    id: string;
    name: string;
    description: string;
    icon?: string;
    techniques: string[];
    examples?: string;
    order: number;
    published: boolean;
  }>;
}

export interface HomeWorkProcessData {
  settings: {
    id?: string;
    title: string;
    description: string;
    stepLabel: string;
  };
  steps: Array<{
    id: string;
    title: string;
    description: string;
    icon?: string;
    order: number;
    published: boolean;
  }>;
}

export interface HomePortfolioItem {
  id: string;
  title: string;
  description: string;
  dimensions?: string | null;
  category: string;
  technique: string;
  image: string;
  images: Array<{
    id: string;
    image: string;
    alt?: string | null;
  }>;
}

export interface HomeContactData {
  settings: {
    id?: string;
    title: string;
    description: string;
    formNameLabel: string;
    formEmailLabel: string;
    formMessageLabel: string;
    submitSuccessText: string;
    submitErrorText: string;
  };
  socialLinks: Array<{
    id: string;
    platform: SocialPlatform;
    title: string;
    info?: string | null;
    url: string;
    icon?: string | null;
  }>;
}

export interface AdminDashboardData {
  hero: Awaited<ReturnType<typeof prisma.hero.findMany>>;
  about: Awaited<ReturnType<typeof prisma.about.findMany>>;
  styleGallerySettings: Awaited<ReturnType<typeof prisma.styleGallerySettings.findMany>>;
  styleGalleryStyles: Awaited<ReturnType<typeof prisma.styleGalleryStyle.findMany>>;
  workProcessSettings: Awaited<ReturnType<typeof prisma.workProcessSettings.findMany>>;
  workSteps: Awaited<ReturnType<typeof prisma.workStep.findMany>>;
  portfolioCategories: Awaited<ReturnType<typeof prisma.portfolioCategory.findMany>>;
  portfolioTechniques: Awaited<ReturnType<typeof prisma.techniqueTag.findMany>>;
  portfolioItems: Awaited<ReturnType<typeof prisma.portfolioItem.findMany>>;
  contactSettings: Awaited<ReturnType<typeof prisma.contactSettings.findMany>>;
  socialLinks: Awaited<ReturnType<typeof prisma.socialLink.findMany>>;
}

function platformSortValue(platform: string) {
  switch (platform) {
    case 'INSTAGRAM':
      return 0;
    case 'FACEBOOK':
      return 1;
    case 'WHATSAPP':
      return 2;
    default:
      return 99;
  }
}

export async function getHomePageData() {
  const [
    hero,
    about,
    styleGallerySettings,
    styleGalleryStyles,
    workProcessSettings,
    workSteps,
    portfolioItems,
    contactSettings,
  ] = await Promise.all([
    prisma.hero.findFirst({
      where: { published: true },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.about.findFirst({
      where: { published: true },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.styleGallerySettings.findFirst({
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.styleGalleryStyle.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    }),
    prisma.workProcessSettings.findFirst({
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.workStep.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    }),
    prisma.portfolioItem.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
      include: {
        category: true,
        techniques: true,
        images: {
          orderBy: { order: 'asc' },
        },
      },
    }),
    prisma.contactSettings.findFirst({
      orderBy: { updatedAt: 'desc' },
      include: {
        socialLinks: true,
      },
    }),
  ]);

  const heroData: HomeHeroData = hero
    ? {
        id: hero.id,
        title: hero.title,
        description: hero.description,
        buttonText: hero.buttonText ?? heroFallback.buttonText,
        imageUrl: hero.imageBase64 ? `/api/hero/${hero.id}/image` : undefined,
      }
    : {
        title: heroFallback.title,
        description: heroFallback.description,
        buttonText: heroFallback.buttonText,
        imageUrl: heroFallback.image,
      };

  const aboutData: HomeAboutData = about
    ? {
        id: about.id,
        title: about.title,
        paragraphs: Array.isArray(about.paragraphs)
          ? about.paragraphs.map(String)
          : [],
        imageUrl: about.imageBase64 ? `/api/about/${about.id}/image` : undefined,
      }
    : {
        title: aboutFallback.title,
        paragraphs: aboutFallback.paragraphs,
        imageUrl: aboutFallback.image,
      };

  const styleGalleryData: HomeStyleGalleryData = {
    settings: styleGallerySettings
      ? {
          id: styleGallerySettings.id,
          title: styleGallerySettings.title,
          description: styleGallerySettings.description,
        }
      : {
          title: styleGalleryFallback.title,
          description: styleGalleryFallback.description,
        },
    styles:
      styleGalleryStyles.length > 0
        ? styleGalleryStyles.map((style) => ({
            id: style.id,
            name: style.name,
            description: style.description,
            icon: style.icon ?? undefined,
            techniques: Array.isArray(style.techniques)
              ? style.techniques.map(String)
              : [],
            examples: style.examples ?? undefined,
            order: style.order,
            published: style.published,
          }))
        : styleGalleryFallback.styles.map((style, index) => ({
            id: String(style.id),
            name: style.name,
            description: style.description,
            icon: style.icon,
            techniques: style.techniques,
            examples: style.examples,
            order: index,
            published: true,
          })),
  };

  const workProcessData: HomeWorkProcessData = {
    settings: workProcessSettings
      ? {
          id: workProcessSettings.id,
          title: workProcessSettings.title,
          description: workProcessSettings.description,
          stepLabel:
            workProcessSettings.stepLabel ?? workProcessFallback.step,
        }
      : {
          title: workProcessFallback.title,
          description: workProcessFallback.description,
          stepLabel: workProcessFallback.step,
        },
    steps:
      workSteps.length > 0
        ? workSteps.map((step) => ({
            id: step.id,
            title: step.title,
            description: step.description,
            icon: step.icon ?? undefined,
            order: step.order,
            published: step.published,
          }))
        : workProcessFallback.stepsData.map((step, index) => ({
            id: String(step.id),
            title: step.title,
            description: step.description,
            icon: step.icon,
            order: index,
            published: true,
          })),
  };

  const portfolioData = {
    title: portfolioFallback.title,
    description: portfolioFallback.description,
    items:
      portfolioItems.length > 0
        ? portfolioItems.map<HomePortfolioItem>((item) => {
            const images = item.images.map((image) => ({
              id: image.id,
              image: `/api/portfolio/images/${image.id}?asImage=true`,
              alt: image.alt,
            }));

            return {
              id: item.id,
              title: item.title,
              description: item.description,
              dimensions: item.dimensions,
              category: item.category.name,
              technique:
                item.techniques.map((technique) => technique.name).join(', ') ||
                'Resina artesanal',
              image: images[0]?.image ?? heroFallback.image,
              images,
            };
          })
        : portfolioFallback.dataPortfolio.map((item) => ({
            id: String(item.id),
            title: item.title,
            description: item.description,
            dimensions: item.dimensions,
            category: item.category,
            technique: item.technique,
            image: item.image,
            images: [
              {
                id: String(item.id),
                image: item.image,
                alt: item.title,
              },
            ],
          })),
  };

  const contactData: HomeContactData = contactSettings
    ? {
        settings: {
          id: contactSettings.id,
          title: contactSettings.title,
          description: contactSettings.description,
          formNameLabel: contactSettings.formNameLabel,
          formEmailLabel: contactSettings.formEmailLabel,
          formMessageLabel: contactSettings.formMessageLabel,
          submitSuccessText: contactSettings.submitSuccessText,
          submitErrorText: contactSettings.submitErrorText,
        },
        socialLinks: contactSettings.socialLinks
          .sort((a, b) => platformSortValue(a.platform) - platformSortValue(b.platform))
          .map((link) => ({
            id: link.id,
            platform: link.platform,
            title: link.title,
            info: link.info,
            url: link.url,
            icon: link.icon,
          })),
      }
    : {
        settings: {
          title: contactFallback.title,
          description: contactFallback.description,
          formNameLabel: contactFallback.form.name,
          formEmailLabel: contactFallback.form.email,
          formMessageLabel: contactFallback.form.message,
          submitSuccessText: contactFallback.submit.success,
          submitErrorText: contactFallback.submit.error,
        },
        socialLinks: [
          {
            id: 'instagram',
            platform: 'INSTAGRAM',
            title: contactFallback.social.instagram.title,
            info: contactFallback.social.instagram.info,
            url: contactFallback.social.instagram.url,
            icon: contactFallback.social.instagram.icon,
          },
          {
            id: 'facebook',
            platform: 'FACEBOOK',
            title: contactFallback.social.facebook.title,
            info: contactFallback.social.facebook.info,
            url: contactFallback.social.facebook.url,
            icon: contactFallback.social.facebook.icon,
          },
          {
            id: 'whatsapp',
            platform: 'WHATSAPP',
            title: contactFallback.social.whatsapp.title,
            info: contactFallback.social.whatsapp.info,
            url: contactFallback.social.whatsapp.url,
            icon: contactFallback.social.whatsapp.icon,
          },
        ],
      };

  return {
    hero: heroData,
    about: aboutData,
    styleGallery: styleGalleryData,
    workProcess: workProcessData,
    portfolio: portfolioData,
    contact: contactData,
  };
}

export async function getAdminDashboardData() {
  const [
    hero,
    about,
    styleGallerySettings,
    styleGalleryStyles,
    workProcessSettings,
    workSteps,
    portfolioCategories,
    portfolioTechniques,
    portfolioItems,
    contactSettings,
    socialLinks,
  ] = await Promise.all([
    prisma.hero.findMany({ orderBy: { updatedAt: 'desc' } }),
    prisma.about.findMany({ orderBy: { updatedAt: 'desc' } }),
    prisma.styleGallerySettings.findMany({ orderBy: { updatedAt: 'desc' } }),
    prisma.styleGalleryStyle.findMany({ orderBy: { order: 'asc' } }),
    prisma.workProcessSettings.findMany({ orderBy: { updatedAt: 'desc' } }),
    prisma.workStep.findMany({ orderBy: { order: 'asc' } }),
    prisma.portfolioCategory.findMany({ orderBy: { name: 'asc' } }),
    prisma.techniqueTag.findMany({ orderBy: { name: 'asc' } }),
    prisma.portfolioItem.findMany({
      orderBy: { order: 'asc' },
      include: {
        category: true,
        techniques: true,
        images: {
          orderBy: { order: 'asc' },
        },
      },
    }),
    prisma.contactSettings.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        socialLinks: {
          orderBy: { platform: 'asc' },
        },
      },
    }),
    prisma.socialLink.findMany({
      orderBy: { platform: 'asc' },
    }),
  ]);

  return {
    hero,
    about,
    styleGallerySettings,
    styleGalleryStyles,
    workProcessSettings,
    workSteps,
    portfolioCategories,
    portfolioTechniques,
    portfolioItems,
    contactSettings,
    socialLinks,
  };
}
