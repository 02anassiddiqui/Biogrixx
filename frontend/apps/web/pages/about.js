import Head from 'next/head'
import { Container } from '../components/ui/Container'
import { Section } from '../components/ui/Section'

export default function About() {
  return (
    <>
      <Head>
        <title>About | Biogrix</title>
        <meta name="description" content="About Biogrix - Biogas utility management for communities." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Section className="bg-secondary">
        <Container narrow>
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">
            About Biogrix
          </h1>
          <p className="text-lg text-neutral-700 mb-6">
            Biogrix is a biogas utility management platform built for plants, distribution networks, and households. We help communities run their gas supply more reliably.
          </p>
          <p className="text-neutral-700 mb-6">
            Our goal is simple: make it easier to track meters, issue bills, collect payments, and handle maintenance. Less paperwork, fewer errors, more time for what matters.
          </p>
          <p className="text-neutral-700">
            Whether you run a small plant or a larger network, Biogrix grows with you. Clear records, fast reporting, and a system that works for both technical staff and field operators.
          </p>
        </Container>
      </Section>
      <Section>
        <Container narrow>
          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
            Our mission
          </h2>
          <p className="text-neutral-700">
            To bring reliable, easy-to-use tools to the biogas sector so that clean energy reaches more households and operations run smoothly.
          </p>
        </Container>
      </Section>
    </>
  )
}
