(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{KcLm:function(t,n,o){"use strict";o.r(n),o.d(n,"DownloadModule",(function(){return y}));var e=o("tyNb"),i=o("mrSG"),c=o("cExE"),a=o("d8ZE"),d=o("AytR"),r=o("fXoL"),g=o("tk/3");let l=(()=>{class t{constructor(t){this.http=t}getList(){return this.http.post(`${d.a.baseUrl}/download/list`,{}).toPromise()}cancelDownload(t){return this.http.post(`${d.a.baseUrl}/download/cancel`,{id:t})}}return t.\u0275fac=function(n){return new(n||t)(r.Tb(g.b))},t.\u0275prov=r.Gb({token:t,factory:t.\u0275fac}),t})();var s=o("73Ib"),m=o("ofXK");const _=["dialogElement"];function b(t,n){1&t&&(r.Pb(0,"div",12),r.Pb(1,"span"),r.ic(2,"\u0641\u06cc\u0644\u0645\u06cc \u067e\u06cc\u062f\u0627 \u0646\u0634\u062f!!"),r.Ob(),r.Ob())}function p(t,n){if(1&t&&(r.Nb(0),r.Pb(1,"a",24),r.Pb(2,"button",25),r.ic(3,"Subtitle"),r.Ob(),r.Ob(),r.Mb()),2&t){const t=r.Zb(2).$implicit,n=r.Zb(2);r.zb(1),r.ac("href",n.baseUrl+t.subtitle,r.ec)}}function f(t,n){if(1&t&&(r.Nb(0),r.Pb(1,"a",24),r.Pb(2,"button",25),r.ic(3,"Movie"),r.Ob(),r.Ob(),r.hc(4,p,4,1,"ng-container",22),r.Mb()),2&t){const t=r.Zb().$implicit,n=r.Zb(2);r.zb(1),r.ac("href",n.baseUrl+t.movie,r.ec),r.zb(3),r.ac("ngIf",t.subtitle)}}function O(t,n){if(1&t){const t=r.Qb();r.Nb(0),r.Pb(1,"button",26),r.Xb("click",(function(){r.dc(t);const n=r.Zb().index;return r.Zb(2).openDialog(n)})),r.ic(2,"Cancel"),r.Ob(),r.Mb()}if(2&t){const t=r.Zb().$implicit;r.zb(1),r.ac("disabled",t.deleted)}}function P(t,n){if(1&t&&(r.Pb(0,"div",27),r.Pb(1,"div",28),r.Pb(2,"span"),r.ic(3),r.Ob(),r.Ob(),r.Ob()),2&t){const t=r.Zb().$implicit;r.zb(1),r.gc("width",t.progress+"%"),r.zb(2),r.jc(t.progress+"%")}}function h(t,n){if(1&t&&(r.Pb(0,"div",15),r.Pb(1,"div",16),r.Lb(2,"img",17),r.Ob(),r.Pb(3,"div",18),r.Pb(4,"div",19),r.Pb(5,"span"),r.ic(6),r.Ob(),r.Ob(),r.Pb(7,"div",20),r.Pb(8,"span"),r.ic(9),r.Ob(),r.Pb(10,"span"),r.ic(11,"\xa0"),r.Ob(),r.Pb(12,"span"),r.ic(13),r.Ob(),r.Ob(),r.Pb(14,"div",21),r.hc(15,f,5,2,"ng-container",22),r.hc(16,O,3,1,"ng-container",22),r.Ob(),r.hc(17,P,4,3,"div",23),r.Ob(),r.Ob()),2&t){const t=n.$implicit;r.Bb("disable",t.deleted),r.zb(2),r.ac("src",t.image,r.ec),r.zb(4),r.jc(t.title),r.zb(3),r.jc(t.quality),r.zb(4),r.jc(t.resolution),r.zb(2),r.ac("ngIf",100===t.progress),r.zb(1),r.ac("ngIf",100!==t.progress),r.zb(1),r.ac("ngIf",100!==t.progress)}}function M(t,n){if(1&t&&(r.Pb(0,"div",13),r.hc(1,h,18,9,"div",14),r.Ob()),2&t){const t=r.Zb();r.zb(1),r.ac("ngForOf",t.items)}}const C=[{path:"",component:(()=>{class t{constructor(t,n){this.downloadService=t,this.changeDetectorRef=n,this.items=[],this.selectedIndex=-1,this.baseUrl=d.a.baseUrl}set dialogElement(t){this.dialog=new c.a(t.nativeElement),this.changeDetectorRef.detectChanges()}ngOnInit(){const t=()=>Object(i.b)(this,void 0,void 0,(function*(){try{const t=yield this.downloadService.getList();t.success&&t.data.forEach(t=>{const n=this.items.findIndex(n=>n.id===t.id);n>-1?this.items[n].progress=t.progress:this.items.push(t)})}catch(t){a.a.e("DownloadService#getList",t)}}));t(),this.timeout=setInterval(t,2e3)}ngOnDestroy(){clearInterval(this.timeout)}openDialog(t){this.selectedIndex=t,this.dialog.open()}closeDialog(){this.dialog.close()}cancelDownload(){this.closeDialog();const t=this.items[this.selectedIndex];t.deleted=!0,this.downloadService.cancelDownload(t.id).subscribe({next:t=>{a.a.i("DownloadService#cancelDownload",t)},error:t=>{a.a.e("DownloadService#cancelDownload",t)}})}}return t.\u0275fac=function(n){return new(n||t)(r.Kb(l),r.Kb(r.h))},t.\u0275cmp=r.Eb({type:t,selectors:[["app-download"]],viewQuery:function(t,n){var o;1&t&&r.lc(_,!0),2&t&&r.bc(o=r.Yb())&&(n.dialogElement=o.first)},decls:26,vars:3,consts:[[1,"body"],["class","no-items-found",4,"ngIf"],["class","container",4,"ngIf"],[1,"mdc-dialog"],["dialogElement",""],[1,"mdc-dialog__container"],["role","alertdialog",1,"mdc-dialog__surface"],["id","my-dialog-title",1,"mdc-dialog__title"],["id","my-dialog-content",1,"mdc-dialog__content"],[1,"mdc-dialog__actions"],["type","button",1,"btn",3,"click"],[1,"mdc-dialog__scrim"],[1,"no-items-found"],[1,"container"],["class","row",3,"disable",4,"ngFor","ngForOf"],[1,"row"],[1,"col-2","text-center"],["alt","Movie image",1,"image",3,"src"],[1,"col-10","text-right"],[1,"title","vertical-padding"],[1,"quality","vertical-padding"],[1,"dl-box","vertical-padding"],[4,"ngIf"],["class","progress",4,"ngIf"],["target","_blank",3,"href"],["type","button",1,"btn","btn-success"],["type","button",1,"btn","btn-danger",3,"disabled","click"],[1,"progress"],["role","progressbar",1,"progress-bar","bg-success"]],template:function(t,n){1&t&&(r.Lb(0,"app-toolbar"),r.Pb(1,"div",0),r.hc(2,b,3,0,"div",1),r.hc(3,M,2,1,"div",2),r.Ob(),r.Pb(4,"div",3,4),r.Pb(6,"div",5),r.Pb(7,"div",6),r.Pb(8,"h2",7),r.Pb(9,"span"),r.ic(10,"\u0645\u0637\u0645\u0626\u0646 \u0647\u0633\u062a\u06cc\u062f\u061f"),r.Ob(),r.Ob(),r.Pb(11,"div",8),r.Pb(12,"span"),r.ic(13,"\u0622\u06cc\u0627 \u0645\u06cc\u062e\u0648\u0627\u0647\u06cc\u062f \u062f\u0627\u0646\u0644\u0648\u062f"),r.Ob(),r.Pb(14,"span"),r.ic(15),r.Ob(),r.Pb(16,"span"),r.ic(17,"\u0645\u062a\u0648\u0642\u0641 \u0648 \u062d\u0630\u0641 \u0634\u0648\u062f\u061f"),r.Ob(),r.Ob(),r.Pb(18,"footer",9),r.Pb(19,"button",10),r.Xb("click",(function(){return n.closeDialog()})),r.Pb(20,"span"),r.ic(21,"\u062e\u06cc\u0631"),r.Ob(),r.Ob(),r.Pb(22,"button",10),r.Xb("click",(function(){return n.cancelDownload()})),r.Pb(23,"span"),r.ic(24,"\u0628\u0644\u0647"),r.Ob(),r.Ob(),r.Ob(),r.Ob(),r.Ob(),r.Lb(25,"div",11),r.Ob()),2&t&&(r.zb(2),r.ac("ngIf",0===n.items.length),r.zb(1),r.ac("ngIf",n.items.length>0),r.zb(12),r.kc('\xa0"',null==n.items[n.selectedIndex]?null:n.items[n.selectedIndex].title,'"\xa0'))},directives:[s.a,m.i,m.h],styles:['.mdc-elevation-overlay[_ngcontent-%COMP%]{position:absolute;border-radius:inherit;opacity:0;pointer-events:none;transition:opacity .28s cubic-bezier(.4,0,.2,1);background-color:#fff}.mdc-dialog[_ngcontent-%COMP%], .mdc-dialog__scrim[_ngcontent-%COMP%]{position:fixed;top:0;left:0;align-items:center;justify-content:center;box-sizing:border-box;width:100%;height:100%}.mdc-dialog[_ngcontent-%COMP%]{display:none;z-index:7}.mdc-dialog[_ngcontent-%COMP%]   .mdc-dialog__surface[_ngcontent-%COMP%]{background-color:#fff;background-color:var(--mdc-theme-surface,#fff)}.mdc-dialog[_ngcontent-%COMP%]   .mdc-dialog__scrim[_ngcontent-%COMP%]{background-color:rgba(0,0,0,.32)}.mdc-dialog[_ngcontent-%COMP%]   .mdc-dialog__title[_ngcontent-%COMP%]{color:rgba(0,0,0,.87)}.mdc-dialog[_ngcontent-%COMP%]   .mdc-dialog__content[_ngcontent-%COMP%]{color:rgba(0,0,0,.6)}.mdc-dialog.mdc-dialog--scrollable[_ngcontent-%COMP%]   .mdc-dialog__actions[_ngcontent-%COMP%], .mdc-dialog.mdc-dialog--scrollable[_ngcontent-%COMP%]   .mdc-dialog__title[_ngcontent-%COMP%]{border-color:rgba(0,0,0,.12)}.mdc-dialog[_ngcontent-%COMP%]   .mdc-dialog__surface[_ngcontent-%COMP%]{min-width:280px}@media (max-width:592px){.mdc-dialog[_ngcontent-%COMP%]   .mdc-dialog__surface[_ngcontent-%COMP%]{max-width:calc(100vw - 32px)}}@media (min-width:592px){.mdc-dialog[_ngcontent-%COMP%]   .mdc-dialog__surface[_ngcontent-%COMP%]{max-width:560px}}.mdc-dialog[_ngcontent-%COMP%]   .mdc-dialog__surface[_ngcontent-%COMP%]{max-height:calc(100% - 32px)}.mdc-dialog[_ngcontent-%COMP%]   .mdc-dialog__surface[_ngcontent-%COMP%]{border-radius:4px}.mdc-dialog__scrim[_ngcontent-%COMP%]{opacity:0;z-index:-1}.mdc-dialog__container[_ngcontent-%COMP%]{display:flex;flex-direction:row;align-items:center;justify-content:space-around;box-sizing:border-box;height:100%;transform:scale(.8);opacity:0;pointer-events:none}.mdc-dialog__surface[_ngcontent-%COMP%]{position:relative;box-shadow:0 11px 15px -7px rgba(0,0,0,.2),0 24px 38px 3px rgba(0,0,0,.14),0 9px 46px 8px rgba(0,0,0,.12);display:flex;flex-direction:column;flex-grow:0;flex-shrink:0;box-sizing:border-box;max-width:100%;max-height:100%;pointer-events:auto;overflow-y:auto}.mdc-dialog__surface[_ngcontent-%COMP%]   .mdc-elevation-overlay[_ngcontent-%COMP%]{width:100%;height:100%;top:0;left:0}.mdc-dialog[dir=rtl][_ngcontent-%COMP%]   .mdc-dialog__surface[_ngcontent-%COMP%], [dir=rtl][_ngcontent-%COMP%]   .mdc-dialog[_ngcontent-%COMP%]   .mdc-dialog__surface[_ngcontent-%COMP%]{text-align:right}.mdc-dialog__title[_ngcontent-%COMP%]{line-height:normal;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto,sans-serif;font-family:var(--mdc-typography-headline6-font-family,var(--mdc-typography-font-family,Roboto,sans-serif));font-size:1.25rem;font-size:var(--mdc-typography-headline6-font-size,1.25rem);line-height:2rem;line-height:var(--mdc-typography-headline6-line-height,2rem);font-weight:500;font-weight:var(--mdc-typography-headline6-font-weight,500);letter-spacing:.0125em;letter-spacing:var(--mdc-typography-headline6-letter-spacing,.0125em);text-decoration:inherit;-webkit-text-decoration:var(--mdc-typography-headline6-text-decoration,inherit);text-decoration:var(--mdc-typography-headline6-text-decoration,inherit);text-transform:inherit;text-transform:var(--mdc-typography-headline6-text-transform,inherit);display:block;position:relative;flex-shrink:0;box-sizing:border-box;margin:0;padding:0 24px 9px;border-bottom:1px solid transparent}.mdc-dialog__title[_ngcontent-%COMP%]:before{display:inline-block;width:0;height:40px;content:"";vertical-align:0}.mdc-dialog[dir=rtl][_ngcontent-%COMP%]   .mdc-dialog__title[_ngcontent-%COMP%], [dir=rtl][_ngcontent-%COMP%]   .mdc-dialog[_ngcontent-%COMP%]   .mdc-dialog__title[_ngcontent-%COMP%]{text-align:right}.mdc-dialog--scrollable[_ngcontent-%COMP%]   .mdc-dialog__title[_ngcontent-%COMP%]{padding-bottom:15px}.mdc-dialog__content[_ngcontent-%COMP%]{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto,sans-serif;font-family:var(--mdc-typography-body1-font-family,var(--mdc-typography-font-family,Roboto,sans-serif));font-size:1rem;font-size:var(--mdc-typography-body1-font-size,1rem);line-height:1.5rem;line-height:var(--mdc-typography-body1-line-height,1.5rem);font-weight:400;font-weight:var(--mdc-typography-body1-font-weight,400);letter-spacing:.03125em;letter-spacing:var(--mdc-typography-body1-letter-spacing,.03125em);text-decoration:inherit;-webkit-text-decoration:var(--mdc-typography-body1-text-decoration,inherit);text-decoration:var(--mdc-typography-body1-text-decoration,inherit);text-transform:inherit;text-transform:var(--mdc-typography-body1-text-transform,inherit);flex-grow:1;box-sizing:border-box;margin:0;padding:20px 24px;overflow:auto;-webkit-overflow-scrolling:touch}.mdc-dialog__content[_ngcontent-%COMP%] > [_ngcontent-%COMP%]:first-child{margin-top:0}.mdc-dialog__content[_ngcontent-%COMP%] > [_ngcontent-%COMP%]:last-child{margin-bottom:0}.mdc-dialog__title[_ngcontent-%COMP%] + .mdc-dialog__content[_ngcontent-%COMP%]{padding-top:0}.mdc-dialog--scrollable[_ngcontent-%COMP%]   .mdc-dialog__content[_ngcontent-%COMP%]{padding-top:8px;padding-bottom:8px}.mdc-dialog__content[_ngcontent-%COMP%]   .mdc-list[_ngcontent-%COMP%]:first-child:last-child{padding:6px 0 0}.mdc-dialog--scrollable[_ngcontent-%COMP%]   .mdc-dialog__content[_ngcontent-%COMP%]   .mdc-list[_ngcontent-%COMP%]:first-child:last-child{padding:0}.mdc-dialog__actions[_ngcontent-%COMP%]{display:flex;position:relative;flex-shrink:0;flex-wrap:wrap;align-items:center;justify-content:flex-end;box-sizing:border-box;min-height:52px;margin:0;padding:8px;border-top:1px solid transparent}.mdc-dialog--stacked[_ngcontent-%COMP%]   .mdc-dialog__actions[_ngcontent-%COMP%]{flex-direction:column;align-items:flex-end}.mdc-dialog__button[_ngcontent-%COMP%]{margin-left:8px;margin-right:0;max-width:100%;text-align:right}.mdc-dialog__button[dir=rtl][_ngcontent-%COMP%], [dir=rtl][_ngcontent-%COMP%]   .mdc-dialog__button[_ngcontent-%COMP%]{margin-left:0;margin-right:8px}.mdc-dialog__button[_ngcontent-%COMP%]:first-child, .mdc-dialog__button[_ngcontent-%COMP%]:first-child[dir=rtl], [dir=rtl][_ngcontent-%COMP%]   .mdc-dialog__button[_ngcontent-%COMP%]:first-child{margin-left:0;margin-right:0}.mdc-dialog[dir=rtl][_ngcontent-%COMP%]   .mdc-dialog__button[_ngcontent-%COMP%], [dir=rtl][_ngcontent-%COMP%]   .mdc-dialog[_ngcontent-%COMP%]   .mdc-dialog__button[_ngcontent-%COMP%]{text-align:left}.mdc-dialog--stacked[_ngcontent-%COMP%]   .mdc-dialog__button[_ngcontent-%COMP%]:not(:first-child){margin-top:12px}.mdc-dialog--closing[_ngcontent-%COMP%], .mdc-dialog--open[_ngcontent-%COMP%], .mdc-dialog--opening[_ngcontent-%COMP%]{display:flex}.mdc-dialog--opening[_ngcontent-%COMP%]   .mdc-dialog__scrim[_ngcontent-%COMP%]{transition:opacity .15s linear}.mdc-dialog--opening[_ngcontent-%COMP%]   .mdc-dialog__container[_ngcontent-%COMP%]{transition:opacity 75ms linear,transform .15s cubic-bezier(0,0,.2,1) 0ms}.mdc-dialog--closing[_ngcontent-%COMP%]   .mdc-dialog__container[_ngcontent-%COMP%], .mdc-dialog--closing[_ngcontent-%COMP%]   .mdc-dialog__scrim[_ngcontent-%COMP%]{transition:opacity 75ms linear}.mdc-dialog--closing[_ngcontent-%COMP%]   .mdc-dialog__container[_ngcontent-%COMP%]{transform:scale(1)}.mdc-dialog--open[_ngcontent-%COMP%]   .mdc-dialog__scrim[_ngcontent-%COMP%]{opacity:1}.mdc-dialog--open[_ngcontent-%COMP%]   .mdc-dialog__container[_ngcontent-%COMP%]{transform:scale(1);opacity:1}.mdc-dialog-scroll-lock[_ngcontent-%COMP%]{overflow:hidden}.mdc-dialog[_ngcontent-%COMP%]{z-index:12}.mdc-dialog__surface[_ngcontent-%COMP%]{background-color:#262626!important}.mdc-dialog__title[_ngcontent-%COMP%]{font-size:1.1rem;font-weight:600}.mdc-dialog__content[_ngcontent-%COMP%], .mdc-dialog__title[_ngcontent-%COMP%]{font-family:IranSans,serif;color:#fff!important}.mdc-dialog__content[_ngcontent-%COMP%]{font-size:.9rem}.mdc-dialog__actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{margin-left:7px;color:#fff}.mdc-dialog__scrim[_ngcontent-%COMP%]{background-color:rgba(0,0,0,.5)!important}.no-items-found[_ngcontent-%COMP%]{position:absolute;right:0;left:0;top:45%;width:100%;text-align:center}.container[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]{min-height:215px;margin-top:8px;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid hsla(0,0%,100%,.5)}.container[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]:first-child{margin-top:15px}.container[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]:last-child{margin-bottom:15px}.container[_ngcontent-%COMP%]   .row.disable[_ngcontent-%COMP%]{opacity:.5}.container[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]:last-child{padding-bottom:0;border-bottom:unset}.container[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]   .image[_ngcontent-%COMP%]{max-width:100%;border-radius:5px}.container[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}.container[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]   .quality[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:first-child{color:#fdc13c}.container[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]   .dl-box[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{margin-left:5px}.container[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]   .dl-box[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:last-child{margin-left:0}.container[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]   .dl-box[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{min-width:100px}.container[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]   .progress[_ngcontent-%COMP%]{margin-top:15px;direction:ltr}.container[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]   .progress[_ngcontent-%COMP%]   .progress-bar[_ngcontent-%COMP%]{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}']}),t})()}];let x=(()=>{class t{}return t.\u0275mod=r.Ib({type:t}),t.\u0275inj=r.Hb({factory:function(n){return new(n||t)},imports:[[e.g.forChild(C)],e.g]}),t})();var u=o("PCNd");let y=(()=>{class t{}return t.\u0275mod=r.Ib({type:t}),t.\u0275inj=r.Hb({factory:function(n){return new(n||t)},providers:[l],imports:[[u.a,x]]}),t})()}}]);