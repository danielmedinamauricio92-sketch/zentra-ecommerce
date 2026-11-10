(() => {
 const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
 const categoryImage={Femeninas:'femeninas',Masculinas:'masculinas',Unisex:'unisex'};
 const list=values=>values.map(value=>`<span>${escape(value)}</span>`).join('');
 window.renderRomaDetails=(product,profile={})=>{
  const image='assets/presentacion-nova-roma.png';
  const notes=profile.notes||{};
  const groups=[['Salida','01',notes.top],['Corazón','02',notes.heart],['Fondo','03',notes.base]].filter(([, ,values])=>values?.length);
  const keyNotes=notes.key||[];
  const notesHTML=groups.length?`<div class="note-pyramid">${groups.map(([label,num,values])=>`<section class="note-level"><span class="note-index">${num}</span><div><h4>${label}</h4><div class="note-tags">${list(values)}</div></div></section>`).join('')}</div>`:keyNotes.length?`<div class="key-notes note-tags">${list(keyNotes)}</div>`:'<p class="profile-pending">Estamos completando el perfil de esta referencia.</p>';
  const sources=(profile.sources||[]).filter(source=>/^https:\/\//.test(source.url));
  return `<button class="dialog-close" aria-label="Cerrar detalle">×</button>
   <div class="detail-shell" data-category="${escape(product.category)}">
    <div class="detail-visual"><span class="detail-edition">LA ESENCIA ROMA / ${String(product.id).padStart(3,'0')}</span><img class="detail-hero" src="${image}" alt="Presentación ilustrativa de Nova Roma Parfums: frasco y caja propios de la marca" loading="eager"><span class="detail-image-note">Presentación Nova Roma · Imagen ilustrativa</span><div class="inspiration-reference"><div><span>INSPIRACIÓN OLFATIVA</span><p>${escape(product.name)}</p><small>${escape(product.brand)}</small></div></div></div>
    <div class="detail-content"><p class="eyebrow">ROMA BY BARBIES · ${escape(product.category)}</p><span class="detail-intro">Inspirada en</span><h2 id="perfume-detail-title">${escape(product.name)}</h2><p class="detail-reference-brand">${escape(product.brand)}</p><div class="detail-pills"><span>55 ml</span><span>Fragancia inspirada</span></div>
    <p class="detail-description">${escape(profile.description||'Una nueva forma de llevar tu esencia. Descubrí nuestra interpretación de esta fragancia.')}</p>
    ${profile.family?`<section class="olfactory-family"><span aria-hidden="true">✧</span><div><p>FAMILIA OLFATIVA DE REFERENCIA</p><h3>${escape(profile.family)}</h3></div></section>`:''}
    ${groups.length||keyNotes.length?`<section class="detail-notes"><div class="detail-section-title"><span>EL RECORRIDO DEL AROMA</span><h3>${groups.length?'Notas olfativas':'Notas destacadas'}</h3></div>${notesHTML}</section>`:''}
    ${(profile.occasions||[]).length?`<section class="detail-occasions"><div class="detail-section-title"><span>ENCONTRÁ TU MOMENTO</span><h3>Sugerencias de uso</h3></div><div class="occasion-tags">${list(profile.occasions)}</div></section>`:''}
    <details class="reference-disclosure"><summary>Sobre esta inspiración</summary><p>La familia y las notas describen la fragancia original de referencia. Roma by Barbies ofrece una versión inspirada, en su propia presentación de 55 ml.</p>${sources.map(source=>`<a href="${escape(source.url)}" target="_blank" rel="noopener noreferrer">${escape(source.title||'Conocé la referencia')} ↗</a>`).join('')}</details>
    <a class="button" href="https://novaromabybarbies2.mitiendanube.com/" target="_blank" rel="noopener noreferrer">Consultar en la tienda ↗</a><button class="dialog-back">Seguir explorando <span>↗</span></button></div></div>`;
 };
})();
