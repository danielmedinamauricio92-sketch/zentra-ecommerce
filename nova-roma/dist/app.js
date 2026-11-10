// Las miniaturas se muestran con recortes CSS de la lámina original.
const left = [
['1 Million','Rabanne',187],['1 Million Elixir','Rabanne',226],['212','Carolina Herrera',265],['212 Sexy','Carolina Herrera',304],['212 Heroes','Carolina Herrera',343],['212 VIP','Carolina Herrera',382],['212 VIP Black','Carolina Herrera',421],['Acqua di Giò','Giorgio Armani',459],['Bad Boy','Carolina Herrera',498],['Azzaro','Azzaro',537],['Black XS','Rabanne',576],['Black XS Aphrodisiaque','Rabanne',615],['CH Privé','Carolina Herrera',654],['Aventus','Creed',693],['Dolce & Gabbana','Dolce & Gabbana',732],['Fahrenheit','Dior',770],['Gentleman','Givenchy',809],['Invictus','Rabanne',848],['Invictus Intense','Rabanne',887],['Kenzo pour Homme','Kenzo',926],['Kenzo Homme Intense','Kenzo',965],['L’Eau d’Issey','Issey Miyake',1004],['Le Male','Jean Paul Gaultier',1043],['Light Blue','Dolce & Gabbana',1082],['Megamare','Orto Parisi',1121],['Million Gold','Rabanne',1160],['Ombré Leather','Tom Ford',1198]
];
const right = [
['Phantom','Rabanne',187],['Polo Blue','Ralph Lauren',226],['Pure XS','Rabanne',265],['Sauvage','Dior',304],['Scandal','Jean Paul Gaultier',343],['Stronger With You','Emporio Armani',389],['Terre d’Hermès','Hermès',433],['Tommy','Tommy Hilfiger',473],['Ultra Male','Jean Paul Gaultier',513],['Very Irrésistible','Givenchy',554],['Eros','Versace',597]
];
const shared = [
['CK One','Calvin Klein',708],['Oud Wood','Tom Ford',752],['Oud for Greatness','Initio',797],['Baccarat Rouge 540','Maison Francis Kurkdjian',841],['Arabians Tonka','Montale',886],['Erba Pura','Xerjoff',930],['Santal 33','Le Labo',975],['Lost Cherry','Tom Ford',1019],['Khamrah Qahwa','Lattafa',1064],['Teriaq','Lattafa',1108],['Costa Azzurra','Tom Ford',1152]
];
const products = [
...left.map(([name,brand,y])=>({name,brand,y,x:111,category:'Masculinas'})),
...right.map(([name,brand,y])=>({name,brand,y,x:465,category:'Masculinas'})),
...shared.map(([name,brand,y])=>({name,brand,y,x:465,category:'Unisex'}))
].map((product,index)=>({...product,id:index+1,image:`assets/perfumes/${String(index+1).padStart(2,'0')}.jpg`}));
products.push(...window.ROMA_FEMININE);
const categoryCount=name=>products.filter(product=>product.category===name).length;
let category='Femeninas';
let query='';
const catalogSection=document.getElementById('seleccion');
catalogSection.classList.add('full-catalog');
catalogSection.innerHTML=`<div class="section-heading"><div><p class="eyebrow">ENCONTRÁ TU PRÓXIMA FRAGANCIA</p><h2>El universo <em>Roma.</em></h2></div><p>Explorá nuestra selección.<br>Cada aroma, una nueva forma de expresarte.</p></div><div class="catalog-tools"><div class="tabs" role="group" aria-label="Elegir categoría"><button data-tab="Femeninas" aria-pressed="true" class="active">Femeninas <span>${categoryCount("Femeninas")}</span></button><button data-tab="Masculinas" aria-pressed="false">Masculinas <span>${categoryCount("Masculinas")}</span></button><button data-tab="Unisex" aria-pressed="false">Unisex <span>${categoryCount("Unisex")}</span></button></div><label class="search-box"><span aria-hidden="true">⌕</span><input id="perfume-search" type="search" placeholder="Buscar perfume o marca" aria-label="Buscar perfume o marca"></label></div><div class="catalog-meta"><p id="catalog-count" aria-live="polite"></p><span>UNA ESENCIA PARA CADA PERSONALIDAD</span></div><div id="product-grid" class="product-grid"></div><p class="catalog-note">Fragancias inspiradas · Presentación de 55 ml · Imágenes ilustrativas.</p>`;
const dialog=document.createElement('dialog');
dialog.className='product-dialog';
dialog.setAttribute('aria-label','Detalle del perfume');
document.body.append(dialog);
function bottle(product,large=false){
const source=large&&product.detailImage?product.detailImage:product.image;
if(source)return `<img class="restored-bottle${large?' large':''}" src="${source}" alt="${product.name}${product.brand?' de '+product.brand:''}${large&&product.detailImage?', foto de detalle':', imagen reconstruida para catálogo'}" loading="lazy">`;
const scale=large?2:1.5,width=large?80:60,height=large?72:54;
return `<span class="bottle-crop${large?' large':''}" role="img" aria-label="Frasco de ${product.name}" style="background-size:${827*scale}px ${1229*scale}px;background-position:${width/2-product.x*scale}px ${height/2-product.y*scale}px"></span>`;
}
const normalize=text=>text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function render(){
const visible=products.filter(p=>p.category===category&&normalize(`${p.name} ${p.brand}`).includes(normalize(query)));
document.querySelectorAll('[data-tab]').forEach(tab=>{const selected=tab.dataset.tab===category;tab.classList.toggle('active',selected);tab.setAttribute('aria-pressed',String(selected));});
document.getElementById('catalog-count').textContent=`${category} · ${visible.length} ${visible.length===1?'fragancia':'fragancias'}`;
catalogSection.dataset.collection=category;
const grid=document.getElementById('product-grid');
if(!visible.length){
grid.innerHTML='<div class="empty-catalog"><span>⌕</span><h3>No encontramos esa fragancia.</h3><p>Probá con otro nombre o buscá en otra colección.</p><button class="reset-search">Limpiar búsqueda</button></div>';
grid.querySelector('button').addEventListener('click',()=>{query='';document.getElementById('perfume-search').value='';render();});
}else{
grid.innerHTML=visible.map(p=>`<article class="product-card"><div class="product-image ${p.category==='Unisex'?'shared':''}"><span class="product-category">${p.category}</span>${bottle(p)}<span class="product-star" aria-hidden="true">✧</span></div><div class="product-info"><p class="product-reference-label">Inspirada en</p><p class="product-brand">${p.brand}</p><h3>${p.name}</h3><button data-product="${p.id}" aria-label="Ver detalle de ${p.name}">Ver fragancia <span>↗</span></button></div></article>`).join('');
grid.querySelectorAll('[data-product]').forEach(button=>button.addEventListener('click',()=>openProduct(Number(button.dataset.product))));
}
}
function openProduct(id){
const p=products.find(product=>product.id===id);
dialog.innerHTML=window.renderRomaDetails(p,(window.ROMA_DETAILS||{})[p.id]);
dialog.setAttribute('aria-labelledby','perfume-detail-title');
dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.querySelector('.dialog-back').addEventListener('click',()=>dialog.close());
dialog.showModal();
}
dialog.addEventListener('pointerdown',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();}});
function selectCategory(value){category=value;query='';document.getElementById('perfume-search').value='';render();}
document.querySelectorAll('[data-tab]').forEach(tab=>tab.addEventListener('click',()=>selectCategory(tab.dataset.tab)));
document.querySelectorAll('[data-category]').forEach(card=>card.addEventListener('click',()=>selectCategory(card.dataset.category)));
document.getElementById('perfume-search').addEventListener('input',event=>{query=event.target.value;render();});
document.getElementById('year').textContent=new Date().getFullYear();
render();









