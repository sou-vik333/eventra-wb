const locations = [
  'Kolkata',
  'Midnapore',
  'Kharagpur',
  'Ghatal',
  'Howrah',
  'Durgapur',
  'Siliguri',
  'Haldia',
  'Bankura',
  'Berhampore',
  'Malda',
  'Jalpaiguri',
]

function LocationDiscovery() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
            Local Discovery
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Find Services Near You
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Explore event professionals across cities and districts
            of West Bengal.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">

          {locations.map((location) => (
            <button
              key={location}
              type="button"
              className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-purple-400 hover:text-purple-700"
            >
              {location}
            </button>
          ))}

        </div>

      </div>
    </section>
  )
}

export default LocationDiscovery