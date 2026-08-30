import Badge from '../ui/Badge'
import Button from '../ui/Button'
import Card from '../ui/Card'

const vendors = [
  {
    name: 'Sample Photography Studio',
    category: 'Photography',
    location: 'Midnapore',
    rating: 4.8,
    price: 25000,
  },
  {
    name: 'Sample Makeup Studio',
    category: 'Makeup Artist',
    location: 'Kolkata',
    rating: 4.7,
    price: 8000,
  },
  {
    name: 'Sample Event Decorators',
    category: 'Decoration',
    location: 'Kharagpur',
    rating: 4.9,
    price: 30000,
  },
  {
    name: 'Sample Catering Service',
    category: 'Catering',
    location: 'Ghatal',
    rating: 4.6,
    price: 50000,
  },
]

function FeaturedVendors() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
              Featured
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Popular Service Providers
            </h2>
          </div>

          <Button variant="outline">
            View All
          </Button>

        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {vendors.map((vendor) => (
            <Card
              key={vendor.name}
              className="overflow-hidden"
            >

              <div className="flex h-40 items-center justify-center bg-slate-200 text-5xl">
                📸
              </div>

              <div className="p-5">

                <div className="flex items-start justify-between gap-2">

                  <h3 className="font-semibold text-slate-900">
                    {vendor.name}
                  </h3>

                  <Badge variant="success">
                    Verified
                  </Badge>

                </div>

                <p className="mt-2 text-sm text-slate-600">
                  {vendor.category}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  📍 {vendor.location}
                </p>

                <div className="mt-4 flex items-center justify-between">

                  <span className="text-sm font-medium text-slate-700">
                    ⭐ {vendor.rating}
                  </span>

                  <span className="text-sm font-semibold text-slate-900">
                    ₹{vendor.price.toLocaleString('en-IN')}+
                  </span>

                </div>

              </div>

            </Card>
          ))}

        </div>

      </div>
    </section>
  )
}

export default FeaturedVendors