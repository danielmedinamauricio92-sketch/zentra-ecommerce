(() => {
 const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
 const packagingColors=['#9b355e','#7546a1','#16584f','#a14d22','#273f74','#71364e','#176a88','#855025','#4b4777','#a33243','#3e6351'];
 const bottleShapes=[
  ['8% 8% 15% 15%',88,140],['42% 42% 23% 23%',106,117],
  ['14% 14% 35% 35%',89,151],['46% 46% 46% 46%',110,111],
  ['9% 9% 9% 9%',112,112],['30% 30% 10% 10%',73,149],
  ['8% 8% 46% 46%',104,125],['40% 40% 12% 12%',82,145]
 ];
 const capShapes=['4px','50% 50% 6px 6px','12px 12px 4px 4px','45%','6px 6px 16px 16px','18px 18px 2px 2px','8px 20px 8px 20px'];
 function renderPackaging(product) {
  const index=Number(product.id)-1;
  const [shape,width,height]=bottleShapes[index%bottleShapes.length];
  const color=packagingColors[index%packagingColors.length];
  const cap=capShapes[index%capShapes.length];
  const boxColor=packagingColors[(index*3+4)%packagingColors.length];
  const borderStyle=['solid','double','dashed'][Math.floor(index/8)%3];
  const style=`--roma-glass:${color};--roma-carton:${boxColor};--roma-shape:${shape};--roma-width:${width}px;--roma-height:${height}px;--roma-cap:${cap};--roma-frame:${borderStyle}`;
  return `<div class="roma-packaging" style="${style}" role="img" aria-label="Diseño ilustrativo de frasco y caja Nova Roma para ${escape(product.name)}"><div class="roma-carton" aria-hidden="true"><span>NOVA ROMA</span><small>${escape(product.name)}</small></div><div class="roma-bottle" aria-hidden="true"><div class="roma-cap"></div><div class="roma-glass"><span>NOVA ROMA</span></div></div></div>`;
 }
 const list=values=>values.map(value=>`<span>${escape(value)}</span>`).join('');
 window.renderRomaDetails=(product,profile={})=>{
  const notes=profile.notes||{};
  const groups=[['Salida','01',notes.top],['Corazón','02',notes.heart],['Fondo','03',notes.base]].filter(([, ,values])=>values?.length);
  const keyNotes=notes.key||[];
  const notesHTML=groups.length?`<div class="note-pyramid">${groups.map(([label,num,values])=>`<section class="note-level"><span class="note-index">${num}</span><div><h4>${label}</h4><div class="note-tags">${list(values)}</div></div></section>`).join('')}</div>`:keyNotes.length?`<div class="key-notes note-tags">${list(keyNotes)}</div>`:'<p class="profile-pending">Estamos completando el perfil de esta referencia.</p>';
  const sources=(profile.sources||[]).filter(source=>/^https:\/\//.test(source.url));
  return `<button class="dialog-close" aria-label="Cerrar detalle">×</button>
   <div class="detail-shell" data-category="${escape(product.category)}">
    <div class="detail-visual detail-comparison">
     <figure><div class="detail-original"><img src="${escape(product.image)}" alt="Frasco de referencia de ${escape(product.name)}"></div><figcaption><strong>Original de referencia</strong><span>${escape(product.brand||product.name)}</span></figcaption></figure>
     <figure>${renderPackaging(product)}<figcaption><strong>Versión Nova Roma</strong><span>Diseño de envase ilustrativo</span></figcaption></figure>
    </div>
    <div class="detail-content"><p class="eyebrow">ROMA BY BARBIES · ${escape(product.category)}</p><span class="detail-intro">Inspirada en</span><h2 id="perfume-detail-title">${escape(product.name)}</h2><p class="detail-reference-brand">${escape(product.brand)}</p><div class="detail-pills"><span>55 ml</span><span>Fragancia inspirada</span></div>
    <p class="detail-description">${escape(profile.description||'Una nueva forma de llevar tu esencia. Descubrí nuestra interpretación de esta fragancia.')}</p>
    ${profile.family?`<section class="olfactory-family"><span aria-hidden="true">✧</span><div><p>FAMILIA OLFATIVA DE REFERENCIA</p><h3>${escape(profile.family)}</h3></div></section>`:''}
    ${groups.length||keyNotes.length?`<section class="detail-notes"><div class="detail-section-title"><span>EL RECORRIDO DEL AROMA</span><h3>${groups.length?'Notas olfativas':'Notas destacadas'}</h3></div>${notesHTML}</section>`:''}
    ${(profile.occasions||[]).length?`<section class="detail-occasions"><div class="detail-section-title"><span>ENCONTRÁ TU MOMENTO</span><h3>Sugerencias de uso</h3></div><div class="occasion-tags">${list(profile.occasions)}</div></section>`:''}
    <details class="reference-disclosure"><summary>Sobre esta inspiración</summary><p>La familia y las notas describen la fragancia original de referencia. Roma by Barbies ofrece una versión inspirada, en su propia presentación de 55 ml.</p>${sources.map(source=>`<a href="${escape(source.url)}" target="_blank" rel="noopener noreferrer">${escape(source.title||'Conocé la referencia')} ↗</a>`).join('')}</details>
    <a class="button" href="https://novaromabybarbies2.mitiendanube.com/" target="_blank" rel="noopener noreferrer">Consultar en la tienda ↗</a><button class="dialog-back">Seguir explorando <span>↗</span></button></div></div>`;
 };
})();
