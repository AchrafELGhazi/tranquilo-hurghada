
export class WelcomeTemplate {
    static getWelcomeEmail(userName: string, userEmail: string): { subject: string; html: string } {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; }
                    .header { background: #C75D2C; color: white; padding: 30px; text-align: center; }
                    .content { padding: 30px; }
                    .welcome-box { background: #F3E9DC; padding: 25px; border-radius: 12px; margin: 20px 0; text-align: center; }
                    .cta-button { display: inline-block; background: #C75D2C; color: white; padding: 14px 28px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
                    .footer { background: #F3E9DC; padding: 25px; text-align: center; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to Tranquilo Hurghada</h1>
                    </div>
                    
                    <div class="content">
                        <h2>Welcome, ${userName}!</h2>
                        
                        <p>Thank you for joining Tranquilo Hurghada, where ancient Egyptian mystique meets contemporary luxury along the Red Sea coast.</p>
                        
                        <div class="welcome-box">
                            <h3>Your Red Sea Adventure Begins Here</h3>
                            <p>You now have access to our exclusive villa booking system and premium services.</p>
                        </div>
                        
                        <div style="text-align: center;">
                            <a href="https://tranquilo-hurghada.com" class="cta-button">Explore Our Villa</a>
                        </div>
                        
                        <p>Need assistance? Our team is here to help you create unforgettable memories in Hurghada.</p>
                    </div>
                    
                    <div class="footer">
                        <p>📍 Villa No. 276, Mubarak Housing 7, North Hurghada, Egypt</p>
                        <p>📞 +49 176 7623 0320 | ✉️ nabil.laaouina@outlook.com</p>
                        <p>This email was sent to ${userEmail}</p>
                        <p>© 2024 Tranquilo Hurghada. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        return {
            subject: 'Welcome to Tranquilo Hurghada - Your Red Sea Paradise Awaits!',
            html
        };
    }
}