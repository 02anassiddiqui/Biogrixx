import Head from 'next/head'
import { Container } from '../components/ui/Container'
import { Section } from '../components/ui/Section'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Mail, MapPin } from 'lucide-react'

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact | Biogrix</title>
        <meta name="description" content="Get in touch with Biogrix for biogas utility management." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Section className="bg-secondary">
        <Container narrow>
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">
            Contact us
          </h1>
          <p className="text-lg text-neutral-700">
            Have questions about Biogrix or need support? Reach out and we will get back to you.
          </p>
        </Container>
      </Section>
      <Section>
        <Container>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <div className="flex items-start gap-4">
                <Mail className="text-primary flex-shrink-0" size={24} />
                <div>
                  <h2 className="font-semibold text-neutral-900 mb-2">Email</h2>
                  <a
                    href="mailto:contact@biogrix.com"
                    className="text-primary hover:underline"
                  >
                    contact@biogrix.com
                  </a>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-start gap-4">
                <MapPin className="text-primary flex-shrink-0" size={24} />
                <div>
                  <h2 className="font-semibold text-neutral-900 mb-2">Location</h2>
                  <p className="text-neutral-700">Biogrix HQ</p>
                  <p className="text-neutral-500 text-sm">Address details coming soon</p>
                </div>
              </div>
            </Card>
          </div>
          <div className="mt-12 max-w-xl mx-auto">
            <Card>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Send a message</h2>
              <p className="text-neutral-700 mb-6">
                Contact form coming soon. In the meantime, email us at contact@biogrix.com.
              </p>
              <Button href="mailto:contact@biogrix.com" variant="primary">
                Email us
              </Button>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  )
}
