export const generateReport = (sections, auditData, restaurantName, auditorName, auditDate, auditTime) => {
  const reportWindow = window.open('', '_blank');

  const evaluated = Object.values(auditData).filter(s => s.status !== '').length;
  const passed = Object.values(auditData).filter(s => s.status === 'pass').length;
  const total = sections.length;
  const passRate = evaluated > 0 ? Math.round((passed / evaluated) * 100) : 0;

  const reportHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Chili's Sticker Audit Report - ${restaurantName}</title>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.2/jspdf.umd.min.js"></script>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
        .action-buttons {
          position: fixed;
          top: 20px;
          right: 20px;
          display: flex;
          gap: 10px;
          z-index: 1000;
        }
        .btn {
          padding: 15px 30px;
          border: none;
          border-radius: 8px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          color: white;
        }
        .btn-print {
          background: #E4002B;
        }
        .btn-print:hover {
          background: #c00024;
        }
        .btn-download {
          background: #4CAF50;
        }
        .btn-download:hover {
          background: #45a049;
        }
        .container { max-width: 1200px; margin: 0 auto; background: white; }
        .header { background: #E4002B; color: white; padding: 40px; text-center; }
        .header h1 { font-size: 36px; margin-bottom: 10px; }
        .header p { font-size: 18px; opacity: 0.9; }
        .info-section { background: #f9f9f9; padding: 30px; border-bottom: 3px solid #E4002B; }
        .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
        .info-item { background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .info-label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
        .info-value { font-size: 18px; color: #333; }
        .progress-section { padding: 30px; background: #e3f2fd; }
        .progress-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 20px; }
        .progress-card { background: white; padding: 20px; text-center; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .progress-value { font-size: 36px; font-weight: bold; color: #E4002B; }
        .progress-label { font-size: 14px; color: #666; margin-top: 5px; }
        .section { page-break-inside: avoid; margin: 30px; border: 2px solid #ddd; border-radius: 12px; overflow: hidden; margin-bottom: 30px; }
        .section-header { background: #f5f5f5; padding: 20px; border-bottom: 2px solid #E4002B; }
        .section-title { font-size: 24px; font-weight: bold; color: #333; margin-bottom: 10px; }
        .section-status { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 14px; }
        .status-pass { background: #4caf50; color: white; }
        .status-fail { background: #f44336; color: white; }
        .status-pending { background: #9e9e9e; color: white; }
        .section-body { padding: 20px; }
        .reference-image { text-align: center; margin: 20px 0; }
        .reference-image img { max-width: 100%; height: auto; border: 2px solid #ddd; border-radius: 8px; }
        .reference-image p { margin-top: 10px; font-style: italic; color: #666; }
        .checklist { margin: 20px 0; }
        .checklist-item { padding: 12px; border-bottom: 1px solid #eee; display: flex; align-items: center; }
        .checklist-item:last-child { border-bottom: none; }
        .check-icon { color: #4caf50; margin-right: 10px; font-weight: bold; }
        .uncheck-icon { color: #ccc; margin-right: 10px; }
        .dsi-number { color: #666; font-size: 12px; margin-left: 10px; }
        .notes-section { background: #fffde7; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .notes-title { font-weight: bold; margin-bottom: 10px; color: #666; }
        .photos-section { margin: 20px 0; }
        .photos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .photo-item { border: 2px solid #ddd; border-radius: 8px; overflow: hidden; }
        .photo-item img { width: 100%; height: auto; display: block; }
        .footer { background: #333; color: white; padding: 20px; text-center; margin-top: 40px; }
        @media print {
          .action-buttons { display: none !important; }
          .section { page-break-inside: avoid; }
          #instructions { display: none; }
          body { background: white; }
        }
      </style>
    </head>
    <body>
      <div id="action-buttons" class="action-buttons">
        <button class="btn btn-print" onclick="window.print()">📄 Save as PDF</button>
      </div>
      <div id="instructions" style="background: #fff3cd; padding: 15px; margin: 20px; border-radius: 8px; text-align: center; border: 2px solid #ffc107;">
        <strong>📱 Mobile Users:</strong> Tap "Save as PDF" button, then select "Save to Drive" or "Download as PDF" from print menu.
      </div>

      <div id="report-container" class="container">
        <div class="header">
          <h1>🌶️ Chili's Sticker Placement Audit Report</h1>
          <p>F26 Q2 - 50 Years Edition</p>
        </div>

        <div class="info-section">
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Restaurant</div>
              <div class="info-value">${restaurantName || 'N/A'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Auditor</div>
              <div class="info-value">${auditorName || 'N/A'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Date</div>
              <div class="info-value">${auditDate || 'N/A'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Time</div>
              <div class="info-value">${auditTime || 'N/A'}</div>
            </div>
          </div>
        </div>

        <div class="progress-section">
          <h2 style="margin-bottom: 10px;">Audit Summary</h2>
          <div class="progress-grid">
            <div class="progress-card">
              <div class="progress-value">${evaluated}</div>
              <div class="progress-label">Sections Evaluated</div>
            </div>
            <div class="progress-card">
              <div class="progress-value">${passed}</div>
              <div class="progress-label">Sections Passed</div>
            </div>
            <div class="progress-card">
              <div class="progress-value">${total}</div>
              <div class="progress-label">Total Sections</div>
            </div>
            <div class="progress-card">
              <div class="progress-value">${passRate}%</div>
              <div class="progress-label">Pass Rate</div>
            </div>
          </div>
        </div>

        ${sections.map(section => {
          const data = auditData[section.id];
          const statusClass = data.status === 'pass' ? 'status-pass' : data.status === 'fail' ? 'status-fail' : 'status-pending';
          const statusText = data.status === 'pass' ? 'PASS ✓' : data.status === 'fail' ? 'FAIL ✗' : 'NOT EVALUATED';

          return `
            <div class="section">
              <div class="section-header">
                <div class="section-title">${section.title}</div>
                <span class="section-status ${statusClass}">${statusText}</span>
              </div>
              <div class="section-body">
                <div class="reference-image">
                  <img src="${window.location.origin}/images/${section.id}-reference.png" alt="${section.title} Reference" onerror="this.style.display='none'" crossorigin="anonymous"/>
                  <p>Reference Image</p>
                </div>

                <div class="checklist">
                  <h3 style="margin-bottom: 15px; color: #666;">Checklist Items</h3>
                  ${section.items.map((item, idx) => `
                    <div class="checklist-item">
                      <span class="${data.checkedItems.includes(idx) ? 'check-icon' : 'uncheck-icon'}">
                        ${data.checkedItems.includes(idx) ? '✓' : '○'}
                      </span>
                      <span>${item.text}</span>
                      ${item.dsi ? `<span class="dsi-number">DSI: ${item.dsi}</span>` : ''}
                    </div>
                  `).join('')}
                </div>

                ${data.notes ? `
                  <div class="notes-section">
                    <div class="notes-title">📝 Notes:</div>
                    <div>${data.notes}</div>
                  </div>
                ` : ''}

                ${data.photos && data.photos.length > 0 ? `
                  <div class="photos-section">
                    <h3 style="margin-bottom: 15px; color: #666;">📸 Verification Photos (${data.photos.length})</h3>
                    <div class="photos-grid">
                      ${data.photos.map(photo => `
                        <div class="photo-item">
                          <img src="${photo}" alt="Verification photo" crossorigin="anonymous"/>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>
          `;
        }).join('')}

        <div class="footer">
          <p>Generated on ${new Date().toLocaleString()}</p>
          <p style="margin-top: 10px;">Chili's Sticker Placement Audit System</p>
        </div>
      </div>

      <script>
        function downloadHTML() {
    </body>
    </html>
  `;

  reportWindow.document.write(reportHTML);
  reportWindow.document.close();
};
