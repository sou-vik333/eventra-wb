import AIPlannerCTA from '../../components/home/AIPlannerCTA'
import EventCategories from '../../components/home/EventCategories'
import FeaturedVendors from '../../components/home/FeaturedVendors'
import HeroSection from '../../components/home/HeroSection'
import HowItWorks from '../../components/home/HowItWorks'
import LocationDiscovery from '../../components/home/LocationDiscovery'
import ServiceCategories from '../../components/home/ServiceCategories'

function HomePage() {
  return (
    <>
      <HeroSection />

      <ServiceCategories />

      <EventCategories />

      <LocationDiscovery />

      <FeaturedVendors />

      <HowItWorks />

      <AIPlannerCTA />
    </>
  )
}

export default HomePage