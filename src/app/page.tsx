import Hero from '@/components/Hero'
import About from '@/components/About'
import StylesGallery from '@/components/StylesGallery'
import WorkProcess from '@/components/WorkProcess'
import Portfolio from '@/components/Portfolio'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import { getHomePageData } from '@/lib/site-data'

export default async function Home() {
  const data = await getHomePageData();
  const whatsappUrl = data.contact.socialLinks.find(
    (link) => link.platform === 'WHATSAPP'
  )?.url;

  return (
    <>
      <Hero content={data.hero} whatsappUrl={whatsappUrl} />
      <About content={data.about} />
      <StylesGallery content={data.styleGallery} whatsappUrl={whatsappUrl} />
      <WorkProcess content={data.workProcess} />
      <Portfolio
        title={data.portfolio.title}
        description={data.portfolio.description}
        items={data.portfolio.items}
        whatsappUrl={whatsappUrl}
      />
      <Contact content={data.contact} />
      <Footer socialLinks={data.contact.socialLinks} />
    </>
  )
}
