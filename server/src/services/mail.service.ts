// import { getTestMessageUrl, SentMessageInfo } from "nodemailer";
// import { env } from "../config/env";
// import logger from "../config/logger";
// import { transporter } from "../utils/transporter";

// export async function sendHostEmail(toEmail: string) {
//     transporter.sendMail(
//         { 
//             from: {
//                 name: env.ADMIN_NAME,
//                 address: env.ADMIN_EMAIL,
//             },
//             to: toEmail,
//             subject: 'New Booking',
//             html: `
//       <!DOCTYPE html>
//       <html lang="en">

//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <title>Follow-up Rquest Confirmation</title>
//             <style>
//                 body {
//                     font-family: 'Times New Roman', Times, serif;
//                     line-height: 1.6;
//                     color: #333;
//                     font-size: 16px;
//                     margin: 20px;
//                 }

//                 h2 {
//                     color: #007bff;
//                 }
//             </style>
//         </head>

//         <body>

            

//         </body>

//     </html>
//     `,
//         },
//         (err, info: SentMessageInfo) => {
//             if (err) {
//                 logger.error(err, 'Error sending email');
//                 return;
//             }

//             logger.info(`Preview URL: ${getTestMessageUrl(info)}`);
//         }
//     );
// }