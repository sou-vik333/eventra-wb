function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        <div className="grid gap-8 md:grid-cols-3">

          {/* Brand */}
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Eventra <span className="text-purple-600">WB</span>
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
              Discover, compare and book event service providers
              across West Bengal.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold text-slate-900">
              Platform
            </h3>

            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>Find Services</li>
              <li>AI Event Planner</li>
              <li>My Events</li>
              <li>Become a Vendor</li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-semibold text-slate-900">
              Information
            </h3>

            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>About Eventra WB</li>
              <li>Contact</li>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
            </ul>
          </div>

        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Eventra WB. All rights reserved.
        </div>

      </div>
    </footer>
  )
}

export default Footer