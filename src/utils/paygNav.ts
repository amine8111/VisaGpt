export function mapPaygNav(serviceId: string): string {
  const mapping: Record<string, string> = {
    checklist: 'checklist',
    'basic-assessment': 'calculator',
    profile: 'profile',
    'visa-atlas': 'visa-atlas',
    'trip-cost': 'trip-cost',
    'packing-list': 'packing-list',
    'embassy-locator': 'embassy-locator',
    'hotel-booking': 'hotel-booking',
    'flight-search': 'flight-search',
    'visa-status': 'visa-status',
    'schengen-form': 'schengen-form',
    'document-organizer': 'documents',
    'letter-generator': 'letters',
    recours: 'rejection-analyzer',
    'savings-plan': 'savings-plan',
    'document-inspector': 'document-inspector',
    'insurance-claim': 'insurance-claim',
    'chat-coach': 'chat-coach',
    'slot-monitor': 'slot-monitor',
    'sim-marketplace': 'sim-marketplace',
    'agent-booking': 'booking',
    'translation-normal': 'translate',
    'translation-official': 'translate',
  }
  if (serviceId in mapping) return mapping[serviceId]
  return 'profile'
}
export default mapPaygNav;
