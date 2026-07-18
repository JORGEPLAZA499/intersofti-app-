import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr, Link, Button, Row, Column, Img,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { emailTranslations, getEmailLang } from './email-translations.ts'

const SITE_NAME = "INTERSOFTI"

interface GhostcodeOrderConfirmationProps {
  lang?: string
  orderNumber?: string
  customerName?: string
  productName?: string
  totalPrice?: string
  address?: string
  trackingUrl?: string
}

const GhostcodeOrderConfirmationEmail = ({
  lang: rawLang,
  orderNumber = 'GC-XXXXXXX',
  customerName,
  productName = 'GhostCode S10',
  totalPrice = '€495.00',
  address = '',
  trackingUrl = '',
}: GhostcodeOrderConfirmationProps) => {
  const lang = getEmailLang(rawLang)
  const t = emailTranslations.ghostcodeOrder[lang]

  return (
    <Html lang={lang} dir="ltr">
      <Head />
      <Preview>{t.preview(orderNumber)}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Img
              src="https://spudbndneoaltpseizye.supabase.co/storage/v1/object/public/assets/intersofti-logo.png"
              alt="INTERSOFTI"
              width={180}
              height={50}
              style={logoImg}
            />
          </Section>

          <Section style={headerSection}>
            <Heading style={h1}>{t.heading}</Heading>
            <Text style={orderNumStyle}>{t.orderNumberLabel} {orderNumber}</Text>
          </Section>

          <Text style={text}>{t.greeting(customerName)}</Text>

          <Section style={tableSection}>
            <Row style={tableRow}>
              <Column style={tableLabelCol}>{t.productLabel}</Column>
              <Column style={tableValueCol}>{productName}</Column>
            </Row>
            <Row style={tableRow}>
              <Column style={tableLabelCol}>{t.totalLabel}</Column>
              <Column style={tableValueCol}><strong>{totalPrice}</strong></Column>
            </Row>
          </Section>

          {address && (
            <>
              <Text style={labelBold}>{t.shippingAddress}</Text>
              <Text style={addressText}>{address}</Text>
            </>
          )}

          {trackingUrl && (
            <Section style={ctaSection}>
              <Button style={ctaButton} href={trackingUrl}>
                {t.trackOrder}
              </Button>
            </Section>
          )}

          <Hr style={hr} />

          <Text style={text}>{t.notification}</Text>

          <Text style={signatureText}>{t.regards}</Text>
          <Text style={signatureBrand}>{SITE_NAME}</Text>

          <Hr style={hr} />

          <Text style={systemNote}>{t.systemNote}</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: GhostcodeOrderConfirmationEmail,
  subject: (data: Record<string, any>) => {
    const lang = getEmailLang(data.lang)
    return emailTranslations.ghostcodeOrder[lang].subject(data.orderNumber || 'GhostCode S10')
  },
  displayName: 'GhostCode Order Confirmation',
  previewData: {
    lang: 'es',
    orderNumber: 'GC-M1F2K3A',
    customerName: 'Juan Pérez',
    productName: 'GhostCode S10',
    totalPrice: '€495.00',
    address: 'Calle Gran Vía 12\n28001 Madrid\nSpain',
    trackingUrl: 'https://intersofti.lovable.app/order-tracking?order=GC-M1F2K3A',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif" }
const container = { padding: '30px 25px', maxWidth: '600px', margin: '0 auto' }
const logoSection = { textAlign: 'center' as const, margin: '0 0 10px' }
const logoImg = { margin: '0 auto' }
const headerSection = { textAlign: 'center' as const, margin: '20px 0' }
const h1 = { fontSize: '24px', fontWeight: 'bold', color: '#1a1a1a', margin: '0 0 8px' }
const orderNumStyle = { fontSize: '16px', color: '#3B82F6', fontWeight: 'bold' as const, margin: '0' }
const text = { fontSize: '14px', color: '#333333', lineHeight: '1.6', margin: '0 0 12px' }
const tableSection = { border: '1px solid #e4e4e7', borderRadius: '6px', padding: '12px', margin: '16px 0' }
const tableRow = { margin: '0 0 8px' }
const tableLabelCol = { fontSize: '13px', color: '#666666', fontWeight: 'bold' as const, width: '40%', verticalAlign: 'top' as const, paddingBottom: '8px' }
const tableValueCol = { fontSize: '13px', color: '#1a1a1a', width: '60%', verticalAlign: 'top' as const, paddingBottom: '8px' }
const labelBold = { fontSize: '14px', color: '#333', margin: '16px 0 8px', fontWeight: 'bold' as const }
const addressText = { fontSize: '13px', color: '#333', margin: '0 0 16px', whiteSpace: 'pre-line' as const, lineHeight: '1.6' }
const ctaSection = { textAlign: 'center' as const, margin: '24px 0' }
const ctaButton = {
  display: 'inline-block' as const,
  backgroundColor: '#3B82F6',
  color: '#ffffff',
  padding: '12px 28px',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: 'bold' as const,
  textDecoration: 'none',
}
const hr = { borderColor: '#e4e4e7', margin: '24px 0' }
const signatureText = { fontSize: '13px', color: '#333', margin: '0 0 4px' }
const signatureBrand = { fontSize: '14px', color: '#1a1a1a', fontWeight: 'bold' as const, margin: '0 0 4px' }
const systemNote = { fontSize: '11px', color: '#999999', textAlign: 'center' as const, fontStyle: 'italic' as const }
