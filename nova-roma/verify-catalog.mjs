import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const nodes=new Map();
const element=()=>({innerHTML:'',textContent:'',value:'',dataset:{},classList:{add(){},toggle(){}},setAttribute(){},addEventListener(){},querySelectorAll(){return []},querySelector(){return element()},showModal(){this.open=true},close(){this.open=false}});
const document={getElementById(id){if(!nodes.has(id))nodes.set(id,element());return nodes.get(id)},querySelectorAll(){return []},createElement(){return element()},body:{append(){}}};
const context=vm.createContext({document,window:{},Date});
vm.runInContext(fs.readFileSync('dist/feminine-products.js','utf8'),context);
vm.runInContext(fs.readFileSync('dist/detail-profiles.js','utf8'),context);
vm.runInContext(fs.readFileSync('dist/detail-view.js','utf8'),context);
vm.runInContext(fs.readFileSync('dist/app.js','utf8'),context);
const products=vm.runInContext('products',context);
assert.equal(products.length,122);
assert.equal(new Set(products.map(p=>p.id)).size,122);
assert.equal(new Set(products.map(p=>p.category+'|'+p.brand+'|'+p.name)).size,122);
for(const [category,count] of [['Femeninas',73],['Masculinas',38],['Unisex',11]]){
 vm.runInContext(`selectCategory(${JSON.stringify(category)})`,context);
 assert.equal(nodes.get('catalog-count').textContent,`${category} · ${count} fragancias`);
 assert.equal(nodes.get('seleccion').dataset.collection,category);
}
assert.equal(products.filter(p=>p.category==='Femeninas'&&p.name==='Flower'&&p.brand==='Kenzo').length,1);
vm.runInContext('selectCategory("Femeninas");query="lancome";render()',context);
assert.equal(nodes.get('catalog-count').textContent,'Femeninas · 4 fragancias');
vm.runInContext('query="zzzzzz";render()',context);
assert(nodes.get('product-grid').innerHTML.includes('No encontramos'));
vm.runInContext('openProduct(50)',context);
assert.equal(vm.runInContext('dialog.open',context),true);
for(const product of products){
 assert(product.image.endsWith('.jpg'),product.name);
 assert(fs.statSync('dist/'+product.image).size>10000,'Falta imagen: '+product.name);
}
console.log('OK: 122 productos, 73/38/11 por categoría, imágenes individuales, búsqueda sin acentos, duplicados y fichas.');
