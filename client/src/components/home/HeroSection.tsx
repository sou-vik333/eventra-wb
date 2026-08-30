import { Link } from 'react-router-dom'
import Button from '../ui/Button'

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">

          <div className="mb-6 inline-flex rounded-full border border-purple-300/30 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-200">
            West Bengal's Event Service Platform
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Plan Your Perfect Event
            <span className="block text-purple-400">
              Across West Bengal
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Discover trusted event service providers, compare options,
            manage your event and book the right professionals in one place.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">

            <Link to="/vendors">
              <Button className="w-full sm:w-auto">
                Find Services
              </Button>
            </Link>

            <Link to="/ai-planner">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
              >
                Plan with AI
              </Button>
            </Link>

          </div>

        </div>
      </div>
    </section>
  )
}

export default HeroSection