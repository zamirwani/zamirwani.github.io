import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sections,fields,lists,teams,validate,blank} from '../assets/schema.mjs';

test('Editor connects, saves Unicode, keeps edits after conflicts, and disconnects',async()=>{
 const registry=new Map();
 class Element{
  constructor(tag){this.tagName=tag.toUpperCase();this.children=[];this.events={};this.value='';this.textContent='';this.hidden=false;this.disabled=false;}
  set id(value){this._id=value;registry.set(value,this);}get id(){return this._id;}
  append(...items){this.children.push(...items);}replaceChildren(...items){this.children=items;}
  addEventListener(name,fn){(this.events[name]??=[]).push(fn);}setAttribute(){}focus(){}
  async emit(name,event={}){for(const fn of this.events[name]||[])await fn(event);}
 }
 const document={getElementById:id=>registry.get(id),createElement:tag=>new Element(tag)};
 for(const id of ['save','save-state','notice','editor-fields','disconnect','section-nav','connect-form','owner','repo','branch','token','connection','workspace','repository-name','build-status','editor']){const n=new Element('div');n.id=id;}
 const original=JSON.parse(readFileSync('data/content.json','utf8'));let fileSha='sha1',stored=structuredClone(original),conflict=false;const writes=[];
 const fakeFetch=async(url,options={})=>{
  if(url==='../site.config.json')return {json:async()=>({owner:'example',repo:'example.github.io',branch:'main'})};
  assert.match(url,/^https:\/\/api.github.com\/repos\/example\/example.github.io\/contents\/data\/content.json/);
  assert.equal(options.headers.Authorization,'Bearer test-only-placeholder');
  if(options.method==='PUT'){
   const body=JSON.parse(options.body);writes.push(body);
   if(conflict)return {ok:false,status:409,json:async()=>({})};
   assert.equal(body.sha,fileSha);stored=JSON.parse(Buffer.from(body.content,'base64').toString('utf8'));fileSha='sha2';
   return {ok:true,json:async()=>({content:{sha:fileSha}})};
  }
  return {ok:true,json:async()=>({sha:fileSha,encoding:'base64',content:Buffer.from(JSON.stringify(stored)).toString('base64')})};
 };
 const source=readFileSync('assets/admin.mjs','utf8').replace(/^import .*;\n/,'');
 const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
 await new AsyncFunction('sections','fields','lists','teams','validate','blank','document','window','fetch','confirm',source)(sections,fields,lists,teams,validate,blank,document,{addEventListener(){}},fakeFetch,()=>true);
 registry.get('token').value='test-only-placeholder';
 await registry.get('connect-form').emit('submit',{preventDefault(){},submitter:new Element('button')});
 assert.equal(registry.get('workspace').hidden,false);assert.equal(registry.get('token').value,'');
 assert.ok(registry.get('team-phd'));assert.ok(registry.get('team-masters'));assert.ok(registry.get('team-jrf'));
 const name=registry.get('group-main-title');name.value='RF & Microwave Lab@KU — فريق';await name.emit('input');
 assert.equal(registry.get('save').disabled,false);await registry.get('save').emit('click');
 assert.equal(stored.group.title,name.value);assert.doesNotMatch(JSON.stringify(writes),/test-only-placeholder/);assert.match(registry.get('notice').textContent,/Publication is pending/);
 name.value='Unsaved edit';await name.emit('input');conflict=true;await registry.get('save').emit('click');
 assert.match(registry.get('notice').textContent,/content changed/);assert.equal(name.value,'Unsaved edit');assert.equal(registry.get('save').disabled,false);
 await registry.get('disconnect').emit('click');assert.equal(registry.get('workspace').hidden,true);assert.match(registry.get('notice').textContent,/token has been cleared/);
});
