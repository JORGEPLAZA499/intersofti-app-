/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as esimDelivery } from './esim-delivery.tsx'
import { template as contactNotification } from './contact-notification.tsx'
import { template as ghostcodeOrderConfirmation } from './ghostcode-order-confirmation.tsx'
import { template as invoiceDelivery } from './invoice-delivery.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'esim-delivery': esimDelivery,
  'contact-notification': contactNotification,
  'ghostcode-order-confirmation': ghostcodeOrderConfirmation,
  'invoice-delivery': invoiceDelivery,
}
