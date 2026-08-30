import { Link } from 'react-router-dom'
import Button from '../ui/Button'

function AIPlannerCTA() {
  return (
    <section className="bg-purple-700 py-16">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">

        <p className="text-sm font-semibold uppercase tracking-wide text-purple-200">
          AI Event Planner
        </p>

        <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
          Plan Your Event Smarter
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-purple-100">
          Tell Eventra WB about your event, location, date, guests
          and budget. Our AI planner will help you organize your
          services, budget and checklist.
        </p>

        <div className="mt-8">
          <Link to="/ai-planner">
            <Button
              variant="outline"
              className="border-white bg-white text-purple-700 hover:bg-purple-50"
            >
              Create My Event Plan
            </Button>
          </Link>
        </div>

      </div>
    </section>
  )
}

export default AIPlannerCTA