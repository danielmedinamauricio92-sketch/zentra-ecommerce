import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const context=vm.createContext({window:{}});
vm.runInContext(fs.readFileSync('dist/detail-profiles.js','utf8'),context);
vm.runInContext(fs.readFileSync('dist/detail-view.js','utf8'),context);
const profiles=context.window.ROMA_DETAILS;
assert.equal(Object.keys(profiles).length,122,'Deben existir 122 perfiles');
const unresolved=[];
for(let id=1;id<=122;id++){
 const profile=profiles[id];
 assert(profile,'Falta perfil '+id);
 assert.equal(profile.id,id);
 assert(profile.description?.trim(),'Falta descripción '+id);
 if(profile.status==='needs-variant'){unresolved.push(id);continue;}
 assert.equal(profile.status,'verified','Estado inválido '+id);
 assert(profile.family?.trim(),'Falta familia '+id);
 assert(Object.values(profile.notes||{}).some(notes=>Array.isArray(notes)&&notes.length),'Faltan notas '+id);
 assert(profile.sources?.some(source=>/^https:\/\//.test(source.url)),'Falta fuente '+id);
}
for(let id=1;id<=122;id++)assert(fs.statSync(`dist/assets/perfumes/${String(id).padStart(2,'0')}.jpg`).size>10000);
const html=context.window.renderRomaDetails({id:42,name:'Baccarat Rouge 540',brand:'Maison Francis Kurkdjian',category:'Unisex',image:'assets/perfumes/42.jpg'},profiles[42]);
assert(html.includes('55 ml'));assert(html.includes('Inspirada en'));assert(!html.includes('detail-pending'));
assert(html.includes('src="assets/perfumes/42.jpg"'),'Debe mostrar el original como referencia');
assert(html.includes('Diseño de envase ilustrativo'),'Debe identificar el diseño de Nova Roma');
const packagingStyles=new Set();
for(let id=1;id<=122;id++){
 const detail=context.window.renderRomaDetails({id,name:'Fragancia',category:'Unisex',image:'assets/perfumes/42.jpg'},profiles[id]);
 const style=detail.match(/class="roma-packaging" style="([^"]+)"/)?.[1];
 assert(style,'Falta la presentación Nova Roma');
 packagingStyles.add(style);
}
assert.equal(packagingStyles.size,122,'Cada fragancia debe tener una combinación de envase distinta');
console.log(`OK: 122 fichas, ${122-unresolved.length} perfiles verificados; variantes pendientes: ${unresolved.join(', ')||'ninguna'}.`);
