import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Img, Section, Hr, Link, Row, Column,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { emailTranslations, getEmailLang, type EmailLang } from './email-translations.ts'

const SITE_NAME = "INTERSOFTI"

interface EsimDeliveryProps {
  lang?: string
  packageName?: string
  iccid?: string
  qrCodeUrl?: string
  activationCode?: string
  orderNo?: string
  esimTranNo?: string
  expiredTime?: string
  smdpAddress?: string
  activationCodePart?: string
  apn?: string
  shortUrl?: string
}

const EsimDeliveryEmail = ({
  lang: rawLang, packageName, iccid, qrCodeUrl, activationCode,
  orderNo, esimTranNo, expiredTime, smdpAddress, activationCodePart, apn, shortUrl,
}: EsimDeliveryProps) => {
  const lang = getEmailLang(rawLang)
  const t = emailTranslations.esimDelivery[lang]
  const htmlLang = lang === 'pt' ? 'pt' : lang === 'es' ? 'es' : 'en'

  return (
    <Html lang={htmlLang} dir="ltr">
      <Head />
      <Preview>{t.preview(packageName || 'eSIM')}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Img
              src="https://spudbndneoaltpseizye.supabase.co/storage/v1/object/public/assets/logo-intersofti-full.png"
              alt="INTERSOFTI"
              width="200"
              height="auto"
              style={logoImg}
            />
          </Section>

          <Text style={tagline}>
            <em>{t.tagline}</em>
          </Text>

          <Hr style={hr} />

          <Text style={text}>{t.greeting}</Text>
          <Text style={text}>{t.thankYou}</Text>

          {qrCodeUrl && (
            <Section style={qrSection}>
              <Text style={qrLabel}>{t.scanQr}</Text>
              <Img src={qrCodeUrl} alt="eSIM QR Code" width="180" height="180" style={qrImage} />
            </Section>
          )}

          <Section style={tableSection}>
            <Row style={tableRow}>
              <Column style={tableLabelCol}>{t.orderNumber}</Column>
              <Column style={tableValueCol}>{orderNo || 'N/A'}</Column>
            </Row>
            <Row style={tableRow}>
              <Column style={tableLabelCol}>{t.esimTransactionNo}</Column>
              <Column style={tableValueCol}>{esimTranNo || 'N/A'}</Column>
            </Row>
            <Row style={tableRow}>
              <Column style={tableLabelCol}>{t.dataplanName}</Column>
              <Column style={tableValueCol}>{packageName || 'N/A'}</Column>
            </Row>
            {expiredTime && (
              <Row style={tableRow}>
                <Column style={tableLabelCol}>{t.activateBefore}</Column>
                <Column style={tableValueCol}>{expiredTime}</Column>
              </Row>
            )}
          </Section>

          <Section style={tableSection}>
            <Row style={tableRow}>
              <Column style={tableLabelCol}>{t.activationCodeString}</Column>
              <Column style={tableValueCol}><span style={monoStyle}>{activationCode || 'N/A'}</span></Column>
            </Row>
            {smdpAddress && (
              <Row style={tableRow}>
                <Column style={tableLabelCol}>{t.smdpAddress}</Column>
                <Column style={tableValueCol}><span style={monoStyle}>{smdpAddress}</span></Column>
              </Row>
            )}
            {activationCodePart && (
              <Row style={tableRow}>
                <Column style={tableLabelCol}>{t.activationCode}</Column>
                <Column style={tableValueCol}><span style={monoStyle}>{activationCodePart}</span></Column>
              </Row>
            )}
            {apn && (
              <Row style={tableRow}>
                <Column style={tableLabelCol}>{t.apn}</Column>
                <Column style={tableValueCol}><span style={monoStyle}>{apn}</span></Column>
              </Row>
            )}
          </Section>

          <Section style={{ margin: '20px 0' }}>
            <Text style={labelBold}>{t.quickInstall}</Text>
            <Row>
              <Column style={{ paddingRight: '8px' }}>
                <Link href={activationCode || '#'} style={installButton}>{t.iosLabel}</Link>
              </Column>
              <Column>
                <Link href={activationCode || '#'} style={installButton}>{t.androidLabel}</Link>
              </Column>
            </Row>
          </Section>

          {shortUrl && (
            <Section style={{ margin: '20px 0' }}>
              <Text style={text}>{t.shareLink}</Text>
              <Link href={shortUrl} style={linkStyle}>{shortUrl}</Link>
            </Section>
          )}

          <Hr style={hr} />

          <Text style={signatureText}>{t.regards}</Text>
          <Text style={signatureBrand}>{SITE_NAME}</Text>
          <Text style={signatureDetail}>🌐 www.rpjsoftware.com</Text>
          <Text style={signatureDetail}>✉ info@rpjsoftware.com</Text>

          <Hr style={hr} />

          <Text style={systemNote}>{t.systemNote}</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: EsimDeliveryEmail,
  subject: (data: Record<string, any>) => {
    const lang = getEmailLang(data.lang)
    return emailTranslations.esimDelivery[lang].subject(data.packageName || 'eSIM')
  },
  displayName: 'eSIM Delivery',
  previewData: {
    lang: 'es',
    packageName: 'Brazil 1GB 7Days',
    iccid: '8948010010014465362',
    qrCodeUrl: 'https://placehold.co/180x180?text=QR+Code',
    activationCode: 'LPA:1$rsp-eu.simlessly.com$20B58570FA2A477FA316EA3017FAA675',
    orderNo: 'B26041318500001',
    esimTranNo: '26041318500001',
    expiredTime: '2026-04-20 19:04:09 UTC',
    smdpAddress: 'rsp-eu.simlessly.com',
    activationCodePart: '20B58570FA2A477FA316EA3017FAA675',
    apn: 'plus',
    shortUrl: 'https://p.qrsim.net/ff2c178b4d204e3e91799de9fa21d388',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif" }
const container = { padding: '30px 25px', maxWidth: '600px', margin: '0 auto' }
const logoSection = { textAlign: 'center' as const, margin: '0 0 10px' }
const logoImg = { margin: '0 auto' }
const tagline = { fontSize: '14px', color: '#333', textAlign: 'center' as const, fontStyle: 'italic' as const, margin: '0 0 20px' }
const text = { fontSize: '14px', color: '#333333', lineHeight: '1.6', margin: '0 0 12px' }
const qrSection = { margin: '20px 0' }
const qrLabel = { fontSize: '14px', color: '#3B82F6', margin: '0 0 8px', fontWeight: 'bold' as const }
const qrImage = { borderRadius: '4px', border: '1px solid #e4e4e7' }
const tableSection = { border: '1px solid #e4e4e7', borderRadius: '6px', padding: '12px', margin: '16px 0' }
const tableRow = { margin: '0 0 8px' }
const tableLabelCol = { fontSize: '13px', color: '#666666', fontWeight: 'bold' as const, width: '45%', verticalAlign: 'top' as const, paddingBottom: '8px' }
const tableValueCol = { fontSize: '13px', color: '#1a1a1a', width: '55%', verticalAlign: 'top' as const, paddingBottom: '8px' }
const monoStyle = { fontFamily: 'monospace', fontSize: '12px', wordBreak: 'break-all' as const }
const labelBold = { fontSize: '14px', color: '#333', margin: '0 0 8px', fontWeight: 'bold' as const }
const installButton = {
  display: 'inline-block' as const,
  backgroundColor: '#1a1a1a',
  color: '#ffffff',
  padding: '8px 20px',
  borderRadius: '20px',
  fontSize: '13px',
  fontWeight: 'bold' as const,
  textDecoration: 'none',
}
const linkStyle = { fontSize: '13px', color: '#3B82F6', textDecoration: 'underline' }
const hr = { borderColor: '#e4e4e7', margin: '24px 0' }
const signatureText = { fontSize: '13px', color: '#333', margin: '0 0 4px' }
const signatureBrand = { fontSize: '14px', color: '#1a1a1a', fontWeight: 'bold' as const, margin: '0 0 4px' }
const signatureDetail = { fontSize: '12px', color: '#666', margin: '0 0 2px' }
const systemNote = { fontSize: '11px', color: '#999999', textAlign: 'center' as const, fontStyle: 'italic' as const }
