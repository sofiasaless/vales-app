import { mapping as evaMapping } from '@eva-design/eva';

// export const customTheme = {
//   /* =========================
//    * Backgrounds (mais claros, azul)
//    * ========================= */
//   'background-basic-color-1': '#1E2633', // fundo principal
//   'background-basic-color-2': '#243044', // superfícies
//   'background-basic-color-3': '#2A3850', // cards
//   'background-basic-color-4': '#32425E', // elevação maior

//   /* Cards / Popovers */
//   'background-alternative-color-1': '#28364D', // card
//   'background-alternative-color-2': '#223047', // popover

//   /* Inputs */
//   'background-basic-color-5': '#2E3C55',

//   /* =========================
//    * Text
//    * ========================= */
//   'text-basic-color': '#EAF0F6', // texto principal
//   'text-hint-color': '#B2C0D1', // texto secundário
//   'text-disabled-color': '#8A97A8',
//   'text-control-color': '#1E2633',

//   /* =========================
//    * Primary (Teal)
//    * ========================= */
//   'color-primary-100': '#C9F5EE',
//   'color-primary-200': '#9DEBDD',
//   'color-primary-300': '#6FE0CC',
//   'color-primary-400': '#46D4BC',
//   'color-primary-500': '#2EB8A2',
//   'color-primary-600': '#239684',
//   'color-primary-700': '#1A7466',
//   'color-primary-800': '#115248',
//   'color-primary-900': '#0A3A34',

//   /* =========================
//    * Neutral / Slate (azulado)
//    * ========================= */
//   'color-basic-600': '#3A4A63',
//   'color-basic-700': '#324159',
//   'color-basic-800': '#2A364A',
//   'color-basic-900': '#222C3D',

//   /* =========================
//    * Status colors
//    * ========================= */
//   /* Success */
//   'color-success-500': '#3AC28A',
//   'color-success-600': '#2FA374',

//   /* Warning */
//   'color-warning-500': '#F7B84B',
//   'color-warning-600': '#D99A2B',

//   /* Danger */
//   'color-danger-500': '#EF6A5B',
//   'color-danger-600': '#D95446',

//   /* =========================
//    * Borders
//    * ========================= */
//   'border-basic-color-1': '#3A4A63',
//   'border-basic-color-2': '#324159',
//   'border-basic-color-3': '#2A364A',

//   /* =========================
//    * Focus / Ring
//    * ========================= */
//   'color-primary-focus': '#46D4BC',
// };

export const customTheme = {
  /* Backgrounds */
  'background-basic-color-1': '#0F1418', // background
  'background-basic-color-2': '#141A20',
  'background-basic-color-3': '#171E25',
  'background-basic-color-4': '#1B232B',

  /* Cards / Popovers */
  'background-alternative-color-1': '#161C22', // card
  'background-alternative-color-2': '#12171D', // popover

  /* Text */
  'text-basic-color': '#ECF2F8', // foreground
  'text-hint-color': '#8A93A0', // muted-foreground
  'text-disabled-color': '#5F6773',
  'text-control-color': '#0F1418',

  /* Primary (Teal) */
  'color-primary-100': '#B2F1E6',
  'color-primary-200': '#7FE6D6',
  'color-primary-300': '#4FDAC6',
  'color-primary-400': '#2FCFB7',
  'color-primary-500': '#2EB8A2', // primary
  'color-primary-600': '#239684',
  'color-primary-700': '#1A7466',
  'color-primary-800': '#115248',
  'color-primary-900': '#0A3A34',

  /* Secondary / Accent Slate */
  'color-basic-600': '#2A2F36',
  'color-basic-700': '#23282E',
  'color-basic-800': '#1C2126',
  'color-basic-900': '#151A1E',

  /* Success */
  'color-success-500': '#2EB872',
  'color-success-600': '#23965C',

  /* Warning */
  'color-warning-500': '#F5A623',
  'color-warning-600': '#D48806',

  /* Danger */
  'color-danger-500': '#E5533D',
  'color-danger-600': '#C4412E',

  /* Borders / Inputs */
  'border-basic-color-1': '#2A2F36',
  'border-basic-color-2': '#1F252B',
  'border-basic-color-3': '#171C21',

  /* Inputs */
  'background-basic-color-5': '#1F252B',

  /* Focus / Ring */
  'color-primary-focus': '#2EB8A2',

  'color-info-100': '#F2F8FF',
  'color-info-200': '#C7E2FF',
  'color-info-300': '#94CBFF',
  'color-info-400': '#42AAFF',
  'color-info-500': '#0095FF',
  'color-info-600': '#006FD6',
  'color-info-700': '#0057C2',
  'color-info-800': '#0041A8',
  'color-info-900': '#002885'
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