import {createHash} from 'node:crypto';
import {basename,join} from 'node:path';
import {copyFile,mkdir,readFile,writeFile} from 'node:fs/promises';

const args=process.argv.slice(2),outputArg=args.indexOf('--output'),archiveArg=args.indexOf('--archive-dir');
const output=outputArg>=0?args[outputArg+1]:'apps/web/lib/switchCheats.generated.ts';
const archiveDir=archiveArg>=0?args[archiveArg+1]:'data/source/switch-cheats';
const inputs=args.filter((x,i)=>!x.startsWith('--')&&i!==outputArg+1&&i!==archiveArg+1);
if(!inputs.length)throw new Error('Pass one or more exported CheatSlips HTML files. Newest source must be first.');

function decode(value){return value.replace(/&#(x?[0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):parseInt(n,10))).replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>')}
function text(value){return decode(value.replace(/<[^>]+>/g,'')).trim()}
function tables(html){return [...html.matchAll(/<table[\s\S]*?<\/table>/gi)].map(match=>{const body=match[0],name=text(body.match(/<strong>([\s\S]*?)<\/strong>/i)?.[1]??''),raw=decode(body.match(/<pre>([\s\S]*?)<\/pre>/i)?.[1]??'');const lines=raw.replace(/\r/g,'').split('\n').map(x=>x.trim()).filter(Boolean);return{name,code:lines.filter(x=>/^[0-9a-f]{8}(?:\s+[0-9a-f]{8}){0,3}$/i.test(x)).map(x=>x.toUpperCase().replace(/\s+/g,' ')).join('\n')}})}
function keyName(name){return name.toLowerCase().replace(/[î‚§î‚¦]/g,'').replace(/[^a-z0-9]+/g,' ').trim()}
function idFor(name,code){return `switch-${createHash('sha1').update(`${name}\n${code}`).digest('hex').slice(0,12)}`}
function normalized(name){return name.replace(/[î‚§]/g,'(Hold ZR)').replace(/[î‚¦]/g,'(Hold ZL)').replace(/\s+/g,' ').trim()}
function multiplier(name,pattern,label){const match=name.match(pattern);return match?`${label} ×${match[1]}`:''}
function displayTitle(raw){
  const name=normalized(raw),n=name.toLowerCase();let title='';
  if(n==='inf hp = 9999')return'Infinite HP (9,999)';
  if(n==='inf sp = 9999')return'Infinite SP (9,999)';
  if(n.includes('hp = 10')&&n.includes('scanned enemy'))return'Hold ZL: Set Scanned Enemy HP to 10';
  if(n==='get max cp x-arts')return'Maximum X-Arts CP Gain';
  if(n==='inf use cp x-arts not decrease')return'Infinite X-Arts CP';
  if(n==='get maximum money')return'Maximum Money';
  if(n.startsWith('money 1m'))return'Set Money to 1,000,000';
  if(n.startsWith('have exist items = 99'))return'Set Owned Items to 99';
  if(n==='use items not decrease')return'Infinite Items';
  if(n==='use items increase qty')return'Items Increase When Used';
  if(n==='anomaly points = 100')return'Set Anomaly Points to 100';
  if((title=multiplier(name,/^Money Multi x(\d+)$/i,'Money Multiplier')))return title;
  if((title=multiplier(name,/^Get Money x(\d+) \(After Battle\)$/i,'Battle Reward Money')))return title;
  if((title=multiplier(name,/^CP X-Arts x(\d+)$/i,'X-Arts CP Multiplier')))return title;
  if((title=multiplier(name,/^EXP Multi x(\d+)$/i,'EXP Multiplier')))return title;
  if((title=multiplier(name,/^Get EXP x(\d+) \(After Battle\)$/i,'Battle Reward EXP')))return title;
  if((title=multiplier(name,/^Digimon Rate Scan x(\d+)$/i,'Digimon Scan Rate')))return title;
  if(/^Max Digimon Rate Scan x256$/i.test(name))return'Digimon Scan Rate ×256 (Maximum)';
  if(/^Max Digimon Scan$/i.test(name))return'Instant Maximum Digimon Scan';
  const personality=name.match(/^\(Hold R\) Personality (.+)$/i);if(personality)return`Hold R: Set Personality to ${personality[1]}`;
  const augment=name.match(/^\(Hold ZR\) Augment Status .* = (\d+)$/i);if(augment)return`Hold ZR: Set Augment Stats to ${Number(augment[1]).toLocaleString('en-US')}`;
  if(n==='qty in battle 100')return'Set Battle Item Quantity to 100';
  if(n==='qty in brief case 100')return'Set Briefcase Item Quantity to 100';
  if(n==='zr hp sp 1000 in combat')return'Hold ZR: Set HP and SP to 1,000';
  if(n==='zl augment 1000')return'Hold ZL: Set Augment Stats to 1,000';
  if(n==='cp x256')return'CP Multiplier ×256 (Legacy)';
  if(n==='exp x9')return'EXP Multiplier ×9 (Legacy)';
  return name.replace(/\bInf\b/gi,'Infinite').replace(/\bQty\b/gi,'Quantity');
}
function description(raw,title){
  const n=normalized(raw).toLowerCase(),factor=title.match(/×([0-9]+)/)?.[1];
  if(title.startsWith('Infinite HP'))return'Keeps party HP at 9,999 while this cheat is enabled.';
  if(title.startsWith('Infinite SP'))return'Keeps party SP at 9,999 while this cheat is enabled.';
  if(n.includes('scanned enemy'))return"While holding ZL, sets the currently scanned enemy's HP to 10.";
  if(title==='Maximum X-Arts CP Gain')return'Sets X-Arts CP gained to its maximum value.';
  if(title==='Infinite X-Arts CP')return'Prevents X-Arts CP from decreasing when it is used.';
  if(title==='Maximum Money')return'Sets your money to the maximum supported value.';
  if(title==='Set Money to 1,000,000')return'Sets your money to 1,000,000 when you view the menu.';
  if(title==='Set Owned Items to 99')return'Sets the quantity of existing owned items to 99 when you view the menu.';
  if(title==='Infinite Items')return'Prevents item quantities from decreasing when items are used.';
  if(title==='Items Increase When Used')return'Increases an item quantity instead of consuming it when used.';
  if(title==='Set Anomaly Points to 100')return'Sets Anomaly Points to 100.';
  if(title.startsWith('Money Multiplier'))return`Multiplies money gained by ${factor}.`;
  if(title.startsWith('Battle Reward Money'))return`Multiplies money awarded after battle by ${factor}.`;
  if(title.startsWith('X-Arts CP Multiplier'))return`Multiplies X-Arts CP gained by ${factor}.`;
  if(title.startsWith('CP Multiplier'))return`Multiplies CP gained by ${factor}; retained from the legacy source set.`;
  if(title.startsWith('EXP Multiplier'))return`Multiplies EXP gained by ${factor}${title.includes('Legacy')?'; retained from the legacy source set.':'.'}`;
  if(title.startsWith('Battle Reward EXP'))return`Multiplies EXP awarded after battle by ${factor}.`;
  if(title.startsWith('Digimon Scan Rate'))return`Multiplies Digimon scan progress by ${factor}.`;
  if(title==='Digimon Scan Rate ×256 (Maximum)')return'Multiplies Digimon scan progress by 256, the largest bundled scan multiplier.';
  if(title==='Instant Maximum Digimon Scan')return'Sets Digimon scan progress directly to its maximum value.';
  if(title.startsWith('Hold R: Set Personality to '))return`Hold R while applying the code to change the selected Digimon's personality to ${title.slice('Hold R: Set Personality to '.length)}.`;
  if(title.startsWith('Hold ZR: Set Augment Stats'))return`While holding ZR, sets the selected Digimon's blue augment stat values to ${title.split(' to ')[1]}.`;
  if(title==='Hold ZL: Set Augment Stats to 1,000')return"While holding ZL, sets the selected Digimon's augment stats to 1,000.";
  if(title==='Hold ZR: Set HP and SP to 1,000')return'While holding ZR in combat, sets HP and SP to 1,000.';
  if(title==='Set Battle Item Quantity to 100')return'Sets usable battle item quantities to 100.';
  if(title==='Set Briefcase Item Quantity to 100')return'Sets briefcase item quantities to 100.';
  return`Applies the “${title}” effect for this exact game build.`;
}
function category(name){const n=name.toLowerCase();if(n.includes('personality'))return'Personality';if(n.includes('exp')||n.includes('money multi')||n.includes('get money x')||n.includes('cp x'))return'Multipliers';if(n.includes('scan'))return'Scanning';if(n.includes('hp')||n.includes('sp')||n.includes('battle')||n.includes('cp x-arts'))return'Battle';return'Resources'}

const ignored=/^(breeze |--section|for info$|digivice hp read$|setup hp read$|end$|off cheat$)/i,byName=new Map(),byCode=new Map();let master='',titleId='',buildId='',version='';
await mkdir(archiveDir,{recursive:true});
for(let index=0;index<inputs.length;index++){
  const input=inputs[index],html=await readFile(input,'utf8'),sourceTables=tables(html),header=sourceTables.find(x=>/TID:\s*[0-9A-F]{16}/i.test(x.name));
  if(header){const tid=header.name.match(/TID:\s*([0-9A-F]{16})/i)?.[1].toUpperCase(),bid=header.name.match(/BID:\s*([0-9A-F]{16})/i)?.[1].toUpperCase(),ver=header.name.match(/Time Stranger\s+([0-9.]+)/i)?.[1];if(titleId&&titleId!==tid)throw new Error(`Title ID mismatch in ${input}`);if(buildId&&buildId!==bid)throw new Error(`Build ID mismatch in ${input}`);titleId=tid;buildId=bid;version=ver??version}
  await copyFile(input,join(archiveDir,`${String(index+1).padStart(2,'0')}-${basename(input)}`));
  for(const item of sourceTables){if(!item.name||!item.code)continue;if(/^master restore\/off enable$/i.test(item.name)){if(!master)master=item.code;continue}if(ignored.test(item.name))continue;const nameKey=keyName(item.name),codeKey=item.code.replace(/\s/g,'');if(byName.has(nameKey)||byCode.has(codeKey))continue;const name=displayTitle(item.name),entry={id:idFor(item.name,item.code),name,description:description(item.name,name),code:item.code,category:category(item.name),source:index===0?'Breeze 108.7b':'Breeze 108.7a',credits:'TomSwitch'};byName.set(nameKey,entry);byCode.set(codeKey,entry)}
}
if(!titleId||!buildId||!master)throw new Error('Missing matching TID, BID, or master restore block.');
const entries=[...byName.values()].sort((a,b)=>a.category.localeCompare(b.category)||a.name.localeCompare(b.name));
const generated=`export type BundledSwitchCheat={id:string;name:string;description:string;code:string;category:string;source:string;credits:string};\nexport const bundledSwitchMeta=${JSON.stringify({titleId,buildId,version,sourceFiles:inputs.length,count:entries.length,generatedAt:'2026-08-16'},null,2)} as const;\nexport const switchMasterCode=${JSON.stringify(master)};\nexport const bundledSwitchCheats:BundledSwitchCheat[]=${JSON.stringify(entries,null,2)};\n`;
await writeFile(output,generated,'utf8');
console.log(`Merged ${entries.length} selectable cheats for ${titleId}/${buildId} from ${inputs.length} sources.`);
