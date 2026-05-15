import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import ResearchAreas from '@/components/ResearchAreas';
import Facilities from '@/components/Facilities';
import LabProgress from '@/components/LabProgress';
import Goals from '@/components/Goals';
import TeamAndPI from '@/components/TeamAndPI';
import JoinLab from '@/components/JoinLab';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';

export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />
      <ResearchAreas />
      <Facilities />
      <LabProgress />
      <Goals />
      <TeamAndPI />
      <JoinLab />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
