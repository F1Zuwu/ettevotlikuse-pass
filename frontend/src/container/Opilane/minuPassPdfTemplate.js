const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const resolvePrintableImage = (activity) => {
  const imageProof = (activity.proofs || []).find((proof) => {
    const url = proof?.proof_url || "";
    return /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(url);
  });

  return imageProof?.proof_url || "";
};

export const buildMinuPassPdfHtml = ({
  user,
  activities,
  formatDate,
  resolveCategoryName,
  resolveProofUrl,
}) => {
  const printableActivities = activities.map((activity, index) => {
    const previewImage = resolveProofUrl(resolvePrintableImage(activity));
    const title = escapeHtml(activity.title || `Tegevus ${index + 1}`);
    const category = escapeHtml(resolveCategoryName(activity));
    const date = escapeHtml(formatDate(activity.date));
    const description = escapeHtml(activity.description || "Kirjeldus puudub");

    return `
      <section class="activity-card">
        <div class="activity-header">
          <h3>${title}</h3>
          <span class="activity-pill">${category}</span>
        </div>
        <p class="activity-date">${date}</p>
        ${previewImage ? `<img class="activity-image" src="${escapeHtml(previewImage)}" alt="Tegevuse pilt" />` : ""}
        <p class="activity-description">${description}</p>
      </section>
    `;
  });

  const profileImage = escapeHtml(user?.profileimg || "");
  const userName = escapeHtml(user?.name || "Kasutaja");

  return `
    <!doctype html>
    <html lang="et">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Ettevotlikkuse pass</title>
        <style>
          @page {
            size: A4;
            margin: 12mm;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            color: #ffffff;
            background: #000000;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
            print-color-adjust: exact;
          }

          .page {
            min-height: 100vh;
            background: linear-gradient(180deg, #ececec 0, #ececec 250px, #000000 250px, #000000 100%);
          }

          .profile {
            text-align: center;
            padding: 28px 20px 16px;
            color: #0a0a0a;
          }

          .profile-image {
            width: 140px;
            height: 140px;
            border-radius: 50%;
            object-fit: cover;
            border: 5px solid #000;
            display: inline-block;
            background: #dcdcdc;
          }

          .profile-placeholder {
            width: 140px;
            height: 140px;
            border-radius: 50%;
            border: 5px solid #000;
            background: #dcdcdc;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 44px;
          }

          .profile h1 {
            margin: 12px 0 0;
            font-size: 24px;
          }

          .content {
            padding: 20px 22px 30px;
          }

          .section-title-wrap {
            display: flex;
            justify-content: center;
            margin: 8px 0 20px;
          }

          .section-title {
            border: 2px solid #ff00ff;
            border-radius: 999px;
            padding: 8px 22px;
            font-size: 24px;
            font-weight: 700;
          }

          .activities {
            display: grid;
            gap: 14px;
          }

          .activity-card {
            border: 1px solid #2d2d2d;
            border-radius: 12px;
            padding: 14px;
            background: #090909;
            break-inside: avoid;
          }

          .activity-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            flex-wrap: wrap;
          }

          .activity-header h3 {
            margin: 0;
            font-size: 19px;
          }

          .activity-pill {
            display: inline-flex;
            border: 1px solid #ff00ff;
            border-radius: 999px;
            padding: 3px 12px;
            font-size: 13px;
            font-weight: 700;
            white-space: nowrap;
          }

          .activity-date {
            color: #cfd0d1;
            margin: 7px 0 10px;
            font-size: 13px;
          }

          .activity-image {
            width: 100%;
            max-height: 280px;
            object-fit: cover;
            border-radius: 10px;
            border: 1px solid #2f2f2f;
            margin-bottom: 10px;
          }

          .activity-description {
            margin: 0;
            font-size: 15px;
            line-height: 1.5;
            white-space: pre-wrap;
            word-break: break-word;
          }

          .empty-activities {
            text-align: center;
            color: #d7d7d7;
            border: 1px dashed #4b4b4b;
            border-radius: 12px;
            padding: 16px;
          }

          @media print {
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            .page {
              min-height: auto;
            }
          }
        </style>
      </head>
      <body>
        <main class="page">
          <section class="profile">
            ${
              profileImage
                ? `<img class="profile-image" src="${profileImage}" alt="Profiilipilt" />`
                : `<div class="profile-placeholder" aria-label="Profiilipilt"><svg xml> <svg/></div>`
            }
            <h1>${userName}</h1>
          </section>

          <section class="content">
            <div class="section-title-wrap">
              <div class="section-title">Minu ettevotlikud kogemused</div>
            </div>

            <div class="activities">
              ${
                printableActivities.length > 0
                  ? printableActivities.join("")
                  : '<p class="empty-activities">Tegevusi ei leitud.</p>'
              }
            </div>
          </section>
        </main>
      </body>
    </html>
  `;
};
