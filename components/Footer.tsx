import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground mt-16 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-foreground text-lg font-bold mb-4">
              📚 BookStore
            </h3>
            <p className="text-sm">
              Your one-stop shop for all your reading needs.
            </p>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-4">Categories</h4>
            <nav aria-label="Footer categories">
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/books?category=fiction"
                    className="hover:text-foreground transition-colors focus:outline-ring"
                  >
                    Fiction
                  </Link>
                </li>
                <li>
                  <Link
                    href="/books?category=non-fiction"
                    className="hover:text-foreground transition-colors focus:outline-ring"
                  >
                    Non-Fiction
                  </Link>
                </li>
                <li>
                  <Link
                    href="/books?category=science"
                    className="hover:text-foreground transition-colors focus:outline-ring"
                  >
                    Science
                  </Link>
                </li>
                <li>
                  <Link
                    href="/books?category=technology"
                    className="hover:text-foreground transition-colors focus:outline-ring"
                  >
                    Technology
                  </Link>
                </li>
                <li>
                  <Link
                    href="/books?category=self-help"
                    className="hover:text-foreground transition-colors focus:outline-ring"
                  >
                    Self-Help
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-4">
              Customer Service
            </h4>
            <nav aria-label="Customer service links">
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors focus:outline-ring"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors focus:outline-ring"
                  >
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors focus:outline-ring"
                  >
                    Returns
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors focus:outline-ring"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-4">Newsletter</h4>
            <p className="text-sm mb-4">
              Subscribe to get special offers and updates.
            </p>
            <form className="flex flex-col gap-2">
              <label htmlFor="newsletter-email" className="sr-only">
                Enter your email for newsletter subscription
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Enter your email"
                className="input w-full"
                required
              />
              <button type="submit" className="btn-primary w-full">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} BookStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
