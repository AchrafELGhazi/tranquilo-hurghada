# WhatsApp Integration Setup Guide

This guide will help you set up WhatsApp Business API integration for your Tranquilo Hurghada villa booking system.

## Prerequisites

1. **WhatsApp Business Account**: You need a verified WhatsApp Business account
2. **Meta Developer Account**: Create an account at [developers.facebook.com](https://developers.facebook.com)
3. **Phone Number**: A dedicated phone number for your business (not used with personal WhatsApp)

## Step 1: Install Dependencies

```bash
npm install whatsapp-api-js
# or
yarn add whatsapp-api-js
```

## Step 2: Meta Developer Setup

### 2.1 Create a Meta App
1. Go to [Meta Developers](https://developers.facebook.com)
2. Click "Create App" → "Business" → "Next"
3. Enter your app name (e.g., "Tranquilo Hurghada Notifications")
4. Add your business email
5. Click "Create App"

### 2.2 Add WhatsApp Product
1. In your app dashboard, click "Add Product"
2. Find "WhatsApp" and click "Set up"
3. Choose "Start using the API"

### 2.3 Get Your Credentials
From the WhatsApp API setup page, note down:
- **Access Token** (temporary - 24 hours)
- **App Secret** (App Settings → Basic → App Secret)
- **Phone Number ID** (WhatsApp → API Setup)
- **WhatsApp Business Account ID**

## Step 3: Environment Variables

Add these variables to your `.env` file:

```env
# WhatsApp Business API Configuration
WHATSAPP_ACCESS_TOKEN=your_permanent_access_token_here
WHATSAPP_APP_SECRET=your_app_secret_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_custom_verify_token_here
```

## Step 4: Get Permanent Access Token

The temporary token expires in 24 hours. To get a permanent token:

### 4.1 Create a System User
1. Go to Meta Business Manager
2. Business Settings → Users → System Users
3. Click "Add" → Create system user
4. Give it "Admin" role

### 4.2 Generate Permanent Token
1. Select your system user
2. Click "Add Assets" → Apps
3. Select your app and give "Manage app" permission
4. Click "Generate New Token"
5. Select your app and required permissions:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
6. Copy the permanent access token

### 4.3 Update Environment Variables
Replace the temporary token with your permanent token in `.env`:

```env
WHATSAPP_ACCESS_TOKEN=your_permanent_access_token_here
```

## Step 5: Phone Number Verification

1. In WhatsApp API Setup, click "Add phone number"
2. Enter your business phone number
3. Verify via SMS/call
4. Complete the verification process

## Step 6: File Structure

Create the following files in your project:

```
src/
├── controllers/
│   └── whatsapp.controller.ts
├── routes/
│   └── whatsapp.route.ts
├── services/
│   └── whatsapp.service.ts
├── utils/
│   └── whatsapp.utils.ts
└── types/
    └── whatsapp.ts
```

## Step 7: Testing the Integration

### 7.1 Test Connection
Use this endpoint to test your setup:

```bash
POST /api/whatsapp/test-connection
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "phoneNumber": "+201234567890",
  "message": "Test message from Tranquilo Hurghada!"
}
```

### 7.2 Test Booking Notification
```bash
POST /api/whatsapp/send-booking-notification
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "phoneNumber": "+201234567890",
  "guestName": "John Doe",
  "checkInDate": "2024-12-25",
  "checkOutDate": "2024-12-30",
  "bookingRef": "BK123456789",
  "villaTitle": "Luxury Villa with Sea View"
}
```

## Step 8: Integration with Booking Flow

Add WhatsApp notification to your booking creation process:

```typescript
// In your booking controller
import { sendBookingNotificationMessage } from '../services/whatsapp.service';
import { validatePhoneNumber } from '../utils/whatsapp.utils';

// After creating booking
if (guest.phone && validatePhoneNumber(guest.phone)) {
  try {
    await sendBookingNotificationMessage({
      phoneNumber: guest.phone,
      guestName: guest.fullName,
      checkInDate: booking.checkIn.toISOString().split('T')[0],
      checkOutDate: booking.checkOut.toISOString().split('T')[0],
      bookingRef: booking.id,
      villaTitle: villa.title
    });
  } catch (error) {
    console.error('WhatsApp notification failed:', error);
    // Don't fail the booking if WhatsApp fails
  }
}
```

## Step 9: Webhook Setup (Optional)

To receive message status updates:

### 9.1 Create Webhook Endpoint
```typescript
// Add to your whatsapp.route.ts
whatsappRouter.post('/webhook', whatsappController.handleWebhook);
whatsappRouter.get('/webhook', whatsappController.verifyWebhook);
```

### 9.2 Configure Webhook in Meta
1. Go to WhatsApp → Configuration
2. Add webhook URL: `https://your-domain.com/api/whatsapp/webhook`
3. Add verify token (same as `WHATSAPP_WEBHOOK_VERIFY_TOKEN`)
4. Subscribe to `messages` events

## API Endpoints

### Available Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/whatsapp/send-booking-notification` | Send booking notification | Yes |
| POST | `/api/whatsapp/send-booking-notification/:bookingId` | Send notification by booking ID | Yes (Host/Admin) |
| POST | `/api/whatsapp/test-connection` | Test WhatsApp connection | Yes (Admin) |
| POST | `/api/whatsapp/send-message` | Send custom message | Yes (Admin) |

### Request Examples

#### Send Booking Notification
```json
{
  "phoneNumber": "+201234567890",
  "guestName": "Ahmed Hassan",
  "checkInDate": "2024-12-25",
  "checkOutDate": "2024-12-30",
  "bookingRef": "BK123456789",
  "villaTitle": "Beachfront Villa"
}
```

#### Send Custom Message
```json
{
  "phoneNumber": "+201234567890",
  "message": "Welcome to Tranquilo Hurghada! 🏖️",
  "includeLocation": true
}
```

## Troubleshooting

### Common Issues

1. **"Invalid phone number"**
   - Ensure phone number is in international format (+country_code)
   - Remove spaces and special characters

2. **"Access token expired"**
   - Generate a new permanent access token
   - Update your environment variables

3. **"Phone number not verified"**
   - Complete phone number verification in Meta Business Manager
   - Ensure the number is approved for messaging

4. **"Rate limit exceeded"**
   - WhatsApp has messaging limits for new business accounts
   - Request rate limit increase from Meta

### Rate Limits

- **New Business Accounts**: 250 unique recipients per 24 hours
- **Verified Business Accounts**: 1,000+ recipients per 24 hours
- **Message Templates**: Required for messages to users who haven't messaged you in 24 hours

## Security Best Practices

1. **Store tokens securely**: Use environment variables, never commit to code
2. **Validate phone numbers**: Always validate and format phone numbers
3. **Rate limiting**: Implement rate limiting on your endpoints
4. **Sanitize messages**: Clean user input before sending
5. **Monitor usage**: Track API calls and costs

## Costs

- **Conversation-based pricing**: Charged per 24-hour conversation window
- **Template messages**: ~$0.005 - $0.009 per message (varies by country)
- **Service messages**: Free for customer service responses within 24 hours

## Next Steps

1. Set up message templates in Meta Business Manager for better delivery rates
2. Implement webhook handlers for message status updates
3. Add more notification types (confirmation, cancellation, reminders)
4. Set up automated responses for common queries
5. Integrate with your booking confirmation/cancellation flows

## Support

- [WhatsApp Business API Documentation](https://developers.facebook.com/docs/whatsapp)
- [whatsapp-api-js Library](https://github.com/Secreto31126/whatsapp-api-js)
- [Meta Business Support](https://business.facebook.com/support)