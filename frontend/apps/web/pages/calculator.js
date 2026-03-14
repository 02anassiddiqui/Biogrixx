import Head from 'next/head'
import { Container } from '../components/ui/Container'
import { Section } from '../components/ui/Section'
import { Card } from '../components/ui/Card'

export default function Calculator() {
  return (
    <>
      <Head>
        <title>Calculator | Biogrix</title>
        <meta name="description" content="Estimate biogas savings and costs with the Biogrix calculator." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Section className="bg-secondary">
        <Container narrow>
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">
            Biogas calculator
          </h1>
          <p className="text-lg text-neutral-700">
            Estimate savings and costs for your biogas setup.
          </p>
        </Container>
      </Section>
      <Section>
        <Container narrow>
          <Card>
            <p className="text-neutral-700 text-center py-12">
              Calculator functionality coming soon. Enter your usage and rate to see estimated bills and savings.
            </p>
          </Card>
        </Container>
      </Section>
    </>
  )
}
