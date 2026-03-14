import Head from 'next/head'
import { Container } from '../components/ui/Container'
import { Section } from '../components/ui/Section'
import { Card } from '../components/ui/Card'

export default function BiogasGuide() {
  return (
    <>
      <Head>
        <title>Biogas Guide | Biogrix</title>
        <meta name="description" content="A simple guide to biogas: what it is, how it works, and why it matters." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Section className="bg-secondary">
        <Container narrow>
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">
            Biogas guide
          </h1>
          <p className="text-lg text-neutral-700">
            A simple introduction to biogas and how Biogrix helps manage it.
          </p>
        </Container>
      </Section>
      <Section>
        <Container narrow>
          <div className="space-y-8">
            <Card>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">What is biogas?</h2>
              <p className="text-neutral-700 mb-4">
                Biogas is fuel made from organic waste—crop residues, animal dung, food scraps. In a digester, bacteria break down this waste and produce gas, mostly methane. That gas can be used for cooking, heating, or even generating electricity.
              </p>
              <p className="text-neutral-700">
                It is clean, renewable, and reduces dependence on wood, charcoal, or fossil fuels.
              </p>
            </Card>
            <Card>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">From plant to household</h2>
              <p className="text-neutral-700 mb-4">
                Central plants produce biogas and feed it into a distribution network. Pipes carry the gas to households, where meters measure how much each home uses.
              </p>
              <p className="text-neutral-700">
                Biogrix helps operators manage plants, meters, readings, billing, and maintenance so the whole system runs smoothly.
              </p>
            </Card>
            <Card>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Why biogas matters</h2>
              <p className="text-neutral-700">
                Biogas cuts emissions, improves air quality, and gives communities reliable cooking fuel. Biogrix makes it easier for operators to run and grow these systems with clear records and fewer errors.
              </p>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  )
}
