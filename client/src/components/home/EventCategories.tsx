const events = [
  'Wedding',
  'Reception',
  'Birthday',
  'Rice Ceremony',
  'Engagement',
  'Baby Shower',
  'Anniversary',
  'Housewarming',
  'Puja',
  'Cultural Program',
  'Corporate Event',
  'College Event',
]

function EventCategories() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
            Events
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Find Services for Your Event
          </h2>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">

          {events.map((event) => (
            <button
              key={event}
              type="button"
              className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-purple-500 hover:bg-purple-50 hover:text-purple-700"
            >
              {event}
            </button>
          ))}

        </div>

      </div>
    </section>
  )
}

export default EventCategories