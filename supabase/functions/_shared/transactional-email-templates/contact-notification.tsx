import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { emailTranslations, getEmailLang } from './email-translations.ts'

const SITE_NAME = "INTERSOFTI"

interface ContactNotificationProps {
  lang?: string
  firstName?: string
  lastName?: string
  email?: string
  message?: string
}

const ContactNotificationEmail = ({ lang: rawLang, firstName, lastName, email, message }: ContactNotificationProps) => {
  const lang = getEmailLang(rawLang)
  const t = emailTranslations.contactNotification[lang]

  return (
    <Html lang={lang} dir="ltr">
      <Head />
      <Preview>{t.heading} — {firstName || ''} {lastName || ''}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{t.heading}</Heading>
          <Section style={detailsSection}>
            <Text style={labelText}>{t.nameLabel}</Text>
            <Text style={valueText}>{firstName || ''} {lastName || ''}</Text>

            <Text style={labelText}>{t.emailLabel}</Text>
            <Text style={valueText}>{email || 'N/A'}</Text>

            <Text style={labelText}>{t.messageLabel}</Text>
            <Text style={messageText}>{message || t.noMessage}</Text>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>{t.footer}</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: ContactNotificationEmail,
  subject: (data: Record<string, any>) => {
    const lang = getEmailLang(data.lang)
    return emailTranslations.contactNotification[lang].subject(data.firstName || '', data.lastName || '')
  },
  displayName: 'Contact form notification',
  to: 'info@rpjsoftware.com',
  previewData: {
    lang: 'en',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    message: 'Hi, I would like to know more about your products.',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif" }
const container = { padding: '30px 25px', maxWidth: '500px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#1a1a1a', margin: '0 0 20px' }
const labelText = { fontSize: '13px', color: '#666666', margin: '0 0 2px', fontWeight: 'bold' as const }
const valueText = { fontSize: '14px', color: '#1a1a1a', margin: '0 0 16px' }
const messageText = { fontSize: '14px', color: '#1a1a1a', backgroundColor: '#f4f4f5', padding: '12px', borderRadius: '6px', margin: '0 0 16px', lineHeight: '1.6', whiteSpace: 'pre-wrap' as const }
const detailsSection = { margin: '20px 0' }
const hr = { borderColor: '#e4e4e7', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#999999', margin: '0' }
