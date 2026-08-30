const steps = [
  {
    number: '01',
    title: 'Tell Us What You Need',
    description:
      'Choose your event type, location, date, guest count and budget.',
  },
  {
    number: '02',
    title: 'Discover Services',
    description:
      'Find photographers, decorators, caterers, makeup artists and other professionals.',
  },
  {
    number: '03',
    title: 'Compare & Choose',
    description:
      'Compare prices, ratings, experience, portfolios and availability.',
  },
  {
    number: '04',
    title: 'Book Your Services',
    description:
      'Send booking requests, communicate with providers and manage your event.',
  },
]

function HowItWorks() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section heading */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
            Simple Process
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            How Eventra WB Works
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Plan your event, discover trusted service providers,
            compare your options and book everything you need.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-lg font-bold text-purple-700">
                {step.number}
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                {step.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default HowItWorks