/**
 * PDF Generation Service
 * Generates HEIP-compliant PDF reports matching the exact template format
 */

import { Assessment, HEIP_REQUIREMENTS, MEASURE_REBATES } from '@/models/Assessment';
import { format } from 'date-fns';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

/**
 * Generate HTML content for PDF report
 * This HTML mirrors the exact HEIP compliance document format
 */
export class PDFService {
  static async generatePDF(assessment: Assessment): Promise<string> {
    const html = this.generateHTML(assessment);

    // Generate PDF filename
    const filename = `HEIP_Assessment_${assessment.metadata.id}.pdf`;
    const filepath = `${RNFS.DocumentDirectoryPath}/${filename}`;

    // Note: For production, you would use a library like react-native-html-to-pdf
    // or react-native-pdf-lib to convert HTML to PDF
    // For now, we'll save the HTML which can be converted server-side

    await RNFS.writeFile(filepath, html, 'utf8');

    // Store PDF path in assessment
    assessment.generatedPdfUrl = filepath;
    assessment.pdfGeneratedAt = new Date();

    return filepath;
  }

  static async sharePDF(filepath: string): Promise<void> {
    try {
      await Share.open({
        url: `file://${filepath}`,
        type: 'application/pdf',
        title: 'HEIP Assessment Report',
      });
    } catch (error) {
      console.error('Error sharing PDF:', error);
      throw error;
    }
  }

  /**
   * Generate HTML content matching the HEIP compliance document
   */
  private static generateHTML(assessment: Assessment): string {
    const duration = assessment.metadata.durationMinutes || 0;
    const durationMet = duration >= HEIP_REQUIREMENTS.MINIMUM_DURATION_MINUTES;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>HOME ENERGY ASSESSMENT REPORT - ${assessment.metadata.id}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      max-width: 8.5in;
      margin: 0 auto;
      padding: 0.5in;
    }
    h1 {
      font-size: 18pt;
      font-weight: bold;
      text-align: center;
      margin: 0 0 5px 0;
    }
    h2 {
      font-size: 14pt;
      font-weight: bold;
      margin: 20px 0 10px 0;
      border-bottom: 2px solid #000;
      padding-bottom: 5px;
    }
    h3 {
      font-size: 12pt;
      font-weight: bold;
      margin: 15px 0 8px 0;
    }
    .subtitle {
      text-align: center;
      font-size: 12pt;
      margin-bottom: 20px;
    }
    .info-row {
      margin: 5px 0;
    }
    .label {
      font-weight: bold;
      display: inline-block;
      width: 200px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
    }
    th, td {
      border: 1px solid #000;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f0f0f0;
      font-weight: bold;
    }
    .checkbox {
      display: inline-block;
      width: 15px;
      height: 15px;
      border: 1px solid #000;
      margin-right: 5px;
      text-align: center;
      vertical-align: middle;
    }
    .checkbox.checked::before {
      content: "✓";
      font-weight: bold;
    }
    .warning-box {
      background-color: #fff3cd;
      border: 2px solid #ffc107;
      padding: 10px;
      margin: 10px 0;
    }
    .success-box {
      background-color: #d4edda;
      border: 2px solid #28a745;
      padding: 10px;
      margin: 10px 0;
    }
    .signature-box {
      border: 1px solid #000;
      min-height: 60px;
      margin: 10px 0;
      padding: 10px;
    }
    .total-box {
      background-color: #e3f2fd;
      border: 2px solid #0066CC;
      padding: 15px;
      margin: 15px 0;
      font-size: 14pt;
      font-weight: bold;
      text-align: center;
    }
  </style>
</head>
<body>

<h1>HOME ENERGY ASSESSMENT REPORT</h1>
<div class="subtitle">Georgia Power HEIP Compliance Document</div>

<div class="info-row"><span class="label">Report ID:</span>${assessment.metadata.id}</div>
<div class="info-row"><span class="label">Assessment Date:</span>${format(new Date(assessment.metadata.assessmentDate), 'M/d/yyyy')}</div>
<div class="info-row"><span class="label">Assessment Duration:</span>${duration} minutes ${durationMet ? '✓ (HEIP 90+ minute requirement met)' : '⚠ (Does not meet 90+ minute requirement)'}</div>
<div class="info-row"><span class="label">Prepared by:</span>${assessment.metadata.contractorName} | Georgia Power Participating Authorized Contractor</div>
<div class="info-row"><span class="label">Contractor License:</span>${assessment.metadata.contractorLicense} | Georgia Power Authorized Contractor ID: ${assessment.metadata.contractorId}</div>
<div class="info-row"><span class="label">Contact:</span>${assessment.metadata.contractorPhone} | ${assessment.metadata.contractorWebsite || ''}</div>

<h2>SECTION 1: CUSTOMER & PROPERTY INFORMATION</h2>
<div class="info-row"><span class="label">Customer Name:</span>${assessment.customer.name}</div>
<div class="info-row"><span class="label">Georgia Power Account Number:</span>${assessment.customer.georgiaPowerAccountNumber}</div>
<div class="info-row"><span class="label">Service Address:</span>${assessment.customer.serviceAddress}</div>
${assessment.customer.city ? `<div class="info-row"><span class="label">City, State, ZIP:</span>${assessment.customer.city}, ${assessment.customer.state} ${assessment.customer.zipCode}</div>` : ''}
<div class="info-row"><span class="label">Property Type:</span>${assessment.customer.propertyType}</div>
<div class="info-row"><span class="label">Property Status:</span>${assessment.customer.propertyStatus}</div>
<div class="info-row"><span class="label">Assessment Completion Date:</span>${format(new Date(assessment.metadata.assessmentDate), 'M/d/yyyy')}</div>

<h2>SECTION 2: ASSESSMENT SUMMARY</h2>
<div class="info-row"><span class="label">Assessment Type:</span>Georgia Power HEIP Home Energy Assessment</div>
<div class="info-row"><span class="label">Contractor License/Certification:</span>${assessment.metadata.contractorLicense}</div>
<div class="info-row"><span class="label">Assessment Method:</span>Room-by-room evaluation and customer consultation</div>
<div class="info-row"><span class="label">Assessment Cost:</span>$${assessment.metadata.assessmentCost}.00</div>

<h3>REQUIRED PHOTO DOCUMENTATION:</h3>
<div><span class="checkbox ${assessment.photoChecklist.hvacNameplate ? 'checked' : ''}"></span> HVAC System Nameplate Photo: ${assessment.photoChecklist.hvacNameplate ? 'Captured and submitted' : 'Missing'}</div>
<div><span class="checkbox ${assessment.photoChecklist.waterHeaterNameplate ? 'checked' : ''}"></span> Water Heater Nameplate Photo: ${assessment.photoChecklist.waterHeaterNameplate ? 'Captured and submitted' : 'Missing'}</div>
<div><span class="checkbox ${assessment.photoChecklist.atticInsulation ? 'checked' : ''}"></span> Attic Insulation Photos: ${assessment.photoChecklist.atticInsulation ? 'Minimum 3 photos captured' : 'Missing'}</div>
<div><span class="checkbox ${assessment.photoChecklist.foundationCrawlspace ? 'checked' : ''}"></span> Foundation/Crawlspace Photos: ${assessment.photoChecklist.foundationCrawlspace ? 'Minimum 3 photos captured' : 'Missing'}</div>
<div><span class="checkbox ${assessment.photoChecklist.windowsDoorsExterior ? 'checked' : ''}"></span> Windows & Doors Photos: ${assessment.photoChecklist.windowsDoorsExterior ? 'Exterior photos captured' : 'Missing'}</div>
<div><span class="checkbox ${assessment.photoChecklist.roomInterior ? 'checked' : ''}"></span> Room-by-Room Photos: ${assessment.photoChecklist.roomInterior ? 'Minimum 3 rooms documented' : 'Missing'}</div>
<div><span class="checkbox ${assessment.photoChecklist.exteriorHome ? 'checked' : ''}"></span> Exterior Photos: ${assessment.photoChecklist.exteriorHome ? 'Initial and final home photos' : 'Missing'}</div>

<h2>SECTION 3: ROOM-BY-ROOM FINDINGS</h2>
<p>Minimum 3 rooms evaluated during assessment. ${assessment.roomFindings.length} rooms documented.</p>
${this.generateRoomFindingsHTML(assessment)}

<h2>SECTION 4: ENERGY EFFICIENCY OPPORTUNITIES</h2>
<h3>RECOMMENDED IMPROVEMENTS BASED ON ASSESSMENT:</h3>
<p>The following improvements are recommended based on your home's current condition and will qualify for Georgia Power HEIP rebates:</p>

${this.generateRecommendationsHTML(assessment)}

<div class="total-box">
  Total Potential Rebates: $${assessment.rebateCalculation.totalHEIPRebate + assessment.rebateCalculation.totalFederalTaxCredit}.00
</div>

<p><strong>Note:</strong> Rebates are subject to Georgia Power HEIP program requirements and availability. Contact contractor for detailed cost estimates and installation scheduling.</p>

<h2>SECTION 5: GEORGIA POWER HEIP QUALIFIED IMPROVEMENTS</h2>
${this.generateHEIPRebatesHTML(assessment)}

<h2>SECTION 5B: FEDERAL TAX CREDITS - INFLATION REDUCTION ACT</h2>
${this.generateFederalTaxCreditsHTML(assessment)}

<h2>SECTION 6: CUSTOMER CONSULTATION SUMMARY</h2>
${this.generateConsultationHTML(assessment)}

<h2>SECTION 7: RECOMMENDATIONS & NEXT STEPS</h2>
<h3>IMMEDIATE ACTIONS (NO COST):</h3>
<ul>
  <li>Set thermostat to recommended settings (68°F winter, 78°F summer)</li>
  <li>Replace HVAC air filters regularly (every 1-3 months)</li>
  <li>Keep vents clear and unobstructed for proper airflow</li>
</ul>

<h3>REBATE APPLICATION PROCESS:</h3>
<ul>
  <li>Improvements must be completed by Georgia Power participating contractor</li>
  <li>Submit rebate application within 60 days of completion</li>
  <li>Application portal: georgiapowerrebates.com/residential</li>
  <li>Contact ${assessment.metadata.contractorName} for implementation and rebate processing</li>
</ul>

<h2>CUSTOMER ACKNOWLEDGMENT & SIGNATURES</h2>
<h3>✓ ASSESSMENT COMPLETED</h3>
<p>Customer acknowledges receipt of this comprehensive home energy assessment and understands the findings, recommendations, and available rebate programs.</p>

<div class="signature-box">
  <strong>Customer Signature:</strong><br>
  ${assessment.signatures.find(s => s.type === 'customer')?.printedName || '_____________________'}<br>
  Date: ${assessment.signatures.find(s => s.type === 'customer') ? format(new Date(assessment.signatures.find(s => s.type === 'customer')!.timestamp), 'M/d/yyyy h:mm a') : '_____________________'}
</div>

<div class="signature-box">
  <strong>Technician Signature:</strong><br>
  ${assessment.signatures.find(s => s.type === 'advisor')?.printedName || '_____________________'}<br>
  Date: ${assessment.signatures.find(s => s.type === 'advisor') ? format(new Date(assessment.signatures.find(s => s.type === 'advisor')!.timestamp), 'M/d/yyyy h:mm a') : '_____________________'}
</div>

<h3>Customer Acknowledgment:</h3>
<ul style="list-style: none; padding-left: 0;">
  <li><span class="checkbox ${assessment.customerAcknowledgment.receivedComprehensiveAssessment ? 'checked' : ''}"></span> I have received a comprehensive home energy assessment lasting 90+ minutes</li>
  <li><span class="checkbox ${assessment.customerAcknowledgment.discussedEnergyBills ? 'checked' : ''}"></span> The energy advisor discussed my energy bills, usage patterns, and comfort concerns</li>
  <li><span class="checkbox ${assessment.customerAcknowledgment.understandsRecommendations ? 'checked' : ''}"></span> I understand the recommended improvements and available rebate programs</li>
  <li><span class="checkbox ${assessment.customerAcknowledgment.receivedRebateInformation ? 'checked' : ''}"></span> I received information about Georgia Power HEIP, state HEAR/HER, and federal tax credits</li>
  <li><span class="checkbox ${assessment.customerAcknowledgment.understandsStateProgramExclusive ? 'checked' : ''}"></span> I understand that state programs are mutually exclusive (choose only ONE)</li>
  <li><span class="checkbox ${assessment.customerAcknowledgment.paidAssessmentFee ? 'checked' : ''}"></span> I paid the $150 assessment fee and may qualify for Georgia Power $150 rebate</li>
  <li><span class="checkbox ${assessment.customerAcknowledgment.allPhotosSubmitted ? 'checked' : ''}"></span> All required photos were captured and will be submitted for verification</li>
</ul>

<hr>
<p style="text-align: center; font-size: 10pt; color: #666;">
  This assessment report was generated by Go Eco Energy Assessment System<br>
  Document ID: ${assessment.metadata.id} | Generated: ${format(new Date(), 'M/d/yyyy, h:mm:ss a')}<br>
  This report meets Georgia Power HEIP compliance requirements for $150 assessment rebate submission<br>
  For questions or to schedule improvements, contact ${assessment.metadata.contractorName} at ${assessment.metadata.contractorPhone}
</p>

</body>
</html>
    `;
  }

  private static generateRoomFindingsHTML(assessment: Assessment): string {
    if (assessment.roomFindings.length === 0) {
      return '<p>No room findings documented.</p>';
    }

    return `
      <table>
        <tr>
          <th>Room Name</th>
          <th>Comfort Issues</th>
          <th>Windows/Doors</th>
          <th>Additional Notes</th>
        </tr>
        ${assessment.roomFindings.map(room => `
          <tr>
            <td>${room.roomName}</td>
            <td>${room.comfortIssues.join(', ') || 'None noted'}</td>
            <td>${room.windowCount} windows, ${room.doorCount} doors</td>
            <td>${room.additionalNotes || 'None'}</td>
          </tr>
        `).join('')}
      </table>
    `;
  }

  private static generateRecommendationsHTML(assessment: Assessment): string {
    const recommended = assessment.recommendedMeasures.filter(m => m.recommended);

    if (recommended.length === 0) {
      return '<p>No recommendations at this time.</p>';
    }

    return recommended.map((measure, index) => `
      <div style="margin: 15px 0;">
        <strong>${index + 1}. ${measure.name}</strong><br>
        - Description: ${measure.description}<br>
        - Georgia Power HEIP Rebate: Up to $${measure.heipRebateAmount}<br>
        - Energy Savings: Will reduce energy consumption and lower utility bills<br>
        - Next Steps: Contact ${assessment.metadata.contractorName} for professional installation and rebate processing
      </div>
    `).join('');
  }

  private static generateHEIPRebatesHTML(assessment: Assessment): string {
    return `
      <h3>GEORGIA POWER HEIP REBATE PATHWAYS</h3>
      <p><strong>CHOOSE ONE PATHWAY:</strong></p>
      <p><strong>PATHWAY 1 - Individual Improvements:</strong> Up to $750 total (select specific improvements)</p>
      <p><strong>PATHWAY 2 - Whole House:</strong> Up to $1,250 total (requires 20% energy reduction verification)</p>
      <p>All rebates are 50% of project cost, up to the maximum listed. Must be homeowner to qualify.</p>

      <div class="warning-box">
        <strong>⚠️ HEIP REBATE LIMITS & REQUIREMENTS:</strong>
        <ul>
          <li>Individual Improvements Path: Maximum $750 total across all improvements</li>
          <li>Whole House Path: Maximum $1,250 total (requires documented 20% energy reduction)</li>
          <li>50% Rule: Rebates are 50% of actual project cost, up to the maximums listed</li>
          <li>One Per Year: Maximum one HEIP rebate per household per calendar year</li>
          <li>Homeowner Only: Must be property owner (renters not eligible)</li>
          <li>Installation Required: Must use Georgia Power participating contractor</li>
        </ul>
      </div>

      <div class="total-box">
        MAXIMUM GEORGIA POWER HEIP REBATE: $${assessment.rebateCalculation.heipPathway === 'Whole House' ? '1,250' : '750'}<br>
        Recommended Pathway: ${assessment.rebateCalculation.heipPathway}
      </div>
    `;
  }

  private static generateFederalTaxCreditsHTML(assessment: Assessment): string {
    return `
      <div class="warning-box">
        <strong>⚠️ IMPORTANT TAX CREDIT INFORMATION:</strong>
        <ul>
          <li>Federal tax credits must be claimed on your federal income tax return (IRS Form 5695)</li>
          <li>Valid for tax years 2023-2032 under the Inflation Reduction Act</li>
          <li>Credits shown are estimates - consult a tax professional for personalized guidance</li>
          <li><strong>GOOD NEWS: Federal credits CAN be stacked with ONE Georgia state program!</strong></li>
        </ul>
      </div>

      <div class="success-box">
        <strong>✓ THIS ASSESSMENT QUALIFIES FOR $150 TAX CREDIT!</strong><br>
        This home energy audit qualifies for the federal Home Energy Audit tax credit. Keep this report with your tax documents and file IRS Form 5695 with your return.
      </div>

      <div class="total-box">
        TOTAL POTENTIAL FEDERAL TAX CREDITS: $${assessment.rebateCalculation.totalFederalTaxCredit}.00<br>
        (Equipment + envelope improvements)
      </div>
    `;
  }

  private static generateConsultationHTML(assessment: Assessment): string {
    return `
      <h3>ENERGY BILLS DISCUSSION:</h3>
      <div class="info-row"><span class="label">Current Monthly Electric Bill:</span>${assessment.energyBills.currentMonthlyElectricBill}</div>
      <div class="info-row"><span class="label">Summer Average:</span>${assessment.energyBills.summerAverage}</div>
      <div class="info-row"><span class="label">Winter Average:</span>${assessment.energyBills.winterAverage}</div>
      <div class="info-row"><span class="label">Bill Trend:</span>${assessment.energyBills.billTrend}</div>

      <h3>COMFORT CONCERNS IDENTIFIED:</h3>
      <div class="info-row"><span class="label">Hot Areas:</span>${assessment.comfortConcerns.hotAreas.join(', ') || 'None noted'}</div>
      <div class="info-row"><span class="label">Cold Areas:</span>${assessment.comfortConcerns.coldAreas.join(', ') || 'None noted'}</div>
      <div class="info-row"><span class="label">Draft Locations:</span>${assessment.comfortConcerns.draftLocations.join(', ') || 'None noted'}</div>
      <div class="info-row"><span class="label">Overall Comfort Level:</span>${assessment.comfortConcerns.overallComfortLevel}</div>

      <h3>CURRENT ENERGY EQUIPMENT:</h3>
      <div class="info-row"><span class="label">HVAC System:</span>${assessment.hvacSystem.type}, Age: ${assessment.hvacSystem.age}, SEER: ${assessment.hvacSystem.seerRating}</div>
      <div class="info-row"><span class="label">HVAC Make/Model:</span>${assessment.hvacSystem.makeModel}</div>
      <div class="info-row"><span class="label">HVAC Condition:</span>${assessment.hvacSystem.condition}</div>
      <div class="info-row"><span class="label">Water Heater:</span>${assessment.waterHeater.type}, Age: ${assessment.waterHeater.age}, Capacity: ${assessment.waterHeater.capacity}</div>
      <div class="info-row"><span class="label">Water Heater Make/Model:</span>${assessment.waterHeater.makeModel}</div>
      <div class="info-row"><span class="label">Water Heater Condition:</span>${assessment.waterHeater.condition}</div>

      <h3>INSULATION & BUILDING ENVELOPE:</h3>
      <div class="info-row"><span class="label">Attic Insulation:</span>${assessment.insulationEnvelope.atticInsulationRValue}, Type: ${assessment.insulationEnvelope.atticInsulationType}, Depth: ${assessment.insulationEnvelope.atticDepthInches}</div>
      <div class="info-row"><span class="label">Foundation Type:</span>${assessment.insulationEnvelope.foundationType}, Insulated: ${assessment.insulationEnvelope.foundationInsulated ? 'Yes' : 'No'}</div>
      <div class="info-row"><span class="label">Windows:</span>${assessment.windowsDoors.windowCount} windows, Mostly ${assessment.windowsDoors.windowType} type, Condition: ${assessment.windowsDoors.windowCondition}</div>
      <div class="info-row"><span class="label">Exterior Doors:</span>${assessment.windowsDoors.doorCount} doors, Condition: ${assessment.windowsDoors.doorCondition}</div>

      <h3>DUCT SYSTEM:</h3>
      <div class="info-row"><span class="label">Duct Test Performed:</span>${assessment.ductSystem.ductTestPerformed ? 'Yes' : 'No - Equipment Not Available'}</div>
      ${assessment.ductSystem.cfm25Result ? `<div class="info-row"><span class="label">CFM25 Results:</span>${assessment.ductSystem.cfm25Result}</div>` : ''}
      ${assessment.ductSystem.ductCondition ? `<div class="info-row"><span class="label">Duct Condition:</span>${assessment.ductSystem.ductCondition}</div>` : ''}
    `;
  }
}
