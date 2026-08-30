import Card from '../ui/Card'

const services = [
  {
    icon: '📷',
    title: 'Photography',
    description: 'Capture your important moments.',
  },
  {
    icon: '💄',
    title: 'Makeup & Beauty',
    description: 'Find makeup and beauty professionals.',
  },
  {
    icon: '🌸',
    title: 'Decoration',
    description: 'Create the perfect event atmosphere.',
  },
  {
    icon: '🍛',
    title: 'Catering',
    description: 'Discover catering services for your event.',
  },
  {
    icon: '🎵',
    title: 'DJ & Sound',
    description: 'Music and sound services for celebrations.',
  },
  {
    icon: '🏛️',
    title: 'Venues',
    description: 'Find suitable venues near you.',
  },
  {
    icon: '🎂',
    title: 'Cake & Bakery',
    description: 'Find cake designers and bakeries.',
  },
  {
    icon: '🚗',
    title: 'Transportation',
    description: 'Cars, buses and event transportation.',
  },
]

function ServiceCategories() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
            Explore Services
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Everything You Need for Your Event
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Discover professionals and services for weddings,
            birthdays, ceremonies, parties and more.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

          {services.map((service) => (
            <Card
              key={service.title}
              className="group cursor-pointer p-5 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-4xl">
                {service.icon}
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                {service.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {service.description}
              </p>
            </Card>
          ))}

        </div>

      </div>
    </section>
  )
}

export default ServiceCategories