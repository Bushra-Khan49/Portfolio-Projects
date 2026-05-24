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
import ErrorBoundary from '@/components/ui/ErrorBoundary';

/**
 * Homepage — assembles all lab sections in order.
 * Each section is wrapped in an ErrorBoundary so a crash in one
 * section doesn't take down the entire page.
 */
export default function Home() {
  return (
    <main>
      <Navigation />
      <ErrorBoundary><Hero /></ErrorBoundary>
      <ErrorBoundary><ResearchAreas /></ErrorBoundary>
      <ErrorBoundary><Facilities /></ErrorBoundary>
      <ErrorBoundary><LabProgress /></ErrorBoundary>
      <ErrorBoundary><Goals /></ErrorBoundary>
      <ErrorBoundary><TeamAndPI /></ErrorBoundary>
      <ErrorBoundary><JoinLab /></ErrorBoundary>
      <Footer />
      <ScrollToTop />
    </main>
  );
}
