export interface SchengenFormData {
  // Section 1: Personal Details
  surname: string
  surnameBorn: string
  givenNames: string
  givenNamesBorn: string
  dateOfBirth: string
  placeOfBirth: string
  countryOfBirth: string
  nationality: string
  sex: 'M' | 'F' | ''
  civilStatus: 'single' | 'married' | 'widowed' | 'divorced' | 'separated' | 'other' | ''
  nationalId: string
  // For minors
  parentSurname: string
  parentGivenNames: string
  
  // Section 2: Travel Document
  travelDocType: 'ordinary' | 'diplomatic' | 'service' | 'other' | ''
  passportNumber: string
  passportIssueDate: string
  passportExpiryDate: string
  issuingAuthority: string
  childrenInPassport: boolean
  
  // Section 3: Contact Details
  homeAddress: string
  telephone: string
  email: string
  countryOfResidence: string
  
  // Section 4: EU Family Relation
  hasEUFamilyRelation: boolean
  euRelationType: 'spouse' | 'child' | 'grandchild' | 'ascendant' | 'dependent' | 'other' | ''
  euFamilyName: string
  euFamilyGivenNames: string
  euFamilyDOB: string
  euFamilyNationality: string
  euFamilyDocNumber: string
  
  // Section 5: Purpose of Journey
  purpose: 'tourism' | 'business' | 'family' | 'cultural' | 'transit' | 'sports' | 'other' | ''
  purposeOther: string
  destinationCountry: string
  firstEntryPoint: string
  entriesRequested: 'single' | 'double' | 'multiple' | ''
  durationOfStay: string
  intendedEntryDate: string
  intendedExitDate: string
  
  // Section 6: Previous Schengen Visas
  previousSchengenVisa: boolean
  previousVisaDetails: string
  fingerprintsCollected: boolean
  entryPermitFinalDestination: string
  
  // Section 7: Host/Company
  hostName: string
  hostAddress: string
  hostTelephone: string
  hostEmail: string
  hostContactPerson: string
  
  // Section 8: Family Members in Schengen
  familyInSchengen: boolean
  familyMembers: Array<{
    surname: string
    givenNames: string
    dob: string
    nationality: string
    docNumber: string
    relation: string
  }>
  
  // Section 9: Employment
  occupation: string
  employerName: string
  employerAddress: string
  employerTelephone: string
  schoolName: string
  
  // Section 10: Means of Subsistence
  meansCash: string
  meansTravellersCheques: string
  meansCreditCards: string
  meansOther: string
  sponsorshipArranged: boolean
  sponsorName: string
  sponsorAddress: string
  
  // Section 11: Travel Insurance
  hasTravelInsurance: boolean
  insuranceCompany: string
  policyNumber: string
  insuranceCoverage: string
  insuranceValidFor: string
  
  // Section 12: Additional Info
  accommodationType: 'hotel' | 'private' | 'other' | ''
  accommodationOther: string
  previousRefusal: boolean
  previousDeportation: boolean
  
  // Section 13: Date and Signature
  applicationDate: string
  applicantSignature: string
  parentSignature: string
}

export const initialFormData: SchengenFormData = {
  surname: '',
  surnameBorn: '',
  givenNames: '',
  givenNamesBorn: '',
  dateOfBirth: '',
  placeOfBirth: '',
  countryOfBirth: 'DZ',
  nationality: 'DZ',
  sex: '',
  civilStatus: '',
  nationalId: '',
  parentSurname: '',
  parentGivenNames: '',
  
  travelDocType: 'ordinary',
  passportNumber: '',
  passportIssueDate: '',
  passportExpiryDate: '',
  issuingAuthority: '',
  childrenInPassport: false,
  
  homeAddress: '',
  telephone: '',
  email: '',
  countryOfResidence: 'DZ',
  
  hasEUFamilyRelation: false,
  euRelationType: '',
  euFamilyName: '',
  euFamilyGivenNames: '',
  euFamilyDOB: '',
  euFamilyNationality: '',
  euFamilyDocNumber: '',
  
  purpose: '',
  purposeOther: '',
  destinationCountry: '',
  firstEntryPoint: '',
  entriesRequested: '',
  durationOfStay: '',
  intendedEntryDate: '',
  intendedExitDate: '',
  
  previousSchengenVisa: false,
  previousVisaDetails: '',
  fingerprintsCollected: false,
  entryPermitFinalDestination: '',
  
  hostName: '',
  hostAddress: '',
  hostTelephone: '',
  hostEmail: '',
  hostContactPerson: '',
  
  familyInSchengen: false,
  familyMembers: [],
  
  occupation: '',
  employerName: '',
  employerAddress: '',
  employerTelephone: '',
  schoolName: '',
  
  meansCash: '',
  meansTravellersCheques: '',
  meansCreditCards: '',
  meansOther: '',
  sponsorshipArranged: false,
  sponsorName: '',
  sponsorAddress: '',
  
  hasTravelInsurance: true,
  insuranceCompany: '',
  policyNumber: '',
  insuranceCoverage: '',
  insuranceValidFor: 'Schengen States',
  
  accommodationType: '',
  accommodationOther: '',
  previousRefusal: false,
  previousDeportation: false,
  
  applicationDate: '',
  applicantSignature: '',
  parentSignature: '',
}

export const SCHENGEN_COUNTRIES = [
  { code: 'AT', name: 'Austria' },
  { code: 'BE', name: 'Belgium' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'DE', name: 'Germany' },
  { code: 'DK', name: 'Denmark' },
  { code: 'EE', name: 'Estonia' },
  { code: 'ES', name: 'Spain' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'GR', name: 'Greece' },
  { code: 'HU', name: 'Hungary' },
  { code: 'IS', name: 'Iceland' },
  { code: 'IT', name: 'Italy' },
  { code: 'LI', name: 'Liechtenstein' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'LV', name: 'Latvia' },
  { code: 'MT', name: 'Malta' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'NO', name: 'Norway' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'SE', name: 'Sweden' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'SK', name: 'Slovakia' },
]

export const CIVIL_STATUS_OPTIONS = [
  { value: 'single', label: 'Single', labelAr: 'أعزب/عزباء', labelFr: 'Célibataire' },
  { value: 'married', label: 'Married', labelAr: 'متزوج/متزوجة', labelFr: 'Marié(e)' },
  { value: 'widowed', label: 'Widowed', labelAr: 'أرمل/أرملة', labelFr: 'Veuf/Veuve' },
  { value: 'divorced', label: 'Divorced', labelAr: 'مطلق/مطلقة', labelFr: 'Divorcé(e)' },
  { value: 'separated', label: 'Separated', labelAr: 'منفصل', labelFr: 'Séparé(e)' },
  { value: 'other', label: 'Other', labelAr: 'آخر', labelFr: 'Autre' },
]

export const PURPOSE_OPTIONS = [
  { value: 'tourism', label: 'Tourism', labelAr: 'سياحة', labelFr: 'Tourisme' },
  { value: 'business', label: 'Business', labelAr: 'أعمال', labelFr: 'Affaires' },
  { value: 'family', label: 'Family visit', labelAr: 'زيارة عائلية', labelFr: 'Visite familiale' },
  { value: 'cultural', label: 'Cultural', labelAr: 'ثقافي', labelFr: 'Culturel' },
  { value: 'transit', label: 'Transit', labelAr: 'ترانزيت', labelFr: 'Transit' },
  { value: 'sports', label: 'Sports', labelAr: 'رياضة', labelFr: 'Sports' },
  { value: 'other', label: 'Other', labelAr: 'آخر', labelFr: 'Autre' },
]
