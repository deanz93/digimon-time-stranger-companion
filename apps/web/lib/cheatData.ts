export const switchProfile={
  game:'Digimon Story Time Stranger',version:'1.2.1',titleId:'010062E01FE0C000',buildId:'8567DF0B7DC16822',
  source:'https://www.cheatslips.com/game/digimon-story-time-stranger/8567DF0B7DC16822'
};

export const ps5Profile={
  name:'Digimon Story Time Stranger',id:'PPSA24701',version:'01.000.011',process:'eboot.bin',credits:['Talixme'],
  source:'https://github.com/TeeKay87/HEN-Cheats-Collection/blob/main/cheats/json/PPSA24701_01.000.011.json',
  mods:[
    {id:'ps5-hp',name:'Infinite HP',description:'Keeps party HP from decreasing.',type:'checkbox',memory:[{offset:'0',on:'410F4DC5837B0C010F84AD5AB000894318E9A55AB000',off:'00000000000000000000000000000000000000000000'},{offset:'B05AB4',on:'E947A54FFF9090',off:'410F4DC5894318'}]},
    {id:'ps5-items',name:'Infinite Items',description:'Prevents item quantities from decreasing.',type:'checkbox',memory:[{offset:'36',on:'B86300000089410C0F8551BDA300E949BDA300',off:'00000000000000000000000000000000000000'},{offset:'A3BD8D',on:'E9A4425CFF',off:'89410C7503'}]},
    {id:'ps5-money',name:'Infinite Money',description:'Keeps the money value at the source preset amount.',type:'checkbox',memory:[{offset:'69',on:'C4E278F2C1B87F969800894758E93A04A400',off:'000000000000000000000000000000000000'},{offset:'A404AD',on:'E9B7FB5BFF909090',off:'C4E278F2C1894758'}]},
    {id:'ps5-mp',name:'Infinite MP',description:'Keeps party MP from decreasing.',type:'checkbox',memory:[{offset:'9B',on:'4889DF448B7B7844897B78E95F3DEA00',off:'00000000000000000000000000000000'},{offset:'EA3E03',on:'E993C215FF9090',off:'4889DF44897B78'}]}
  ]
};
