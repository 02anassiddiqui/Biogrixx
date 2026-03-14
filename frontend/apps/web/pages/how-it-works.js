import Head from 'next/head'
import { Container } from '../components/ui/Container'
import { Section } from '../components/ui/Section'
import { Card } from '../components/ui/Card'
import { Factory, Gauge, Receipt, Wrench } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      icon: Factory,
      title: 'Plants & networks',
      text: 'Register plants and distribution networks. Track capacity and status in one place.',
    },
    {
      icon: Gauge,
      title: 'Meters & usage',
      text: 'Assign meters to households. Record readings and see consumption over time.',
    },
    {
      icon: Receipt,
      title: 'Billing & payments',
      text: 'Generate bills from usage data. Record payments and keep everything reconciled.',
    },
    {
      icon: Wrench,
      title: 'Maintenance',
      text: 'Log complaints and maintenance requests. Assign and track until resolved.',
    },
  ]

  return (
    <>
      <Head>
        <title>How It Works | Biogrix</title>
        <meta name="description" content="How Biogrix helps manage biogas plants, meters, billing, and maintenance." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Section className="bg-secondary">
        <Container narrow>
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">
            How Biogrix works
          </h1>
          <p className="text-lg text-neutral-700">
            Biogrix covers the full cycle of biogas distribution: plants, meters, billing, and maintenance. Here is how each part fits together.
          </p>
        </Container>
      </Section>
      <Section>
        <Container>
          <div className="space-y-8">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
              <Card key={i} className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="text-primary" size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900 mb-2">{step.title}</h2>
                  <p className="text-neutral-700">{step.text}</p>
                </div>
              </Card>
            )
            })}
          </div>
        </Container>
      </Section>
    </>
  )
}
