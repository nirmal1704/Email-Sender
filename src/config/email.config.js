// ==========================================
// EMAIL CONFIGURATION & TEMPLATE
// ==========================================

export const emailConfig = {
  from: 'Team AntiLabs <noreply@antilabs.in>'
};

export const getEmailSubject = (userData) => {
  return `HACKLABS 2026 is Here! Registrations are NOW OPEN`;
};

export const getEmailHtml = (userData) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>HackLabs 2026 is Here!</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Raleway+Dots&family=Raleway:wght@300;400;600&display=swap');
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Raleway', sans-serif; font-weight: 300; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 50px 20px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; text-align: left; border: 1px solid #333; border-radius: 8px; padding: 40px; background-color: #0a0a0a;">
          
          <!-- Header -->
          <tr>
            <td style="padding-bottom: 30px; border-bottom: 1px solid #333; text-align: center;">
              <h1 style="margin: 0; font-family: 'Raleway Dots', 'Raleway', sans-serif; font-weight: 400; font-size: 36px; color: #ffffff; letter-spacing: 2px;">
                HackLabs
              </h1>
            </td>
          </tr>
          
          <!-- Body text -->
          <tr>
            <td style="padding-top: 30px; padding-bottom: 20px;">
              <h2 style="margin: 0 0 20px 0; font-size: 22px; font-weight: 600; color: #ffffff; line-height: 1.4; text-align: center;">
                HACKLABS 2026 is Here!
              </h2>
              
              <p style="margin: 0 0 15px 0; font-size: 16px; color: #e5e5e5; line-height: 1.6;">
                Dear ${userData.Name || 'Innovator'},
              </p>
              
              <p style="margin: 0 0 15px 0; font-size: 16px; color: #e5e5e5; line-height: 1.6;">
                Got an innovative idea? Turn it into reality at <strong>HackLabs 2026</strong>, Antilabs' National Level Online Hackathon.
              </p>

              <!-- The poster image -->
              <div style="text-align: center; margin: 20px 0;">
                <img src="https://i.postimg.cc/FRfXhwjq/hacklabs-poster.jpg" alt="HackLabs 2026 Poster" style="max-width: 100%; border-radius: 8px; border: 1px solid #333;" />
              </div>

              <!-- Details Box -->
              <div style="background-color: #111111; padding: 20px; border-radius: 8px; border: 1px solid #222; margin: 20px 0;">
                <ul style="list-style-type: none; padding-left: 0; margin: 0; font-size: 16px; color: #e5e5e5;">
                  <li style="margin-bottom: 10px;"><img src="https://img.icons8.com/ios-filled/18/ffffff/calendar.png" width="18" height="18" style="vertical-align: middle; margin-right: 8px;" alt="" /> <strong>Dates:</strong> 8–9 August 2026</li>
                  <li style="margin-bottom: 10px;"><img src="https://img.icons8.com/ios-filled/18/ffffff/trophy.png" width="18" height="18" style="vertical-align: middle; margin-right: 8px;" alt="" /> <strong>Prize Pool:</strong> ₹10,000</li>
                  <li style="margin-bottom: 10px;"><img src="https://img.icons8.com/ios-filled/18/ffffff/laptop.png" width="18" height="18" style="vertical-align: middle; margin-right: 8px;" alt="" /> <strong>Mode:</strong> Online</li>
                  <li><strong>Eligibility:</strong> Open to participants across India</li>
                </ul>
              </div>
              
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #e5e5e5; line-height: 1.6;">
                Collaborate with your team, solve real-world challenges, build impactful solutions, and showcase your skills on a national platform. Whether you're a beginner or an experienced developer, this is your chance to learn, innovate, and compete.
              </p>

              <div style="text-align: center; margin: 35px 0;">
                <h3 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 600; color: #ffffff;">Registrations are NOW OPEN!</h3>
                <a href="https://www.antilabs.in/hacklabs" style="background-color: #ffffff; color: #000000; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 16px; display: inline-block;">Register Here</a>
              </div>

              <p style="margin: 0 0 15px 0; font-size: 14px; color: #888; line-height: 1.6; text-align: center;">
                <em>Note: We have attached the Rules and Regulations document along with this email for your reference.</em>
              </p>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="border-top: 1px solid #333; padding-top: 25px; text-align: center;">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #888; line-height: 1.6;">
                <strong>Any Queries? Contact Us:</strong><br>
                <img src="https://img.icons8.com/ios-filled/16/ffffff/phone.png" width="16" height="16" style="vertical-align: middle; margin-right: 6px;" alt="" /> <span style="color: #ffffff;">+91 7049780160</span><br>
                <img src="https://img.icons8.com/ios-filled/16/ffffff/new-post.png" width="16" height="16" style="vertical-align: middle; margin-right: 6px;" alt="" /> <a href="mailto:contact@antilabs.in" style="color: #ffffff; text-decoration: none;">contact@antilabs.in</a>
              </p>
              <p style="margin: 25px 0 0 0; font-family: 'Raleway Dots', 'Raleway', sans-serif; font-weight: 400; font-size: 24px; color: #ffffff; letter-spacing: 2px;">
                Build. Innovate. Get Hired.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
