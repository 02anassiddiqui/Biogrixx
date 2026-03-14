import Head from 'next/head'
import { Container } from '../components/ui/Container'
import { Section } from '../components/ui/Section'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Flame, Zap, Shield, Leaf } from 'lucide-react'

export default function Home() {
  return (
    <>
      <Head>
        <title>Biogrix | Biogas Utility Management Platform</title>
        <meta name="description" content="Manage biogas plants, distribution, and households with Biogrix. Clean energy for communities." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero */}
      <Section className="bg-secondary">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight mb-6">
              Clean energy for your community
            </h1>
            <p className="text-lg text-neutral-700 mb-8">
              Biogrix helps biogas plants and households manage gas distribution, usage, and billing with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/how-it-works" variant="primary">
                How It Works
              </Button>
              <Button href="/contact" variant="secondary">
                Get in Touch
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Problem */}
      <Section>
        <Container>
          <h2 className="text-3xl font-semibold text-neutral-900 mb-4 text-center">
            Managing biogas is complex
          </h2>
          <p className="text-neutral-700 text-center max-w-2xl mx-auto mb-12">
            From plants to households, tracking meters, usage, and payments across villages is time-consuming and error-prone.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <p className="text-neutral-700">Manual meter readings and paper records lead to delays and mistakes.</p>
            </Card>
            <Card>
              <p className="text-neutral-700">Billing and payment collection are hard to track and reconcile.</p>
            </Card>
            <Card>
              <p className="text-neutral-700">Maintenance issues and complaints get lost or delayed.</p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Solution */}
      <Section alt>
        <Container>
          <h2 className="text-3xl font-semibold text-neutral-900 mb-4 text-center">
            One platform for everything
          </h2>
          <p className="text-neutral-700 text-center max-w-2xl mx-auto mb-12">
            Biogrix brings plants, meters, households, billing, and maintenance into a single, reliable system.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">Meters & usage</h3>
                <p className="text-neutral-700">Track gas consumption and meter readings in one place.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">Billing & payments</h3>
                <p className="text-neutral-700">Generate bills, record payments, and keep everything reconciled.</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* How Biogas Works */}
      <Section>
        <Container>
          <h2 className="text-3xl font-semibold text-neutral-900 mb-4 text-center">
            How biogas works
          </h2>
          <p className="text-neutral-700 text-center max-w-2xl mx-auto mb-12">
            Biogas turns organic waste into clean cooking fuel. Biogrix helps you run the distribution and billing side.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card hover>
              <div className="text-center">
                <Flame className="mx-auto text-primary mb-4" size={40} />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Produce</h3>
                <p className="text-neutral-700 text-sm">Plants convert waste into biogas.</p>
              </div>
            </Card>
            <Card hover>
              <div className="text-center">
                <Zap className="mx-auto text-primary mb-4" size={40} />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Distribute</h3>
                <p className="text-neutral-700 text-sm">Gas flows through networks to households.</p>
              </div>
            </Card>
            <Card hover>
              <div className="text-center">
                <Leaf className="mx-auto text-primary mb-4" size={40} />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Consume</h3>
                <p className="text-neutral-700 text-sm">Households use gas for cooking.</p>
              </div>
            </Card>
          </div>
          <div className="text-center mt-8">
            <Button href="/biogas-guide" variant="secondary">
              Learn more in our guide
            </Button>
          </div>
        </Container>
      </Section>

      {/* Benefits */}
      <Section alt>
        <Container>
          <h2 className="text-3xl font-semibold text-neutral-900 mb-4 text-center">
            Why Biogrix
          </h2>
          <p className="text-neutral-700 text-center max-w-2xl mx-auto mb-12">
            Built for reliability. Simple enough for rural operators, powerful enough for large networks.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <h3 className="font-semibold text-neutral-900 mb-2">Clear records</h3>
              <p className="text-neutral-700 text-sm">Every meter reading, bill, and payment is logged and traceable.</p>
            </Card>
            <Card>
              <h3 className="font-semibold text-neutral-900 mb-2">Faster operations</h3>
              <p className="text-neutral-700 text-sm">Less paperwork, fewer errors, more time for what matters.</p>
            </Card>
            <Card>
              <h3 className="font-semibold text-neutral-900 mb-2">Trusted reporting</h3>
              <p className="text-neutral-700 text-sm">Reports for usage, revenue, and maintenance when you need them.</p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section>
        <Container narrow>
          <div className="text-center py-12 px-6 bg-secondary rounded-2xl">
            <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 mb-4">
              Ready to simplify your biogas operations?
            </h2>
            <p className="text-neutral-700 mb-8 max-w-xl mx-auto">
              Get in touch to see how Biogrix can help your plant or network run more smoothly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/contact" variant="primary">
                Contact us
              </Button>
              <Button href="/calculator" variant="accent">
                Try the calculator
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
