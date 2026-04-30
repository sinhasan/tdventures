import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="mx-auto max-w-7xl px-6 py-10 grid gap-6 md:grid-cols-3 text-sm">
        
        <div>
          <h3 className="font-display text-lg">TD Ventures</h3>
          <p className="mt-2 text-muted-foreground">
            Connecting startups with the right investors for accelerated growth.
          </p>
        </div>

        <div>
          <h4 className="font-medium">Contact</h4>
          <p className="mt-2 text-muted-foreground">invest@tdventures.in</p>
          <p className="text-muted-foreground">Bangalore, India</p>
        </div>

        <div>
          <h4 className="font-medium">Quick Links</h4>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li><a href="/contact">Contact</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </div>

      </div>

      <div className="text-center text-xs text-muted-foreground pb-6">
        © {new Date().getFullYear()} TD Ventures. All rights reserved.
      </div>
    </footer>
  );
}
