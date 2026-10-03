export const schema={
 homeSections:{list:true,fields:["title","section","text"]},
 bannerImage:{list:false,fields:["image","imageAlt","caption"]},
 updates:{list:true,fields:["date","title","description","page","url"]},
  "profile": {
    "list": false,
    "fields": [
      "name",
      "role",
      "department",
      "institution",
      "portrait",
      "email",
      "location"
    ]
  },
  "appearance": {
    "list": false,
    "fields": [
      "banner",
      "accent",
      "background"
    ]
  },
  "headings": {
    "list": false,
    "fields": [
      "home",
      "research",
      "publications",
      "education",
      "group",
      "teaching",
      "contact",
      "overview",
      "updates",
      "interests",
      "opportunities",
      "gallery",
      "project",
      "papers",
      "books",
      "patents",
      "qualifications",
      "experience",
      "awards",
      "service",
      "courses",
      "teachingInterests",
      "people",
      "links"
    ]
  },
  "home": {
    "list": false,
    "fields": [
      "overview",
      "opportunities"
    ]
  },
  "links": {
    "list": true,
    "fields": [
      "label",
      "icon",
      "iconImage",
      "url"
    ]
  },
  "research": {
    "list": true,
    "fields": [
      "title",
      "description"
    ]
  },
  "gallery": {
    "list": true,
    "fields": [
      "title",
      "description",
      "image",
      "imageAlt",
      "caption",
      "url",
      "sourceLabel",
      "sourceUrl"
    ]
  },
  "projects": {
    "list": true,
    "fields": [
      "title",
      "description",
      "funder",
      "scheme",
      "role",
      "period",
      "amount",
      "reference", "showDescription", "showFunder", "showScheme", "showRole", "showPeriod", "showAmount", "showReference"
    ]
  },
  "publications": {
    "list": true,
    "fields": [
      "citation",
      "url"
    ]
  },
  "books": {
    "list": true,
    "fields": [
      "citation",
      "url"
    ]
  },
  "patents": {
    "list": true,
    "fields": [
      "text"
    ]
  },
  "education": {
    "list": true,
    "fields": [
      "year",
      "title",
      "description"
    ]
  },
  "experience": {
    "list": true,
    "fields": [
      "year",
      "title",
      "description"
    ]
  },
  "awards": {
    "list": true,
    "fields": [
      "text"
    ]
  },
  "biography": {
    "list": false,
    "fields": [
      "intro",
      "service"
    ]
  },
  "group": {
    "list": false,
    "fields": [
      "name",
      "description",
      "enquiries"
    ]
  },
  "members": {
    "list": true,
    "fields": [
      "name",
      "category",
      "role",
      "research",
      "photo",
      "url"
    ]
  },
  "courses": {
    "list": true,
    "fields": [
      "title",
      "description"
    ]
  },
  "teachingInterests": {
    "list": true,
    "fields": [
      "title",
      "description"
    ]
  },
  "contact": {
    "list": false,
    "fields": [
      "intro",
      "address",
      "alumniEmail",
      "alumniEmailLabel",
      "departmentUrl",
      "departmentLabel"
    ]
  }
};

export const titles={homeSections:'Homepage sections',bannerImage:'Homepage banner image',updates:'Page updates',profile:'Profile',appearance:'Colors',headings:'Headings & navigation',home:'Homepage',links:'Academic links',research:'Research areas',gallery:'Research figures',projects:'Funded projects',publications:'Journal papers',books:'Books',patents:'Patents',biography:'Biography & service',education:'Education',experience:'Experience',awards:'Awards & fellowships',group:'Lab introduction',members:'People',courses:'Courses taught',teachingInterests:'Teaching interests',contact:'Contact'};
export function safeUrl(value){if(!value)return '';if(/[\s\\<>"']/.test(value)||value.startsWith('//'))return '';if(/^https?:\/\//i.test(value)){try{return new URL(value).href;}catch{return '';}}try{const decoded=decodeURIComponent(value);if(decoded.split('/').some(s=>s==='..'||s==='.')||decoded.startsWith('/')||decoded.includes('\\'))return '';}catch{return '';}return /^[a-zA-Z0-9_./%-]+$/.test(value)?value:'';}
export function validate(c){if(!c||typeof c!=='object')throw Error('Invalid content');if(c.contact&&c.contact.alumniEmailLabel===undefined)c.contact.alumniEmailLabel='Alumni email';if(!c.projects&&c.project)c.projects=[{...c.project,...Object.fromEntries(['Description','Funder','Scheme','Role','Period','Amount','Reference'].map(k=>['show'+k,true]))}];for(const [section,def] of Object.entries(schema)){const items=def.list?c[section]:[c[section]];if(!Array.isArray(items)||items.length>200)throw Error(section+': invalid list');for(const item of items){if(!item||typeof item!=='object'||Array.isArray(item))throw Error(section+': invalid entry');for(const key of def.fields){if(section==='links'&&key==='iconImage'&&item[key]===undefined)item[key]='';const v=item[key];if(section==='projects'&&key.startsWith('show')){if(typeof v!=='boolean')throw Error('Project visibility must be true or false');continue;}if(typeof v!=='string'||v.length>15000)throw Error(section+' / '+key+': invalid text');if((/url$/i.test(key)||['portrait','photo','image','iconImage'].includes(key))&&v&&!safeUrl(v))throw Error(section+' / '+key+': use an HTTPS URL or local file path');if(/email$/i.test(key)&&v&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))throw Error('Enter a valid email address');if(section==='appearance'&&!/^#[a-f0-9]{6}$/i.test(v))throw Error('Colors must be six-digit hex values');}if(['gallery','bannerImage'].includes(section)&&item.image&&!item.imageAlt.trim())throw Error('Research figures need alternative text');if(section==='updates'&&!['','all','index','research','publications','education','group','teaching','contact'].includes(item.page))throw Error('Update page must be all, index, research, publications, education, group, teaching, or contact');if(section==='members'&&!item.name.trim())throw Error('Each member needs a name');}}if(!c.profile.name.trim())throw Error('Profile name is required');return c;}
