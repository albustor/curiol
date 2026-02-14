# Meta WhatsApp API Provisioning Guide

This guide addresses the "Account not registered" error and ensures your WhatsApp Cloud API is fully operational.

## 1. Meta Developer Portal Check
1. Go to [Meta Developers](https://developers.facebook.com/).
2. Select your app (likely **Curiol Studio**).
3. In the left menu, go to **WhatsApp > Getting Started**.
4. **Is there a "Step 1: Select phone number"?**
    - Ensure your verified phone number is selected here.
    - If it says "Temporary number", you must follow the steps to add a real phone number.

## 2. SMS Verification
Meta requires you to "Register" the number before it can send messages via API:
1. In **WhatsApp > Getting Started**, find the section for your phone number.
2. Click on **Registered** or **Add Phone Number**.
3. Follow the SMS verification process.
4. **IMPORTANT**: If the number is already used in a standard WhatsApp App, you must delete the account from the app first (Meta doesn't allow a number to be in both the App and the Cloud API simultaneously).

## 3. Payment Method
WhatsApp Cloud API has a free tier (1,000 service-initiated conversations per month), but **it requires a valid payment method** to be active:
1. Go to your **Business Settings** in Meta.
2. Go to **Payments**.
3. Add a credit/debit card. Without this, the API often returns "Account not registered" errors even for small tests.

## 4. Webhook Verification
Your current `META_VERIFY_TOKEN` is `abustosort`. 
1. In **WhatsApp > Configuration**, click **Edit** in the Webhooks section.
2. Callback URL: `https://your-domain.com/api/webhooks/meta` (Replace with your actual Vercel/Production URL).
3. Verify Token: `abustosort`.
4. **Fields to subscribe**: Ensure you are subscribed to `messages`.

## Troubleshooting "Account not registered"
If everything above looks correct, try sending a "PING" message to your WhatsApp number from a personal phone. If the webhook is working, you should see a log in your Firestore `meta_debug_logs` collection.
