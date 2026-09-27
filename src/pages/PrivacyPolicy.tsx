import { Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { AdSlot } from "@/components/ads/AdSlot";

export default function PrivacyPolicy() {
  return (
    <div className="p-6 md:p-8 flex justify-center gap-4 xl:gap-8 w-full">
      {/* Left Skyscraper */}
      <aside className="hidden lg:block w-[120px] xl:w-[200px] 2xl:w-[300px] shrink-0 sticky top-24 self-start h-[calc(100vh-120px)]">
        <AdSlot
          provider="google"
          slotId="privacy-side-left"
          orientation="vertical"
          label="Sponsor"
          className="h-full"
        />
      </aside>

      <div className="max-w-4xl w-full">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
          </div>
          <p className="text-muted-foreground">Last updated: January 2026</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Privacy Matters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 prose prose-invert max-w-none">
            <section>
              <h3 className="text-lg font-semibold text-foreground">1. Information We Collect</h3>
              <p className="text-muted-foreground">
                We collect information you provide directly to us, such as when you create an account,
                participate in typing tests, or contact us for support. This may include your name,
                email address, and typing performance data.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">2. Third-Party Advertising & Cookies</h3>
              <p className="text-muted-foreground">
                We use multiple third-party advertising networks, including <strong>Google AdSense</strong>
                and <strong>PropellerAds</strong>, to serve ads and monetize our services. These partners
                use cookies, beacons, and similar tracking technologies to serve ads based on your
                visit to this and other websites.
              </p>
              <p className="text-muted-foreground mt-4">
                <strong>How this affects you:</strong>
              </p>
              <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-2">
                <li><strong>Personalization:</strong> Google uses the DART cookie to serve ads based on your interests across the web. You can opt-out at <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Ad Settings</a>.</li>
                <li><strong>Network Rotation:</strong> PropellerAds and other vendors may use cookies to optimize ad delivery and track impressions.</li>
                <li><strong>Your Control:</strong> You can manage or disable cookies through your browser settings or by visiting <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">aboutads.info</a>.</li>
                <li><strong>GDPR/CCPA:</strong> We provide a dedicated consent management platform for users in regulated regions to control exactly how their data is used.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">3. Cookies & Tracking Technologies</h3>
              <p className="text-muted-foreground">
                We use cookies and similar tracking technologies to track the activity on our Service and hold
                certain information. Cookies are files with small amount of data which may include an
                anonymous unique identifier.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">4. Data Security</h3>
              <p className="text-muted-foreground">
                We take reasonable measures to help protect your personal information from loss,
                theft, misuse, unauthorized access, disclosure, alteration, and destruction.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">5. Your Rights (GDPR/CCPA)</h3>
              <p className="text-muted-foreground">
                Depending on your location, you may have the right to access, correct, or delete your
                personal information. You may also have the right to restrict or object to certain
                processing of your data.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">6. Contact Us</h3>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at
                <span className="text-foreground font-medium ml-1">privacy@typingos.com</span>.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>

      {/* Right Skyscraper */}
      <aside className="hidden lg:block w-[120px] xl:w-[200px] 2xl:w-[300px] shrink-0 sticky top-24 self-start h-[calc(100vh-120px)]">
        <AdSlot
          provider="propeller"
          zoneId="privacy-side-right"
          orientation="vertical"
          type="banner"
          label="Sponsor"
          className="h-full"
        />
      </aside>
    </div>
  );
}
