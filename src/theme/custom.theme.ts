import { mapping as evaMapping } from '@eva-design/eva';

export const customTheme = {
  /* =========================
   * Backgrounds (mais claros, azul)
   * ========================= */
  'background-basic-color-1': '#1E2633', // fundo principal
  'background-basic-color-2': '#243044', // superfícies
  'background-basic-color-3': '#2A3850', // cards
  'background-basic-color-4': '#32425E', // elevação maior

  /* Cards / Popovers */
  'background-alternative-color-1': '#28364D', // card
  'background-alternative-color-2': '#223047', // popover

  /* Inputs */
  'background-basic-color-5': '#2E3C55',

  /* =========================
   * Text
   * ========================= */
  'text-basic-color': '#EAF0F6', // texto principal
  'text-hint-color': '#B2C0D1', // texto secundário
  'text-disabled-color': '#8A97A8',
  'text-control-color': '#1E2633',

  /* =========================
   * Primary (Teal)
   * ========================= */
  'color-primary-100': '#C9F5EE',
  'color-primary-200': '#9DEBDD',
  'color-primary-300': '#6FE0CC',
  'color-primary-400': '#46D4BC',
  'color-primary-500': '#2EB8A2',
  'color-primary-600': '#239684',
  'color-primary-700': '#1A7466',
  'color-primary-800': '#115248',
  'color-primary-900': '#0A3A34',

  /* =========================
   * Neutral / Slate (azulado)
   * ========================= */
  'color-basic-600': '#3A4A63',
  'color-basic-700': '#324159',
  'color-basic-800': '#2A364A',
  'color-basic-900': '#222C3D',

  /* =========================
   * Status colors
   * ========================= */
  /* Success */
  'color-success-500': '#3AC28A',
  'color-success-600': '#2FA374',

  /* Warning */
  'color-warning-500': '#F7B84B',
  'color-warning-600': '#D99A2B',

  /* Danger */
  'color-danger-500': '#EF6A5B',
  'color-danger-600': '#D95446',

  /* =========================
   * Borders
   * ========================= */
  'border-basic-color-1': '#3A4A63',
  'border-basic-color-2': '#324159',
  'border-basic-color-3': '#2A364A',

  /* =========================
   * Focus / Ring
   * ========================= */
  'color-primary-focus': '#46D4BC',
};

export const customMapping = {
  ...evaMapping,
  strict: {
    ...evaMapping.strict,

    'text-font-family': 'JetBrains-Regular',
    'text-font-weight': '400',

    'text-heading-1-font-family': 'JetBrains-Bold',
    'text-heading-2-font-family': 'JetBrains-Bold',
    'text-heading-3-font-family': 'JetBrains-SemiBold',
    'text-heading-4-font-family': 'JetBrains-SemiBold',
    'text-heading-5-font-family': 'JetBrains-Medium',
    'text-heading-6-font-family': 'JetBrains-Medium',

    'text-subtitle-1-font-family': 'JetBrains-Medium',
    'text-subtitle-2-font-family': 'JetBrains-Regular',

    'text-paragraph-1-font-family': 'JetBrains-Regular',
    'text-paragraph-2-font-family': 'JetBrains-Regular',

    'text-caption-1-font-family': 'JetBrains-Regular',
    'text-caption-2-font-family': 'JetBrains-Regular',
  },
};