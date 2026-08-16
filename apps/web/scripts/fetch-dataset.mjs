import {mkdir,readFile,writeFile} from 'node:fs/promises';
const output=new URL('../lib/dataset.generated.json',import.meta.url);
const valid=value=>Array.isArray(value?.digimon)&&value.digimon.length===475&&Array.isArray(value?.evolutions)&&value.evolutions.length>1000;
try{if(valid(JSON.parse(await readFile(output,'utf8')))){console.log('Using bundled 475-entry dataset.');process.exit(0)}}catch{}
const source='https://raw.githubusercontent.com/deanz93/digimon-time-stranger-companion/main/apps/web/lib/dataset.generated.json';
const response=await fetch(source);if(!response.ok)throw new Error(`Dataset download failed: ${response.status}`);
const body=await response.text(),parsed=JSON.parse(body);if(!valid(parsed))throw new Error('Downloaded dataset failed integrity checks.');
await mkdir(new URL('../lib/',import.meta.url),{recursive:true});await writeFile(output,body,'utf8');console.log('Downloaded verified 475-entry dataset.');
