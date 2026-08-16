import type {BundledSwitchCheat} from './switchCheats.generated';

export const bundledSwitchDemoMeta={
  titleId:'0100A15026080000',
  buildId:'7E0AFD1097E8DADD',
  version:'1.0.0 Demo',
  sourceFiles:1,
  count:2,
  generatedAt:'2026-08-16'
} as const;

// Original instructions that restore the two patched addresses.
export const switchDemoMasterCode=`04000000 00052760 2A1C03E2
04000000 00015634 0B01014A`;

export const bundledSwitchDemoCheats:BundledSwitchCheat[]=[
  {
    id:'switch-demo-exp-x9',
    name:'EXP Multiplier ×9',
    description:'Multiplies EXP gained by nine in the Demo build.',
    code:`04000000 00052760 2A1C03E2
04000000 00052760 0B1C0F82`,
    category:'Multipliers',
    source:'Breeze 108.4 Demo',
    credits:'TomSwitch'
  },
  {
    id:'switch-demo-cp-x256',
    name:'CP Multiplier ×256',
    description:'Multiplies CP gained by 256 in the Demo build.',
    code:`04000000 00015634 0B01014A
04000000 00015634 0B01214A`,
    category:'Multipliers',
    source:'Breeze 108.4 Demo',
    credits:'TomSwitch'
  }
];
