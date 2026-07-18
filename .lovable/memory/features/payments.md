---
name: Dual Payment System
description: Stripe for card payments, Plisio for crypto payments on eSIM products
type: feature
---
- Stripe: embedded checkout via `create-esim-checkout` edge function
- Plisio: redirect to hosted page via `create-plisio-invoice` edge function
- Shared eSIM provisioning logic in `_shared/esim-provision.ts`
- Plisio webhook at `plisio-webhook` verifies HMAC and triggers provisioning
- Products page shows two buttons per card: "Pay with Card" + "Pay with Crypto"
- CheckoutReturn handles `?method=crypto` for pending crypto confirmation
