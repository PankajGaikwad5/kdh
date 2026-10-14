import { formatTitle, getCollectionName } from '../../lib/utils.js';

/**
 * Escapes HTML characters to prevent injection in emails
 */
export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Builds the customer auto-reply confirmation email for cart inquiries
 * @param {Object} options
 * @param {string} options.name Customer name
 * @param {string} options.email Customer email
 * @param {string} options.number Customer contact phone
 * @param {string} options.message Customer notes/message
 * @param {Array} options.cartItems Array of cart items [{ title, image, selectedMarble, material, collectionName }]
 * @param {string} options.referenceId Optional unique reference ID
 * @returns {{ html: string, text: string, subject: string, attachments: Array }}
 */
export function generateCustomerCartEmail({
  name = 'Valued Customer',
  email = '',
  number = '',
  message = '',
  cartItems = [],
  referenceId = '',
}) {
  const safeName = escapeHtml(name || '');
  const displayName = safeName && safeName.trim() && safeName.toLowerCase() !== 'valued customer' ? safeName : 'Customer';
  const safeEmail = escapeHtml(email);
  const safeNumber = escapeHtml(number);
  const safeMessage = escapeHtml(message);
  const refId = referenceId || `KDH-${Date.now().toString().slice(-6)}`;
  const currentYear = new Date().getFullYear();
  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const attachments = [];
  const baseLiveUrl = 'https://karandesaihome.com';

  // 1. Brand Logo URL (referenced directly in HTML)
  const logoUrl = `${baseLiveUrl}/assets/kdhlogo3.png`;

  // 2. Process Cart Item Images (use live HTTPS URLs for template + attach remote files without bundling local disk)
  const processedItems = (cartItems || []).map((item, idx) => {
    let imgSrc = `${baseLiveUrl}/placeholder.png`;
    const rawImage = item.image || '';

    if (rawImage.startsWith('http://') || rawImage.startsWith('https://')) {
      imgSrc = rawImage;
    } else if (rawImage) {
      const cleanRel = rawImage.replace(/^\/+/, '').split('?')[0];
      imgSrc = `${baseLiveUrl}/${cleanRel}`;
    }

    const titleFormatted = formatTitle(item.title) || item.title || 'Luxury Product';
    const collection = item.collectionName || getCollectionName(item) || '';

    // Nodemailer streams attachments directly from remote HTTPS URLs at runtime without bundling local files
    if (imgSrc && !imgSrc.includes('placeholder.png')) {
      const ext = imgSrc.split('.').pop().split(/[?#]/)[0] || 'jpg';
      attachments.push({
        filename: `${(titleFormatted || 'Product').replace(/[^a-zA-Z0-9_-]/g, '_')}-${idx + 1}.${ext}`,
        path: imgSrc,
      });
    }

    return {
      title: titleFormatted,
      safeTitle: escapeHtml(titleFormatted),
      image: imgSrc,
      collection: collection,
      safeCollection: escapeHtml(collection),
      marble: item.selectedMarble || '',
      safeMarble: escapeHtml(item.selectedMarble || ''),
      material: item.material || '',
      safeMaterial: escapeHtml(item.material || ''),
    };
  });

  // Build HTML for each product card
  const productsHtml = processedItems.length > 0
    ? processedItems
        .map(
          (item) => `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #111111; border: 1px solid #242424; border-radius: 6px; margin-bottom: 12px; overflow: hidden;">
        <tr>
          <td style="padding: 14px 16px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <!-- Product Thumbnail -->
                <td width="88" valign="middle" align="center" style="padding-right: 16px;">
                  <table cellpadding="0" cellspacing="0" border="0" style="width: 84px; height: 84px; background-color: #050505; border: 1px solid #2a2a2a; border-radius: 4px;">
                    <tr>
                      <td align="center" valign="middle" style="width: 84px; height: 84px; padding: 2px;">
                        <img src="${item.image}" alt="${item.safeTitle}" width="80" height="80" style="display: block; width: 80px; height: 80px; max-width: 80px; max-height: 80px; object-fit: contain; border: 0; outline: none; margin: 0 auto;" />
                      </td>
                    </tr>
                  </table>
                </td>

                <!-- Product Information -->
                <td valign="middle" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; text-align: left;">
                  <div style="font-size: 15px; font-weight: 600; color: #ffffff; letter-spacing: 0.5px; text-transform: capitalize; margin-bottom: 5px; line-height: 1.3;">
                    ${item.safeTitle}
                  </div>
                  
                  ${
                    item.safeCollection
                      ? `<div style="font-size: 12px; color: #999999; margin-bottom: 4px; line-height: 1.4;">
                          Collection: <strong style="color: #e2e8f0; font-weight: 500;">${item.safeCollection}</strong>
                        </div>`
                      : ''
                  }

                  ${
                    item.safeMarble
                      ? `<div style="font-size: 12px; color: #999999; margin-bottom: 4px; line-height: 1.4;">
                          Variant: <span style="display: inline-block; background-color: #1a1a1a; color: #ffffff; border: 1px solid #333333; padding: 2px 8px; border-radius: 2px; font-size: 11px; font-weight: 500;">${item.safeMarble}</span>
                        </div>`
                      : ''
                  }

                  ${
                    item.safeMaterial
                      ? `<div style="font-size: 12px; color: #999999; line-height: 1.4;">
                          Material: <span style="color: #cbd5e1;">${item.safeMaterial}</span>
                        </div>`
                      : ''
                  }
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>`
        )
        .join('')
    : `<div style="padding: 20px; text-align: center; color: #888888; font-size: 13px;">No item details available</div>`;

  // HTML Customer Note block if provided
  const customerNoteHtml = safeMessage
    ? `
      <tr>
        <td colspan="2" style="padding-top: 14px; border-top: 1px solid #222222; margin-top: 12px;">
          <span style="display: block; font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: #777777; margin-bottom: 4px;">Your Note / Message</span>
          <div style="font-size: 12px; color: #cccccc; font-style: italic; background-color: #0b0b0b; padding: 10px 14px; border-left: 2px solid #ffffff; border-radius: 2px; line-height: 1.5;">
            "${safeMessage}"
          </div>
        </td>
      </tr>`
    : '';

  // 3. Assemble Complete HTML
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>We have received your enquiry | Karan Desai Home</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    @media only screen and (max-width: 600px) {
      .responsive-table { width: 100% !important; }
      .responsive-padding { padding-left: 20px !important; padding-right: 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #e5e5e5;">

  <!-- Outer background container -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #050505; padding: 32px 10px;">
    <tr>
      <td align="center">

        <!-- Main Card (600px) -->
        <table class="responsive-table" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #0d0d0d; border: 1px solid #1f1f1f; border-radius: 8px; overflow: hidden; box-shadow: 0 12px 35px rgba(0,0,0,0.85);">
          
          <!-- BRAND HEADER -->
          <tr>
            <td align="center" style="padding: 36px 30px 24px 30px; border-bottom: 1px solid #1a1a1a; background-color: #080808;">
              <a href="https://karandesaihome.com" target="_blank" style="text-decoration: none; display: inline-block;">
                <img src="${logoUrl}" alt="Karan Desai Home" width="130" style="display: block; max-width: 130px; height: auto; border: 0; margin: 0 auto;" />
              </a>
              <div style="font-size: 9px; letter-spacing: 3.5px; color: #888888; text-transform: uppercase; margin-top: 14px; font-weight: 500;">
                Architecture &middot; Interiors &middot; Objects
              </div>
            </td>
          </tr>

          <!-- HERO BANNER -->
          <tr>
            <td class="responsive-padding" style="padding: 32px 36px 20px 36px; text-align: center;">
              
              <!-- Subtle Monochrome Pill Badge -->
              <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto 16px auto;">
                <tr>
                  <td style="background-color: #141414; border: 1px solid #2e2e2e; padding: 5px 14px; border-radius: 9999px; font-size: 10px; font-weight: 500; letter-spacing: 2px; color: #e5e5e5; text-transform: uppercase;">
                    Enquiry Received
                  </td>
                </tr>
              </table>

              <h1 style="margin: 0 0 14px 0; font-size: 22px; font-weight: 600; color: #ffffff; letter-spacing: 0.5px; line-height: 1.3;">
                We Have Received Your Enquiry
              </h1>

              <p style="margin: 0 auto; font-size: 14px; line-height: 1.7; color: #a1a1aa; max-width: 480px;">
                Dear <strong style="color: #ffffff;">${displayName}</strong>, we have received your enquiry for ${processedItems.length === 1 ? `<strong style="color: #ffffff;">${processedItems[0].safeTitle}</strong>` : `the ${processedItems.length} products listed below`}. We'll get back to you soon on the details you provided.
              </p>
            </td>
          </tr>

          <!-- INQUIRY DETAILS CARD -->
          <tr>
            <td class="responsive-padding" style="padding: 0 36px 24px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #121212; border: 1px solid #202020; border-radius: 6px; padding: 18px 20px;">
                <tr>
                  <td width="50%" valign="top" style="font-size: 12px; color: #888888; line-height: 1.6; padding-right: 10px;">
                    <span style="display: block; font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: #666666; margin-bottom: 4px;">Reference No.</span>
                    <strong style="color: #e5e5e5; font-size: 13px; font-family: monospace;">${refId}</strong>
                  </td>
                  <td width="50%" valign="top" style="font-size: 12px; color: #888888; line-height: 1.6;">
                    <span style="display: block; font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: #666666; margin-bottom: 4px;">Date</span>
                    <span style="color: #e5e5e5; font-size: 13px;">${formattedDate}</span>
                  </td>
                </tr>
                ${customerNoteHtml}
              </table>
            </td>
          </tr>

          <!-- SECTION HEADER -->
          <tr>
            <td class="responsive-padding" style="padding: 8px 36px 14px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #ffffff;">
                    Inquired Product${processedItems.length > 1 ? 's' : ''} (${processedItems.length})
                  </td>
                  <td align="right" style="font-size: 10px; color: #666666; letter-spacing: 1px; text-transform: uppercase;">
                    KDH Collection
                  </td>
                </tr>
              </table>
              <div style="height: 1px; background-color: #1f1f1f; margin-top: 8px;"></div>
            </td>
          </tr>

          <!-- PRODUCT LIST -->
          <tr>
            <td class="responsive-padding" style="padding: 0 36px 28px 36px;">
              ${productsHtml}
            </td>
          </tr>

          <!-- EXPLORE MORE BUTTON -->
          <tr>
            <td align="center" style="padding: 0 36px 36px 36px;">
              <table cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                  <td align="center" style="background-color: #ffffff; border-radius: 2px;">
                    <a href="https://karandesaihome.com/collections" target="_blank" style="display: inline-block; padding: 13px 30px; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #000000; text-decoration: none;">
                      Explore More Collections
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td class="responsive-padding" style="background-color: #080808; border-top: 1px solid #1a1a1a; padding: 26px 36px; text-align: center;">
              
              <div style="font-size: 11px; color: #666666; line-height: 1.6; max-width: 440px; margin: 0 auto 14px auto;">
                Shah Industrial Estate, 1001 PARINEE I, 7-A, Andheri West, Mumbai, Maharashtra 400053
              </div>

              <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto 14px auto;">
                <tr>
                  <td style="padding: 0 8px;">
                    <a href="https://karandesaihome.com" target="_blank" style="color: #888888; font-size: 11px; text-decoration: none; letter-spacing: 1px;">Website</a>
                  </td>
                  <td style="color: #333333;">&middot;</td>
                  <td style="padding: 0 8px;">
                    <a href="https://www.instagram.com/karandesaihome/" target="_blank" style="color: #888888; font-size: 11px; text-decoration: none; letter-spacing: 1px;">Instagram</a>
                  </td>
                  <td style="color: #333333;">&middot;</td>
                  <td style="padding: 0 8px;">
                    <a href="https://www.linkedin.com/in/karandesaiad/" target="_blank" style="color: #888888; font-size: 11px; text-decoration: none; letter-spacing: 1px;">LinkedIn</a>
                  </td>
                </tr>
              </table>

              <div style="font-size: 10px; color: #444444; letter-spacing: 1px; text-transform: uppercase;">
                &copy; ${currentYear} Karan Desai Home. All rights reserved.
              </div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;

  // 4. Plain-text version for email clients that do not support HTML
  const itemsText = processedItems
    .map((item, i) => {
      let line = `${i + 1}. ${item.title}`;
      if (item.collection) line += ` | Collection: ${item.collection}`;
      if (item.marble) line += ` | Variant: ${item.marble}`;
      if (item.material) line += ` | Material: ${item.material}`;
      return line;
    })
    .join('\n');

  const text = `Dear ${displayName},

We have received your enquiry for the following product(s):
${itemsText}

Reference: ${refId}
Date: ${formattedDate}
${number ? `Contact Number: ${number}\n` : ''}${message ? `Notes: ${message}\n` : ''}
We will get back to you soon on the details you provided.

Warm regards,
Karan Desai Home
Shah Industrial Estate, 1001 PARINEE I, 7-A, Andheri West, Mumbai, Maharashtra 400053
https://karandesaihome.com
`;

  const productSummary = processedItems.map((p) => p.title).filter(Boolean).slice(0, 2).join(' & ');
  const subject = productSummary
    ? `We have received your enquiry for ${productSummary}${processedItems.length > 2 ? ' and more' : ''} | Karan Desai Home`
    : 'We have received your enquiry | Karan Desai Home';

  return {
    subject,
    html,
    text,
    attachments,
  };
}

/**
 * Builds the admin notification email for cart inquiries
 */
export function generateAdminCartEmail({
  name,
  email,
  number,
  message,
  product,
  cartItems = [],
  locationText = '',
  referenceId = '',
}) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeNumber = escapeHtml(number);
  const safeMessage = escapeHtml(message);
  const refId = referenceId || `KDH-${Date.now().toString().slice(-6)}`;
  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const itemsListHtml = (cartItems || [])
    .map((item, idx) => {
      const title = formatTitle(item.title) || item.title || 'Product';
      const collection = item.collectionName || getCollectionName(item) || '';
      return `
        <li style="margin-bottom: 8px;">
          <strong>${escapeHtml(title)}</strong>
          ${collection ? ` &mdash; Collection: <em>${escapeHtml(collection)}</em>` : ''}
          ${item.selectedMarble ? ` &mdash; Variant: <span style="background: #eee; padding: 2px 6px; border-radius: 3px;">${escapeHtml(item.selectedMarble)}</span>` : ''}
          ${item.material ? ` &mdash; Material: ${escapeHtml(item.material)}` : ''}
        </li>`;
    })
    .join('');

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; background-color: #ffffff; color: #111111; border: 1px solid #e2e8f0; border-radius: 8px;">
      <div style="border-bottom: 2px solid #000000; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="margin: 0; color: #000000; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">
          New Cart Enquiry Received
        </h2>
        <div style="font-size: 12px; color: #666666; margin-top: 4px;">
          Reference: <strong>${refId}</strong> &middot; ${formattedDate}
        </div>
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #334155;">Customer Details</h3>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Name:</strong> ${safeName}</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Contact No.:</strong> <a href="tel:${safeNumber}">${safeNumber}</a></p>
        ${locationText ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Location:</strong> ${escapeHtml(locationText.replace(/^[\n\r]+Location:\s*/i, ''))}</p>` : ''}
        ${safeMessage ? `<p style="margin: 8px 0 0 0; font-size: 14px; padding-top: 8px; border-top: 1px dashed #cbd5e1;"><strong>Message:</strong> ${safeMessage}</p>` : ''}
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="margin-top: 0; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #334155;">Inquired Items (${cartItems.length})</h3>
        ${
          cartItems.length > 0
            ? `<ul style="font-size: 14px; line-height: 1.6; padding-left: 20px;">${itemsListHtml}</ul>`
            : `<p style="font-size: 14px; color: #555555;">${escapeHtml(product || 'No product specified')}</p>`
        }
      </div>

      <div style="font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 24px;">
        This notification was automatically generated by the Karan Desai Home Cart Enquiry system. An automated confirmation email has also been dispatched to the customer.
      </div>
    </div>
  `;

  const text = `New Cart Enquiry Received [${refId}]
Name: ${name}
Email: ${email}
Contact No.: ${number}
${locationText ? `${locationText}\n` : ''}${message ? `Message: ${message}\n` : ''}
Inquired Products:
${(cartItems || []).map((it, i) => `${i + 1}. ${formatTitle(it.title) || it.title}${it.selectedMarble ? ` (${it.selectedMarble})` : ''}`).join('\n') || product}
`;

  return { html, text };
}
