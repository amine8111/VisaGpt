import type { SchengenFormData } from './schengenFormConfig'

export function generateSchengenPDF(formData: SchengenFormData, userName: string = 'Applicant'): string {
  const pageWidth = 595.28
  const pageHeight = 841.89
  const margin = 20
  const contentWidth = pageWidth - (margin * 2)
  
  let yPos = margin
  
  const escapeHtml = (text: string): string => {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '___/___/______'
    const date = new Date(dateStr)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const drawField = (
    label: string,
    value: string,
    x: number,
    y: number,
    width: number,
    isSmall: boolean = false
  ): number => {
    const lineHeight = 8
    const pdf = (window as any).pdfContent
    
    if (pdf) {
      pdf.setFontSize(isSmall ? 7 : 9)
      pdf.setFont('helvetica')
      pdf.text(label, x, y)
      pdf.setDrawColor(180)
      pdf.rect(x, y + 2, width, 12)
      if (value) {
        pdf.text(value.substring(0, isSmall ? 30 : 40), x + 2, y + 9)
      }
    }
    
    return y + 16
  }

  const generateHTML = (): string => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Schengen Visa Application Form</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Arial&family=Noto+Sans+Arabic&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: Arial, sans-serif;
      font-size: 11px;
      line-height: 1.3;
      color: #000;
      background: #fff;
    }
    
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 15mm;
      margin: 0 auto;
      background: #fff;
    }
    
    @media print {
      .page {
        width: 100%;
        padding: 10mm;
      }
      .no-print { display: none !important; }
    }
    
    .header {
      background: #003399;
      color: #fff;
      padding: 10px 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .header h1 {
      font-size: 14px;
      font-weight: bold;
    }
    
    .header .subtitle {
      font-size: 10px;
    }
    
    .photo-box {
      width: 35mm;
      height: 45mm;
      border: 1px solid #000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8px;
      text-align: center;
      color: #666;
    }
    
    .section {
      border: 1px solid #000;
      margin-bottom: 8px;
      page-break-inside: avoid;
    }
    
    .section-header {
      background: #003399;
      color: #fff;
      padding: 4px 8px;
      font-weight: bold;
      font-size: 10px;
    }
    
    .section-content {
      padding: 6px 8px;
    }
    
    .field-row {
      display: flex;
      margin-bottom: 4px;
      align-items: flex-start;
    }
    
    .field {
      flex: 1;
      margin-right: 5px;
    }
    
    .field.half {
      flex: 0 0 48%;
    }
    
    .field.third {
      flex: 0 0 31%;
    }
    
    .field.small {
      flex: 0 0 15%;
    }
    
    .field-label {
      font-size: 9px;
      font-weight: bold;
      margin-bottom: 2px;
      color: #333;
    }
    
    .field-input {
      border: 1px solid #000;
      padding: 4px 6px;
      min-height: 20px;
      font-size: 10px;
      background: #fff;
    }
    
    .field-input.has-value {
      background: #f5f5f5;
    }
    
    .checkbox-group {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .checkbox-item {
      display: flex;
      align-items: center;
      font-size: 9px;
    }
    
    .checkbox-item input[type="checkbox"] {
      margin-right: 3px;
    }
    
    .checkbox-box {
      width: 12px;
      height: 12px;
      border: 1px solid #000;
      margin-right: 4px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: bold;
    }
    
    .checkbox-box.checked::after {
      content: "✓";
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9px;
    }
    
    table th, table td {
      border: 1px solid #000;
      padding: 4px;
      text-align: left;
    }
    
    table th {
      background: #e6e6e6;
      font-weight: bold;
    }
    
    .signature-section {
      margin-top: 20px;
      border: 1px solid #000;
      padding: 10px;
    }
    
    .footer {
      margin-top: 20px;
      text-align: center;
      font-size: 8px;
      color: #666;
    }
    
    .btn {
      background: #003399;
      color: #fff;
      border: none;
      padding: 10px 20px;
      font-size: 12px;
      cursor: pointer;
      border-radius: 4px;
      margin: 5px;
    }
    
    .btn:hover {
      background: #002266;
    }
    
    .no-print {
      text-align: center;
      padding: 15px;
      background: #f0f0f0;
      margin-bottom: 15px;
    }
  </style>
</head>
<body>
  <div class="no-print">
    <button class="btn" onclick="window.print()">🖨️ Print / Print Form</button>
    <button class="btn" onclick="downloadPDF()">📄 Download PDF</button>
  </div>
  
  <div class="page" id="formContent">
    <div class="header">
      <div>
        <h1>SCHENGEN VISA APPLICATION FORM</h1>
        <div class="subtitle">ANNEX I - Harmonised application form (Regulation (EC) No 810/2009)</div>
      </div>
      <div style="text-align: right; font-size: 9px;">
        <div>For official use</div>
        <div>Stamp of consulate</div>
      </div>
    </div>
    
    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
      <div class="field" style="flex: 1;">
        <div class="field-label">21. Family links with EU/EEA citizen</div>
        <div class="checkbox-group">
          <label class="checkbox-item"><span class="checkbox-box ${formData.hasEUFamilyRelation ? 'checked' : ''}"></span>spouse</label>
          <label class="checkbox-item"><span class="checkbox-box ${formData.euRelationType === 'child' ? 'checked' : ''}"></span>child</label>
          <label class="checkbox-item"><span class="checkbox-box ${formData.euRelationType === 'grandchild' ? 'checked' : ''}"></span>grandchild</label>
          <label class="checkbox-item"><span class="checkbox-box ${formData.euRelationType === 'ascendant' ? 'checked' : ''}"></span>dependent ascendant</label>
          <label class="checkbox-item"><span class="checkbox-box ${formData.euRelationType === 'other' ? 'checked' : ''}"></span>other</label>
        </div>
      </div>
      <div class="photo-box">
        <div>LAPTOP PHOTO<br>(35x45 mm)<br><br>Recent frontal view<br>with neutral background</div>
      </div>
    </div>
    
    <!-- Section 1: Personal Details -->
    <div class="section">
      <div class="section-header">SECTION 1: Personal Particulars (Informations personnelles)</div>
      <div class="section-content">
        <div class="field-row">
          <div class="field">
            <div class="field-label">1. Surname (Family name) *</div>
            <div class="field-input ${formData.surname ? 'has-value' : ''}">${formData.surname || ''}</div>
          </div>
          <div class="field">
            <div class="field-label">2. Surname at birth (if different)</div>
            <div class="field-input ${formData.surnameBorn ? 'has-value' : ''}">${formData.surnameBorn || ''}</div>
          </div>
        </div>
        
        <div class="field-row">
          <div class="field" style="flex: 2;">
            <div class="field-label">3. Given names (First name(s)) *</div>
            <div class="field-input ${formData.givenNames ? 'has-value' : ''}">${formData.givenNames || ''}</div>
          </div>
          <div class="field" style="flex: 2;">
            <div class="field-label">4. Given names at birth (if different)</div>
            <div class="field-input ${formData.givenNamesBorn ? 'has-value' : ''}">${formData.givenNamesBorn || ''}</div>
          </div>
        </div>
        
        <div class="field-row">
          <div class="field half">
            <div class="field-label">5. Date of birth (day-month-year) *</div>
            <div class="field-input ${formData.dateOfBirth ? 'has-value' : ''}">${formatDate(formData.dateOfBirth)}</div>
          </div>
          <div class="field half">
            <div class="field-label">6. Place of birth *</div>
            <div class="field-input ${formData.placeOfBirth ? 'has-value' : ''}">${formData.placeOfBirth || ''}</div>
          </div>
        </div>
        
        <div class="field-row">
          <div class="field half">
            <div class="field-label">7. Country of birth *</div>
            <div class="field-input ${formData.countryOfBirth ? 'has-value' : ''}">${formData.countryOfBirth === 'DZ' ? 'ALGERIA' : formData.countryOfBirth || ''}</div>
          </div>
          <div class="field half">
            <div class="field-label">8. Current nationality *</div>
            <div class="field-input ${formData.nationality ? 'has-value' : ''}">${formData.nationality === 'DZ' ? 'ALGERIAN' : formData.nationality || ''}</div>
          </div>
        </div>
        
        <div class="field-row">
          <div class="field">
            <div class="field-label">9. Sex *</div>
            <div class="checkbox-group">
              <label class="checkbox-item"><span class="checkbox-box ${formData.sex === 'M' ? 'checked' : ''}"></span>Male</label>
              <label class="checkbox-item"><span class="checkbox-box ${formData.sex === 'F' ? 'checked' : ''}"></span>Female</label>
            </div>
          </div>
          <div class="field" style="flex: 2;">
            <div class="field-label">10. Civil status *</div>
            <div class="checkbox-group">
              <label class="checkbox-item"><span class="checkbox-box ${formData.civilStatus === 'single' ? 'checked' : ''}"></span>Single</label>
              <label class="checkbox-item"><span class="checkbox-box ${formData.civilStatus === 'married' ? 'checked' : ''}"></span>Married</label>
              <label class="checkbox-item"><span class="checkbox-box ${formData.civilStatus === 'widowed' ? 'checked' : ''}"></span>Widowed</label>
              <label class="checkbox-item"><span class="checkbox-box ${formData.civilStatus === 'divorced' ? 'checked' : ''}"></span>Divorced</label>
              <label class="checkbox-item"><span class="checkbox-box ${formData.civilStatus === 'separated' ? 'checked' : ''}"></span>Separated</label>
              <label class="checkbox-item"><span class="checkbox-box ${formData.civilStatus === 'other' ? 'checked' : ''}"></span>Other</label>
            </div>
          </div>
        </div>
        
        <div class="field-row">
          <div class="field half">
            <div class="field-label">10a. For minors: Surname, given names of parent/legal guardian</div>
            <div class="field-input ${formData.parentSurname ? 'has-value' : ''}">${formData.parentSurname || ''} ${formData.parentGivenNames || ''}</div>
          </div>
          <div class="field half">
            <div class="field-label">11. National ID number</div>
            <div class="field-input ${formData.nationalId ? 'has-value' : ''}">${formData.nationalId || ''}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Section 2: Travel Document -->
    <div class="section">
      <div class="section-header">SECTION 2: Travel Document (Document de voyage)</div>
      <div class="section-content">
        <div class="field-row">
          <div class="field" style="flex: 2;">
            <div class="field-label">12. Type of travel document *</div>
            <div class="checkbox-group">
              <label class="checkbox-item"><span class="checkbox-box ${formData.travelDocType === 'ordinary' ? 'checked' : ''}"></span>Ordinary Passport</label>
              <label class="checkbox-item"><span class="checkbox-box ${formData.travelDocType === 'diplomatic' ? 'checked' : ''}"></span>Diplomatic</label>
              <label class="checkbox-item"><span class="checkbox-box ${formData.travelDocType === 'service' ? 'checked' : ''}"></span>Service</label>
              <label class="checkbox-item"><span class="checkbox-box ${formData.travelDocType === 'other' ? 'checked' : ''}"></span>Other</label>
            </div>
          </div>
          <div class="field half">
            <div class="field-label">16. Children included in travel document</div>
            <div class="checkbox-group">
              <label class="checkbox-item"><span class="checkbox-box ${formData.childrenInPassport ? 'checked' : ''}"></span>Yes</label>
              <label class="checkbox-item"><span class="checkbox-box ${!formData.childrenInPassport ? 'checked' : ''}"></span>No</label>
            </div>
          </div>
        </div>
        
        <div class="field-row">
          <div class="field">
            <div class="field-label">13. Travel document number *</div>
            <div class="field-input ${formData.passportNumber ? 'has-value' : ''}">${formData.passportNumber || ''}</div>
          </div>
          <div class="field">
            <div class="field-label">14. Date of issue *</div>
            <div class="field-input ${formData.passportIssueDate ? 'has-value' : ''}">${formatDate(formData.passportIssueDate)}</div>
          </div>
          <div class="field">
            <div class="field-label">15. Date of expiry *</div>
            <div class="field-input ${formData.passportExpiryDate ? 'has-value' : ''}">${formatDate(formData.passportExpiryDate)}</div>
          </div>
        </div>
        
        <div class="field-row">
          <div class="field">
            <div class="field-label">Issued by (authority)</div>
            <div class="field-input ${formData.issuingAuthority ? 'has-value' : ''}">${formData.issuingAuthority || ''}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Section 3: Contact Details -->
    <div class="section">
      <div class="section-header">SECTION 3: Applicant's Contact Details (Coordonnées du demandeur)</div>
      <div class="section-content">
        <div class="field-row">
          <div class="field" style="flex: 2;">
            <div class="field-label">17. Home address and e-mail address *</div>
            <div class="field-input ${formData.homeAddress ? 'has-value' : ''}">${formData.homeAddress || ''}</div>
          </div>
          <div class="field half">
            <div class="field-label">18. Telephone number(s) *</div>
            <div class="field-input ${formData.telephone ? 'has-value' : ''}">${formData.telephone || ''}</div>
          </div>
        </div>
        
        <div class="field-row">
          <div class="field half">
            <div class="field-label">19. E-mail address *</div>
            <div class="field-input ${formData.email ? 'has-value' : ''}">${formData.email || ''}</div>
          </div>
          <div class="field half">
            <div class="field-label">20. Country of residence (if different)</div>
            <div class="field-input ${formData.countryOfResidence ? 'has-value' : ''}">${formData.countryOfResidence === 'DZ' ? 'ALGERIA' : formData.countryOfResidence || ''}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Section 4: Purpose -->
    <div class="section">
      <div class="section-header">SECTION 4: Main Purpose of Journey / Purpose and Details of Travel (Objet du voyage)</div>
      <div class="section-content">
        <div class="field-row">
          <div class="field" style="flex: 2;">
            <div class="field-label">22. Main purpose(s) of journey *</div>
            <div class="checkbox-group">
              <label class="checkbox-item"><span class="checkbox-box ${formData.purpose === 'tourism' ? 'checked' : ''}"></span>Tourism</label>
              <label class="checkbox-item"><span class="checkbox-box ${formData.purpose === 'business' ? 'checked' : ''}"></span>Business</label>
              <label class="checkbox-item"><span class="checkbox-box ${formData.purpose === 'family' ? 'checked' : ''}"></span>Family visit</label>
              <label class="checkbox-item"><span class="checkbox-box ${formData.purpose === 'cultural' ? 'checked' : ''}"></span>Cultural</label>
              <label class="checkbox-item"><span class="checkbox-box ${formData.purpose === 'transit' ? 'checked' : ''}"></span>Transit</label>
              <label class="checkbox-item"><span class="checkbox-box ${formData.purpose === 'sports' ? 'checked' : ''}"></span>Sports</label>
              <label class="checkbox-item"><span class="checkbox-box ${formData.purpose === 'other' ? 'checked' : ''}"></span>Official visit</label>
              <label class="checkbox-item"><span class="checkbox-box ${formData.purpose === 'other' ? 'checked' : ''}"></span>Other: ${formData.purposeOther || ''}</label>
            </div>
          </div>
        </div>
        
        <div class="field-row">
          <div class="field half">
            <div class="field-label">23. Member State of main destination *</div>
            <div class="field-input ${formData.destinationCountry ? 'has-value' : ''}">${formData.destinationCountry || ''}</div>
          </div>
          <div class="field half">
            <div class="field-label">24. First port of entry into Schengen area *</div>
            <div class="field-input ${formData.firstEntryPoint ? 'has-value' : ''}">${formData.firstEntryPoint || ''}</div>
          </div>
        </div>
        
        <div class="field-row">
          <div class="field">
            <div class="field-label">25. Number of entries requested *</div>
            <div class="checkbox-group">
              <label class="checkbox-item"><span class="checkbox-box ${formData.entriesRequested === 'single' ? 'checked' : ''}"></span>1 (Single entry)</label>
              <label class="checkbox-item"><span class="checkbox-box ${formData.entriesRequested === 'double' ? 'checked' : ''}"></span>2 (Double entry)</label>
              <label class="checkbox-item"><span class="checkbox-box ${formData.entriesRequested === 'multiple' ? 'checked' : ''}"></span>Multiple entries</label>
            </div>
          </div>
          <div class="field half">
            <div class="field-label">26. Intended duration of stay (days) *</div>
            <div class="field-input ${formData.durationOfStay ? 'has-value' : ''}">${formData.durationOfStay || ''}</div>
          </div>
        </div>
        
        <div class="field-row">
          <div class="field half">
            <div class="field-label">27. Intended date of arrival *</div>
            <div class="field-input ${formData.intendedEntryDate ? 'has-value' : ''}">${formatDate(formData.intendedEntryDate)}</div>
          </div>
          <div class="field half">
            <div class="field-label">28. Intended date of departure *</div>
            <div class="field-input ${formData.intendedExitDate ? 'has-value' : ''}">${formatDate(formData.intendedExitDate)}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Section 5: Previous Schengen Visas -->
    <div class="section">
      <div class="section-header">SECTION 5: Schengen Visas Issued During Past 5 Years / Fingerprints</div>
      <div class="section-content">
        <div class="field-row">
          <div class="field half">
            <div class="field-label">29. Have you been issued Schengen visa within the past 5 years?</div>
            <div class="checkbox-group">
              <label class="checkbox-item"><span class="checkbox-box ${formData.previousSchengenVisa ? 'checked' : ''}"></span>Yes</label>
              <label class="checkbox-item"><span class="checkbox-box ${!formData.previousSchengenVisa ? 'checked' : ''}"></span>No</label>
            </div>
          </div>
          <div class="field half">
            <div class="field-label">30. Were your fingerprints collected previously for a Schengen visa?</div>
            <div class="checkbox-group">
              <label class="checkbox-item"><span class="checkbox-box ${formData.fingerprintsCollected ? 'checked' : ''}"></span>Yes</label>
              <label class="checkbox-item"><span class="checkbox-box ${!formData.fingerprintsCollected ? 'checked' : ''}"></span>No</label>
            </div>
          </div>
        </div>
        
        <div class="field-row">
          <div class="field">
            <div class="field-label">If yes, please indicate the Schengen visa number (if known):</div>
            <div class="field-input">${formData.previousVisaDetails || ''}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Section 6: Host Information -->
    <div class="section">
      <div class="section-header">SECTION 6: Inviting Person / Host Information (Informations sur l'hôte)</div>
      <div class="section-content">
        <div class="field-row">
          <div class="field" style="flex: 2;">
            <div class="field-label">32. Surname and first name of the inviting person(s) / company *</div>
            <div class="field-input ${formData.hostName ? 'has-value' : ''}">${formData.hostName || ''}</div>
          </div>
          <div class="field half">
            <div class="field-label">36. Contact person in company</div>
            <div class="field-input">${formData.hostContactPerson || ''}</div>
          </div>
        </div>
        
        <div class="field-row">
          <div class="field" style="flex: 2;">
            <div class="field-label">33. Address and telephone number of inviting person(s) / company *</div>
            <div class="field-input ${formData.hostAddress ? 'has-value' : ''}">${formData.hostAddress || ''}</div>
          </div>
          <div class="field half">
            <div class="field-label">34. E-mail</div>
            <div class="field-input">${formData.hostEmail || ''}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Section 7: Employment -->
    <div class="section">
      <div class="section-header">SECTION 7: Information on Employment / Professional Activity (Informations sur l'activité professionnelle)</div>
      <div class="section-content">
        <div class="field-row">
          <div class="field half">
            <div class="field-label">41. Current occupation *</div>
            <div class="field-input ${formData.occupation ? 'has-value' : ''}">${formData.occupation || ''}</div>
          </div>
          <div class="field half">
            <div class="field-label">For students: Name of school/university</div>
            <div class="field-input">${formData.schoolName || ''}</div>
          </div>
        </div>
        
        <div class="field-row">
          <div class="field" style="flex: 2;">
            <div class="field-label">42. Employer name, address and telephone number. For students: school/university name and address *</div>
            <div class="field-input ${formData.employerName ? 'has-value' : ''}">${formData.employerName || ''} ${formData.employerAddress || ''}</div>
          </div>
          <div class="field half">
            <div class="field-label">43. Telephone</div>
            <div class="field-input">${formData.employerTelephone || ''}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Section 8: Means of Subsistence -->
    <div class="section">
      <div class="section-header">SECTION 8: Means of Subsistence During Stay (Moyens d'existence)</div>
      <div class="section-content">
        <div class="field-row">
          <div class="field">
            <div class="field-label">45. Means of subsistence *</div>
            <div class="checkbox-group" style="flex-wrap: wrap;">
              <label class="checkbox-item"><span class="checkbox-box ${formData.meansCash ? 'checked' : ''}"></span>Cash</label>
              <label class="checkbox-item"><span class="checkbox-box ${formData.meansCreditCards ? 'checked' : ''}"></span>Credit cards</label>
              <label class="checkbox-item"><span class="checkbox-box ${formData.meansTravellersCheques ? 'checked' : ''}"></span> Traveller's cheques</label>
              <label class="checkbox-item"><span class="checkbox-box ${formData.sponsorshipArranged ? 'checked' : ''}"></span>Sponsorship/guarantee</label>
              <label class="checkbox-item"><span class="checkbox-box ${formData.accommodationType === 'hotel' ? 'checked' : ''}"></span>Accommodation paid</label>
            </div>
          </div>
        </div>
        
        <div class="field-row">
          <div class="field">
            <div class="field-label">If cash: Amount in EUR</div>
            <div class="field-input">${formData.meansCash || ''}</div>
          </div>
          <div class="field">
            <div class="field-label">Credit card holder</div>
            <div class="field-input">${formData.meansCreditCards || ''}</div>
          </div>
          <div class="field">
            <div class="field-label">46. Has a sponsorship or private accommodation been arranged?</div>
            <div class="checkbox-group">
              <label class="checkbox-item"><span class="checkbox-box ${formData.sponsorshipArranged ? 'checked' : ''}"></span>Yes</label>
              <label class="checkbox-item"><span class="checkbox-box ${!formData.sponsorshipArranged ? 'checked' : ''}"></span>No</label>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Section 9: Travel Insurance -->
    <div class="section">
      <div class="section-header">SECTION 9: Travel Medical Insurance (Assurance maladie-voyage)</div>
      <div class="section-content">
        <div class="field-row">
          <div class="field">
            <div class="field-label">48. Travel medical insurance *</div>
            <div class="checkbox-group">
              <label class="checkbox-item"><span class="checkbox-box ${formData.hasTravelInsurance ? 'checked' : ''}"></span>Yes</label>
              <label class="checkbox-item"><span class="checkbox-box ${!formData.hasTravelInsurance ? 'checked' : ''}"></span>No</label>
            </div>
          </div>
          <div class="field half">
            <div class="field-label">49. Insurance company</div>
            <div class="field-input">${formData.insuranceCompany || ''}</div>
          </div>
          <div class="field half">
            <div class="field-label">50. Policy number</div>
            <div class="field-input">${formData.policyNumber || ''}</div>
          </div>
        </div>
        
        <div class="field-row">
          <div class="field half">
            <div class="field-label">51. Coverage (minimum €30,000)</div>
            <div class="field-input">${formData.insuranceCoverage || ''}</div>
          </div>
          <div class="field half">
            <div class="field-label">52. Valid for</div>
            <div class="field-input">${formData.insuranceValidFor || 'Schengen States'}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Section 10: Additional Information -->
    <div class="section">
      <div class="section-header">SECTION 10: Additional Information / Remarks</div>
      <div class="section-content">
        <div class="field-row">
          <div class="field half">
            <div class="field-label">53. Accommodation</div>
            <div class="checkbox-group">
              <label class="checkbox-item"><span class="checkbox-box ${formData.accommodationType === 'hotel' ? 'checked' : ''}"></span>Hotel</label>
              <label class="checkbox-item"><span class="checkbox-box ${formData.accommodationType === 'private' ? 'checked' : ''}"></span>Private</label>
              <label class="checkbox-item"><span class="checkbox-box ${formData.accommodationType === 'other' ? 'checked' : ''}"></span>Other</label>
            </div>
          </div>
          <div class="field half">
            <div class="field-label">54. Previous refusals / deportations</div>
            <div class="checkbox-group">
              <label class="checkbox-item">Have you ever been refused a visa? <span class="checkbox-box ${formData.previousRefusal ? 'checked' : ''}"></span>Yes <span class="checkbox-box ${!formData.previousRefusal ? 'checked' : ''}"></span>No</label>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Signature Section -->
    <div class="signature-section">
      <p style="font-size: 9px; margin-bottom: 10px;">
        <strong>REMINDER:</strong> I am aware that the visa fee is not refunded if the visa is refused.
        I confirm that all information provided is accurate and complete.
      </p>
      
      <div class="field-row">
        <div class="field half">
          <div class="field-label">Date *</div>
          <div class="field-input">${formData.applicationDate || formatDate(new Date().toISOString())}</div>
        </div>
        <div class="field half">
          <div class="field-label">53. Signature *</div>
          <div style="border-bottom: 1px solid #000; height: 30px; margin-top: 5px;">
            ${formData.applicantSignature || ''}
          </div>
        </div>
      </div>
      
      <p style="font-size: 8px; margin-top: 10px; color: #666;">
        * Fields marked with asterisk are mandatory. Incomplete applications will not be accepted.
      </p>
    </div>
    
    <div class="footer">
      <p>Generated by <strong>VisaGPT</strong> - AI-Powered Visa Assistance | ${new Date().toLocaleDateString()}</p>
    </div>
  </div>
  
  <script>
    function downloadPDF() {
      window.print();
    }
  </script>
</body>
</html>
    `
  }

  return generateHTML()
}

export function openSchengenFormPDF(formData: SchengenFormData, userName: string = 'Applicant'): void {
  const html = generateSchengenPDF(formData, userName)
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const newWindow = window.open(url, '_blank')
  
  if (newWindow) {
    newWindow.focus()
  }
}

export function autoFillFromProfile(formData: Partial<SchengenFormData>, profile: any): Partial<SchengenFormData> {
  return {
    ...formData,
    givenNames: profile.fullName?.split(' ').slice(0, -1).join(' ') || '',
    surname: profile.fullName?.split(' ').pop() || '',
    dateOfBirth: profile.dateOfBirth || '',
    placeOfBirth: profile.placeOfBirth || '',
    nationality: profile.nationality === 'Algeria' ? 'DZ' : profile.nationality,
    countryOfBirth: profile.nationality === 'Algeria' ? 'DZ' : profile.nationality,
    passportNumber: profile.passportNumber || '',
    passportIssueDate: profile.passportIssueDate || '',
    passportExpiryDate: profile.passportExpiryDate || '',
    issuingAuthority: profile.passportIssuingAuthority || '',
    civilStatus: profile.maritalStatus || '',
    occupation: profile.profession || profile.jobTitle || '',
    employerName: profile.employerName || '',
    employerAddress: profile.employerAddress || '',
    employerTelephone: profile.employerPhone || '',
    homeAddress: profile.address || '',
    telephone: profile.phone || '',
    email: profile.email || '',
    destinationCountry: profile.targetCountry || '',
    intendedEntryDate: profile.plannedTravelDate || '',
    intendedExitDate: profile.plannedReturnDate || '',
    durationOfStay: profile.durationOfStay || '',
    meansCash: profile.monthlyIncome ? String(profile.monthlyIncome) : '',
  }
}
