export const PASSPORT_PHOTO_KEY = 'visaai_passport_photo_dataurl';
export const PASSPORT_PHOTO_UPDATED_EVENT = 'passport-photo-updated';

export function savePassportPhoto(dataUrl: string) {
  console.log('💾 Saving photo to localStorage:', dataUrl.substring(0, 50) + '...');
  localStorage.setItem(PASSPORT_PHOTO_KEY, dataUrl);
  window.dispatchEvent(new CustomEvent(PASSPORT_PHOTO_UPDATED_EVENT));
  console.log('✅ Photo saved and event dispatched');
}

export function getPassportPhoto(): string | null {
  const photo = localStorage.getItem(PASSPORT_PHOTO_KEY);
  console.log('📸 getPassportPhoto:', photo ? 'FOUND' : 'NOT FOUND');
  return photo;
}

export function clearPassportPhoto() {
  localStorage.removeItem(PASSPORT_PHOTO_KEY);
  window.dispatchEvent(new CustomEvent(PASSPORT_PHOTO_UPDATED_EVENT));
}

export async function dataUrlToFile(dataUrl: string, fileName = 'passport-photo.jpg') {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], fileName, { type: blob.type || 'image/jpeg' });
}
