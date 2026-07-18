import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Text, Img, Section, Hr, Row, Column,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'INTERSOFTI'
const LOGO_URL = 'https://spudbndneoaltpseizye.supabase.co/storage/v1/object/public/assets/logo-intersofti-full.png'

interface InvoiceDeliveryProps {
  invoiceNo?: string
  date?: string
  customerEmail?: string
  packageName?: string
  packageCode?: string
  amount?: string
  status?: string
  orderNo?: string
  transactionId?: string
  iccid?: string
  activationCode?: string
  qrCodeUrl?: string
  invoiceUrl?: string
}

const InvoiceDeliveryEmail = ({
  invoiceNo, date, customerEmail, packageName, packageCode, amount, status,
  orderNo, transactionId, iccid, activationCode, qrCodeUrl, invoiceUrl,
}: InvoiceDeliveryProps) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>Tu factura {invoiceNo || ''} de {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Img src={LOGO_URL} alt={SITE_NAME} width="200" height="auto" style={{ margin: '0 auto' }} />
        </Section>

        <Hr style={hr} />

        <Heading style={h1}>Factura {invoiceNo || ''}</Heading>
        <Text style={text}>
          Hola, adjuntamos los detalles de tu factura y los datos de tu eSIM.
        </Text>

        <Section style={tableSection}>
          <Row style={tableRow}>
            <Column style={tableLabelCol}>Nº Factura</Column>
            <Column style={tableValueCol}>{invoiceNo || 'N/A'}</Column>
          </Row>
          <Row style={tableRow}>
            <Column style={tableLabelCol}>Fecha</Column>
            <Column style={tableValueCol}>{date || 'N/A'}</Column>
          </Row>
          <Row style={tableRow}>
            <Column style={tableLabelCol}>Cliente</Column>
            <Column style={tableValueCol}>{customerEmail || 'N/A'}</Column>
          </Row>
          <Row style={tableRow}>
            <Column style={tableLabelCol}>Concepto</Column>
            <Column style={tableValueCol}>{packageName || 'N/A'}</Column>
          </Row>
          <Row style={tableRow}>
            <Column style={tableLabelCol}>Importe</Column>
            <Column style={tableValueCol}>${amount || '0.00'} USD</Column>
          </Row>
          <Row style={tableRow}>
            <Column style={tableLabelCol}>Estado</Column>
            <Column style={tableValueCol}>{status || 'completed'}</Column>
          </Row>
        </Section>

        <Heading style={h2}>Datos de la eSIM</Heading>
        <Section style={tableSection}>
          <Row style={tableRow}>
            <Column style={tableLabelCol}>Plan</Column>
            <Column style={tableValueCol}>{packageName || 'N/A'}</Column>
          </Row>
          <Row style={tableRow}>
            <Column style={tableLabelCol}>Código plan</Column>
            <Column style={tableValueCol}>{packageCode || 'N/A'}</Column>
          </Row>
          <Row style={tableRow}>
            <Column style={tableLabelCol}>Nº Pedido</Column>
            <Column style={tableValueCol}>{orderNo || 'N/A'}</Column>
          </Row>
          <Row style={tableRow}>
            <Column style={tableLabelCol}>Transaction ID</Column>
            <Column style={tableValueCol}>{transactionId || 'N/A'}</Column>
          </Row>
          <Row style={tableRow}>
            <Column style={tableLabelCol}>ICCID</Column>
            <Column style={tableValueCol}>{iccid || 'N/A'}</Column>
          </Row>
          <Row style={tableRow}>
            <Column style={tableLabelCol}>Código activación</Column>
            <Column style={tableValueCol} {...{ style: { ...tableValueCol, wordBreak: 'break-all' as const } }}>{activationCode || 'N/A'}</Column>
          </Row>
        </Section>

        {qrCodeUrl ? (
          <Section style={{ textAlign: 'center', margin: '20px 0' }}>
            <Text style={text}>Código QR de activación:</Text>
            <Img src={qrCodeUrl} alt="QR eSIM" width="200" height="200" style={{ margin: '0 auto' }} />
          </Section>
        ) : null}

        {invoiceUrl ? (
          <Section style={{ textAlign: 'center', margin: '24px 0' }}>
            <Button href={invoiceUrl} style={button}>Descargar factura (PDF)</Button>
            <Text style={{ ...text, fontSize: '12px', color: '#999', marginTop: '8px' }}>
              O copia este enlace: {invoiceUrl}
            </Text>
          </Section>
        ) : null}

        <Hr style={hr} />
        <Text style={footer}>Gracias por tu compra. — El equipo de {SITE_NAME}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: InvoiceDeliveryEmail,
  subject: (data: Record<string, any>) => `Tu factura ${data?.invoiceNo || ''} de ${SITE_NAME}`,
  displayName: 'Factura',
  previewData: {
    invoiceNo: 'INV-12345',
    date: '01/01/2025',
    customerEmail: 'cliente@example.com',
    packageName: 'eSIM España 5GB',
    packageCode: 'ES_5GB_30D',
    amount: '12.99',
    status: 'completed',
    orderNo: 'B2400000123',
    transactionId: 'tx_abc123',
    iccid: '8910300000123456789',
    activationCode: 'LPA:1$smdp.example.com$ABC-123-XYZ',
    qrCodeUrl: '',
    invoiceUrl: 'https://example.com/factura.pdf',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '20px 25px', maxWidth: '600px' }
const logoSection = { textAlign: 'center' as const, padding: '20px 0' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#000000', margin: '0 0 20px' }
const h2 = { fontSize: '16px', fontWeight: 'bold', color: '#000000', margin: '24px 0 8px' }
const text = { fontSize: '14px', color: '#55575d', lineHeight: '1.5', margin: '0 0 15px' }
const hr = { borderColor: '#e6ebf1', margin: '20px 0' }
const tableSection = { margin: '20px 0' }
const tableRow = { borderBottom: '1px solid #e6ebf1' }
const tableLabelCol = { padding: '8px 12px', fontSize: '13px', color: '#666', fontWeight: 'bold' as const, width: '40%' }
const tableValueCol = { padding: '8px 12px', fontSize: '13px', color: '#111' }
const button = { backgroundColor: '#2563eb', color: '#ffffff', padding: '12px 24px', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold' as const, textDecoration: 'none', display: 'inline-block' }
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0', textAlign: 'center' as const }
