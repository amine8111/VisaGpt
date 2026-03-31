'use client';

import React, { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useVisaStore } from '@/store/visaStore';
import { getPassportPhoto, PASSPORT_PHOTO_UPDATED_EVENT } from '@/lib/passportPhotoStore';
import { useLanguage } from './LanguageProvider';

type FormData = Record<string, any>;

const Cell = ({ label, children, className = '' }: { label?: string, children?: React.ReactNode, className?: string }) => (
  <div className={`border border-black flex flex-col ${className}`}>
    {label && <div className={`text-[9px] text-gray-700 px-1 py-0.5 border-b border-black bg-gray-100`}>{label}</div>}
    <div className="px-1 py-1 flex-1 flex flex-col justify-center text-xs">
      {children}
    </div>
  </div>
);

const Input = ({ value, onChange, placeholder = '' }: { value: string, onChange: (v: string) => void, placeholder?: string }) => (
  <input 
    type="text" 
    value={value} 
    onChange={(e) => onChange(e.target.value)} 
    placeholder={placeholder}
    className="w-full bg-transparent outline-none text-black placeholder:text-gray-400"
  />
);

const Check = ({ label, checked, onClick }: { label: string, checked: boolean, onClick: () => void }) => (
  <span onClick={onClick} className="cursor-pointer inline-flex items-center mr-3 hover:text-blue-600">
    <span className="font-serif text-sm mr-1">{checked ? '☑' : '☐'}</span> {label}
  </span>
);

export default function SchengenFormOfficial() {
  const { membership, userProfile, setActiveNav } = useVisaStore();
  const { t, language } = useLanguage();
  const [f, setF] = useState<FormData>({
    surname: '', surnameBirth: '', firstNames: '', dob: '', pob: '', countryBirth: '',
    currNat: '', birthNat: '', sex: '', marital: '', minorInfo: '', nationalId: '',
    docType: '', docNum: '', docIssue: '', docExpiry: '', docIssuedBy: '',
    address: '', email: '', phone: '', resOther: '', occupation: '',
    empName: '', empAddress: '', empPhone: '',
    purpose: '', destState: '', firstEntry: '', entries: '', duration: '',
    prevVisa: '', prevVisaDates: '', prints: '', printsDate: '',
    permit: '', arrival: '', departure: '',
    hostName: '', hostAddress: '', compName: '', compAddress: '',
    costBy: '', means: [],
    euSurname: '', euFirst: '', euDob: '', euNat: '', euDoc: '', euRel: '',
    placeDate: '',
  });
  
  const [passportPhoto, setPassportPhoto] = useState<string | null>(null);
  const [processedPhoto, setProcessedPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load photo from localStorage or store
    const photo = getPassportPhoto() || userProfile.passportPhoto;
    if (photo) {
      console.log('📸 Schengen form loaded photo');
      setPassportPhoto(photo);
    }

    // Listen for updates
    const handleUpdate = () => {
      const photo = getPassportPhoto();
      if (!photo) return
      console.log('📸 Schengen form received photo update');
      setPassportPhoto(photo);
    };
    window.addEventListener(PASSPORT_PHOTO_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(PASSPORT_PHOTO_UPDATED_EVENT, handleUpdate);
  }, [userProfile.passportPhoto]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📸 Upload button clicked');
    const file = e.target.files?.[0];
    if (file) {
      console.log('📸 File selected:', file.name);
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        console.log('📸 DataURL length:', dataUrl.length);
        setPassportPhoto(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImageWithWhiteBackground = (dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        
        const targetWidth = 600;
        const targetHeight = 800;
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        
        const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          if (r > 180 && g > 180 && b > 180) {
            data[i + 3] = 0;
          }
        }
        ctx.putImageData(imageData, 0, 0);
        
        const bgCanvas = document.createElement('canvas');
        bgCanvas.width = targetWidth;
        bgCanvas.height = targetHeight;
        const bgCtx = bgCanvas.getContext('2d');
        if (bgCtx) {
          bgCtx.fillStyle = '#FFFFFF';
          bgCtx.fillRect(0, 0, targetWidth, targetHeight);
          bgCtx.drawImage(canvas, 0, 0);
          const result = bgCanvas.toDataURL('image/jpeg', 0.92);
          console.log('📸 Processed photo length:', result.length);
          resolve(result);
        } else {
          resolve(dataUrl);
        }
      };
      img.onerror = () => {
        console.error('📸 Failed to load image for processing');
        resolve(dataUrl);
      };
      img.src = dataUrl;
    });
  };

  const formRef = useRef<HTMLDivElement>(null);
  const subscription = membership?.tier || 'free';
  const hasAccess = subscription === 'gold' || subscription === 'premium';

  const s = (k: string, v: string) => setF(prev => ({ ...prev, [k]: v }));
  const tgl = (k: string, v: string) => {
    setF(prev => {
      const arr = prev[k] || [];
      return { ...prev, [k]: arr.includes(v) ? arr.filter((x: string) => x !== v) : [...arr, v] };
    });
  };

  const handleAutoFill = () => {
    const profile = userProfile as any;
    const hasProfileData = profile?.fullName || profile?.passportNumber || profile?.email || profile?.phone || profile?.dateOfBirth;
    if (!hasProfileData) {
      alert(language === 'ar' ? 'لم يتم العثور على بيانات الملف الشخصي! يرجى ملء ملفك أولاً.' : language === 'fr' ? 'Aucune donnée de profil trouvée! Veuillez d\'abord remplir votre profil.' : "No profile data found! Please fill in your profile first.");
      return;
    }

    const nameParts = (profile.fullName || '').split(' ');
    const last = nameParts.length > 1 ? nameParts[nameParts.length - 1] : nameParts[0] || '';
    const first = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : '';
    
    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? dateStr : `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;
    };

    setF(prev => ({
      ...prev,
      surname: last.toUpperCase(),
      firstNames: first,
      dob: formatDate(profile.dateOfBirth),
      pob: profile.placeOfBirth || '',
      countryBirth: 'Algeria',
      currNat: 'Algerian',
      sex: 'Male',
      marital: profile.maritalStatus ? profile.maritalStatus.charAt(0).toUpperCase() + profile.maritalStatus.slice(1) : '',
      docType: 'Ordinary passport',
      docNum: profile.passportNumber || '',
      docIssue: formatDate(profile.passportIssueDate),
      docExpiry: formatDate(profile.passportExpiryDate),
      docIssuedBy: profile.passportIssuingAuthority || '',
      address: profile.address || '',
      email: profile.email || '',
      phone: profile.phone || '',
      resOther: 'No',
      occupation: profile.profession || profile.jobTitle || '',
      empName: profile.employerName || '',
      empAddress: profile.employerAddress || '',
      empPhone: profile.employerPhone || '',
      purpose: profile.purposeOfVisit ? profile.purposeOfVisit.charAt(0).toUpperCase() + profile.purposeOfVisit.slice(1) : '',
      destState: profile.targetCountry || '',
      firstEntry: profile.targetCountry || '',
      duration: profile.durationOfStay || '',
      arrival: formatDate(profile.plannedTravelDate),
      departure: formatDate(profile.plannedReturnDate),
      entries: 'Single',
      costBy: 'Applicant',
      means: ['Cash', 'Credit card']
    }));
  };

  const handleDownloadPDF = async () => {
    if (!formRef.current) return;
    try {
      const canvas = await html2canvas(formRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Schengen_Application_Form.pdf');
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF.");
    }
  };

  if (!hasAccess) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-8 bg-amber-50 border border-amber-200 rounded-xl text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h2 className="text-xl font-bold text-amber-800 mb-2">{t('premiumFeature')}</h2>
        <p className="text-amber-700 mb-6">{t('officialSchengenPremium')}</p>
        <button onClick={() => setActiveNav('upgrade')} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-bold">{t('upgradeNow')}</button>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-[210mm] mx-auto mb-4 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <button onClick={handleAutoFill} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded font-medium transition-colors">
          ✨ {t('autoFill')}
        </button>
        <button onClick={handleDownloadPDF} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded font-medium transition-colors">
          📄 {t('downloadPDF')}
        </button>
      </div>

      <div className="max-w-[210mm] mx-auto bg-white shadow-2xl p-8" ref={formRef} style={{ fontFamily: 'Arial, sans-serif' }}>
        
        <div className="mb-4" style={{ position: 'relative', height: '60mm' }}>
          <img
            src="/header-schengen.png"
            alt="Schengen Visa Application Form Header"
            style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
          />
          
          <div style={{
            position: 'absolute',
            right: '20px',
            top: '10px',
            width: '35mm',
            height: '45mm',
          }}>
              <div 
                id="schengen-photo-box"
                style={{
                  width: '100%',
                  height: '100%',
                  border: '2px dashed #999',
                  overflow: 'hidden',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {!passportPhoto && (
                  <span className="text-xs text-gray-500">Photo</span>
                )}

                {passportPhoto && (
                  <img 
                    src={passportPhoto} 
                    alt="Passport Photo"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      backgroundColor: '#FFFFFF',
                      display: 'block',
                    }} 
                  />
                )}
              </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
            />
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                fontSize: '11px',
                padding: '3px 8px',
                marginTop: '4px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                background: 'white',
                width: '100%',
                display: 'block'
              }}
            >
              {passportPhoto ? (language === 'ar' ? 'تغيير' : language === 'fr' ? 'Changer' : 'Change') : (language === 'ar' ? 'رفع' : language === 'fr' ? 'Télécharger' : 'Upload')}
            </button>
          </div>
        </div>

        <div className="flex items-stretch border-t border-l border-r border-black">
          <div className="w-3/4 flex flex-col border-r border-black">
            <Cell label="1. Surname (Family name) (x)"><Input value={f.surname} onChange={v => s('surname', v)} /></Cell>
            <Cell label="2. Surname at birth (Former family name(s)) (x)"><Input value={f.surnameBirth} onChange={v => s('surnameBirth', v)} /></Cell>
            <Cell label="3. First name(s) (Given name(s)) (x)"><Input value={f.firstNames} onChange={v => s('firstNames', v)} /></Cell>
            
            <div className="flex">
              <Cell label="4. Date of birth (day-month-year)" className="w-1/4 border-r-0"><Input value={f.dob} onChange={v => s('dob', v)} /></Cell>
              <Cell label="5. Place of birth" className="w-1/4 border-r-0 border-l"><Input value={f.pob} onChange={v => s('pob', v)} /></Cell>
              <Cell label="7. Current nationality" className="w-1/4 border-r-0 border-l">
                <Input value={f.currNat} onChange={v => s('currNat', v)} />
                <div className="text-[8px] mt-1 text-gray-500 border-t border-gray-300">Nationality at birth:</div>
                <Input value={f.birthNat} onChange={v => s('birthNat', v)} />
              </Cell>
              <Cell label="6. Country of birth" className="w-1/4 border-l"><Input value={f.countryBirth} onChange={v => s('countryBirth', v)} /></Cell>
            </div>

            <div className="flex">
              <Cell label="8. Sex" className="w-1/3 border-r-0 border-t-0">
                <div className="flex pt-1">
                  <Check label="Male" checked={f.sex === 'Male'} onClick={() => s('sex', 'Male')} />
                  <Check label="Female" checked={f.sex === 'Female'} onClick={() => s('sex', 'Female')} />
                </div>
              </Cell>
              <Cell label="9. Marital status" className="w-2/3 border-l border-t-0">
                <div className="flex flex-wrap pt-1 gap-y-1">
                  {['Single', 'Married', 'Separated', 'Divorced', 'Widow(er)'].map(m => (
                    <Check key={m} label={m} checked={f.marital === m} onClick={() => s('marital', m)} />
                  ))}
                </div>
              </Cell>
            </div>

            <Cell label="10. In the case of minors: surname, first name, address and nationality of parental authority" className="border-t-0">
              <Input value={f.minorInfo} onChange={v => s('minorInfo', v)} />
            </Cell>
            <Cell label="11. National identity number, where applicable" className="border-t-0 border-b-0">
              <Input value={f.nationalId} onChange={v => s('nationalId', v)} />
            </Cell>
          </div>

          <div className="w-1/4 bg-gray-50 flex flex-col text-[9px] p-2 border-b border-black">
            <div className="font-bold text-center border-b border-black pb-1 mb-2">FOR OFFICIAL USE ONLY</div>
            <p className="mb-2">Date of application:</p>
            <p className="mb-2">Visa application number:</p>
            <div className="border-t border-black pt-1 mb-2">
              <p>Application lodged at:</p>
              <p>☐ Embassy/consulate</p>
              <p>☐ CAC</p>
              <p>☐ Service provider</p>
              <p>☐ Commercial intermediary</p>
              <p>☐ Border (Name):</p>
            </div>
            <div className="border-t border-black pt-1 mb-2">
              <p>File handled by:</p>
            </div>
            <div className="border-t border-black pt-1 mb-2">
              <p>Supporting documents:</p>
              <p>☐ Travel document</p>
              <p>☐ Means of subsistence</p>
              <p>☐ Invitation</p>
              <p>☐ Means of transport</p>
              <p>☐ TMI</p>
              <p>☐ Other:</p>
            </div>
          </div>
        </div>

        <div className="border-b border-l border-r border-black">
          <Cell label="12. Type of travel document" className="border-t-0 border-b-0">
            <div className="flex pt-1 flex-wrap">
              {['Ordinary passport', 'Diplomatic passport', 'Service passport', 'Official passport', 'Special passport', 'Other'].map(t => (
                <Check key={t} label={t.replace(' passport', '')} checked={f.docType === t} onClick={() => s('docType', t)} />
              ))}
            </div>
          </Cell>
        </div>

        <div className="flex border-b border-l border-r border-black">
          <Cell label="13. Number of travel document" className="w-1/4 border-0 border-r border-black"><Input value={f.docNum} onChange={v => s('docNum', v)} /></Cell>
          <Cell label="14. Date of issue" className="w-1/4 border-0 border-r border-black"><Input value={f.docIssue} onChange={v => s('docIssue', v)} /></Cell>
          <Cell label="15. Valid until" className="w-1/4 border-0 border-r border-black"><Input value={f.docExpiry} onChange={v => s('docExpiry', v)} /></Cell>
          <Cell label="16. Issued by" className="w-1/4 border-0"><Input value={f.docIssuedBy} onChange={v => s('docIssuedBy', v)} /></Cell>
        </div>

        <div className="flex border-b border-l border-r border-black">
          <Cell label="17. Applicant's home address and e-mail address" className="w-2/3 border-0 border-r border-black">
            <Input value={f.address} onChange={v => s('address', v)} placeholder="Address" />
            <Input value={f.email} onChange={v => s('email', v)} placeholder="Email" />
          </Cell>
          <Cell label="Telephone number(s)" className="w-1/3 border-0"><Input value={f.phone} onChange={v => s('phone', v)} /></Cell>
        </div>

        <Cell label="18. Residence in a country other than the country of current nationality" className="border-t-0 border-l border-r border-b border-black">
          <div className="flex pt-1">
            <Check label="No" checked={f.resOther === 'No'} onClick={() => s('resOther', 'No')} />
            <Check label="Yes. Residence permit No: ____________ Valid until: ____________" checked={f.resOther === 'Yes'} onClick={() => s('resOther', 'Yes')} />
          </div>
        </Cell>

        <Cell label="* 19. Current occupation" className="border-t-0 border-l border-r border-b border-black">
          <Input value={f.occupation} onChange={v => s('occupation', v)} />
        </Cell>

        <Cell label="* 20. Employer and employer's address and telephone number. For students, name and address of educational establishment." className="border-t-0 border-l border-r border-b border-black">
          <Input value={f.empName} onChange={v => s('empName', v)} placeholder="Name" />
          <Input value={f.empAddress} onChange={v => s('empAddress', v)} placeholder="Address" />
          <Input value={f.empPhone} onChange={v => s('empPhone', v)} placeholder="Phone" />
        </Cell>

        <Cell label="21. Main purpose(s) of the journey:" className="border-t-0 border-l border-r border-b border-black">
          <div className="flex flex-wrap pt-1 gap-y-1">
            {['Tourism', 'Business', 'Visiting family or friends', 'Cultural', 'Sports', 'Official visit', 'Medical reasons', 'Study', 'Transit', 'Airport transit', 'Other'].map(p => (
              <Check key={p} label={p} checked={f.purpose === p} onClick={() => s('purpose', p)} />
            ))}
          </div>
        </Cell>

        <div className="flex border-b border-l border-r border-black">
          <Cell label="22. Member State(s) of destination" className="w-1/2 border-0 border-r border-black"><Input value={f.destState} onChange={v => s('destState', v)} /></Cell>
          <Cell label="23. Member State of first entry" className="w-1/2 border-0"><Input value={f.firstEntry} onChange={v => s('firstEntry', v)} /></Cell>
        </div>

        <div className="flex border-b border-l border-r border-black">
          <Cell label="24. Number of entries requested" className="w-1/2 border-0 border-r border-black">
            <div className="flex pt-1">
              {['Single entry', 'Two entries', 'Multiple entries'].map(e => (
                <Check key={e} label={e.split(' ')[0]} checked={f.entries === e.split(' ')[0]} onClick={() => s('entries', e.split(' ')[0])} />
              ))}
            </div>
          </Cell>
          <Cell label="25. Duration of the intended stay or transit (days)" className="w-1/2 border-0"><Input value={f.duration} onChange={v => s('duration', v)} /></Cell>
        </div>

        <div className="flex border-b border-l border-r border-black">
          <Cell label="26. Schengen visas issued during the past three years" className="w-1/2 border-0 border-r border-black">
            <div className="flex pt-1">
              <Check label="No" checked={f.prevVisa === 'No'} onClick={() => s('prevVisa', 'No')} />
              <Check label="Yes" checked={f.prevVisa === 'Yes'} onClick={() => s('prevVisa', 'Yes')} />
            </div>
            {f.prevVisa === 'Yes' && <Input value={f.prevVisaDates} onChange={v => s('prevVisaDates', v)} placeholder="Dates of validity from ... to ..." />}
          </Cell>
          <Cell label="27. Fingerprints collected previously for the purpose of applying for a Schengen visa" className="w-1/2 border-0">
            <div className="flex pt-1">
              <Check label="No" checked={f.prints === 'No'} onClick={() => s('prints', 'No')} />
              <Check label="Yes" checked={f.prints === 'Yes'} onClick={() => s('prints', 'Yes')} />
            </div>
            {f.prints === 'Yes' && <Input value={f.printsDate} onChange={v => s('printsDate', v)} placeholder="Date, if known" />}
          </Cell>
        </div>

        <Cell label="28. Entry permit for the final country of destination, where applicable" className="border-t-0 border-l border-r border-b border-black">
          <Input value={f.permit} onChange={v => s('permit', v)} placeholder="Issued by ... Valid from ... until ..." />
        </Cell>

        <div className="flex border-b border-l border-r border-black">
          <Cell label="29. Intended date of arrival in the Schengen area" className="w-1/2 border-0 border-r border-black"><Input value={f.arrival} onChange={v => s('arrival', v)} /></Cell>
          <Cell label="30. Intended date of departure from the Schengen area" className="w-1/2 border-0"><Input value={f.departure} onChange={v => s('departure', v)} /></Cell>
        </div>

        <Cell label="* 31. Surname and first name of the inviting person(s) / hotel(s) / temporary accommodation(s)" className="border-t-0 border-l border-r border-b border-black">
          <Input value={f.hostName} onChange={v => s('hostName', v)} placeholder="Name" />
          <Input value={f.hostAddress} onChange={v => s('hostAddress', v)} placeholder="Address and e-mail" />
        </Cell>

        <Cell label="* 32. Name and address of inviting company/organisation" className="border-t-0 border-l border-r border-b border-black">
          <Input value={f.compName} onChange={v => s('compName', v)} placeholder="Company Name" />
          <Input value={f.compAddress} onChange={v => s('compAddress', v)} placeholder="Address, telephone and telefax" />
        </Cell>

        <Cell label="* 33. Cost of travelling and living during the applicant's stay is covered" className="border-t-0 border-l border-r border-b border-black p-0">
          <div className="flex">
            <div className="w-1/2 p-2 border-r border-black">
              <Check label="by the applicant himself/herself" checked={f.costBy === 'Applicant'} onClick={() => s('costBy', 'Applicant')} />
              <div className="mt-2 text-xs font-semibold">Means of support:</div>
              <div className="flex flex-col mt-1 space-y-1">
                {['Cash', "Traveller's cheques", 'Credit card', 'Pre-paid accommodation', 'Pre-paid transport'].map(m => (
                  <Check key={m} label={m} checked={f.means.includes(m)} onClick={() => tgl('means', m)} />
                ))}
              </div>
            </div>
            <div className="w-1/2 p-2">
              <Check label="by a sponsor (host, company, organisation)" checked={f.costBy === 'Sponsor'} onClick={() => s('costBy', 'Sponsor')} />
              <div className="mt-2 text-xs font-semibold">Means of support:</div>
              <div className="flex flex-col mt-1 space-y-1">
                {['Cash', 'Accommodation provided', 'All expenses covered during the stay', 'Pre-paid transport'].map(m => (
                  <Check key={`sp-${m}`} label={m} checked={f.means.includes(m)} onClick={() => tgl('means', m)} />
                ))}
              </div>
            </div>
          </div>
        </Cell>

        <Cell label="34. Personal data of the family member who is an EU, EEA or CH citizen" className="border-t-0 border-l border-r border-b border-black">
          <div className="flex space-x-2">
            <div className="w-1/4"><span className="text-[9px]">Surname:</span> <Input value={f.euSurname} onChange={v => s('euSurname', v)} /></div>
            <div className="w-1/4"><span className="text-[9px]">First Name:</span> <Input value={f.euFirst} onChange={v => s('euFirst', v)} /></div>
            <div className="w-1/4"><span className="text-[9px]">DOB:</span> <Input value={f.euDob} onChange={v => s('euDob', v)} /></div>
            <div className="w-1/4"><span className="text-[9px]">Nationality:</span> <Input value={f.euNat} onChange={v => s('euNat', v)} /></div>
          </div>
          <div className="mt-1"><span className="text-[9px]">Document No:</span> <Input value={f.euDoc} onChange={v => s('euDoc', v)} /></div>
        </Cell>

        <Cell label="35. Family relationship with an EU, EEA or CH citizen" className="border-t-0 border-l border-r border-b border-black">
          <div className="flex pt-1">
            {['Spouse', 'Child', 'Grandchild', 'Dependent ascendant'].map(r => (
               <Check key={r} label={r} checked={f.euRel === r} onClick={() => s('euRel', r)} />
            ))}
          </div>
        </Cell>

        <div className="mt-4 border border-black p-3 text-[10px] text-justify leading-tight bg-gray-50">
          <p className="mb-2">I am aware that the visa fee is not refunded if the visa is refused.</p>
          <p className="mb-2 font-bold">I declare that to the best of my knowledge all particulars supplied by me are correct and complete. I am aware that any false statements will lead to my application being rejected or to the annulment of a visa already granted and may also render me liable to prosecution under the law of the Member State which deals with the application.</p>
          <p>I undertake to leave the territory of the Member States before the expiry of the visa, if granted. I have been informed that possession of a visa is only one of the prerequisites for entry into the European territory of the Member States.</p>
        </div>

        <div className="flex mt-4">
          <Cell label="36. Place and date" className="w-1/2 border-r-0"><Input value={f.placeDate} onChange={v => s('placeDate', v)} /></Cell>
          <Cell label="37. Signature (for minors, signature of parental authority/legal guardian):" className="w-1/2 h-16"><div /></Cell>
        </div>
      </div>
    </div>
  );
}
