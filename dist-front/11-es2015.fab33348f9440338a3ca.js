(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{X3zk:function(t,e,n){"use strict";n.r(e),n.d(e,"LoginModule",(function(){return h}));var o=n("PCNd"),i=n("tyNb"),s=n("3Pt+"),r=n("d8ZE"),c=n("AytR"),a=n("fXoL"),b=n("8PDw"),p=n("1jTv"),g=n("ofXK");function u(t,e){if(1&t){const t=a.Nb();a.Kb(0),a.Mb(1,"form",4),a.Tb("ngSubmit",(function(){return a.Zb(t),a.Vb().request()})),a.Mb(2,"h1",5),a.fc(3,"\u0627\u06af\u0631 \u062f\u0631 \u0641\u06cc\u0644\u06cc\u0645\u0648 \u062d\u0633\u0627\u0628 \u06a9\u0627\u0631\u0628\u0631\u06cc \u062f\u0627\u0631\u06cc\u062f\u060c \u0648\u0627\u0631\u062f \u0634\u0648\u06cc\u062f:"),a.Lb(),a.Mb(4,"div",6),a.Mb(5,"div",7),a.Mb(6,"span",8),a.fc(7,"@"),a.Lb(),a.Lb(),a.Ib(8,"input",9),a.Lb(),a.Mb(9,"div",10),a.Mb(10,"input",11),a.Tb("input",(function(e){return a.Zb(t),a.Vb().saveLoginOtp(e)})),a.Lb(),a.Mb(11,"label",12),a.fc(12,"\u0648\u0631\u0648\u062f \u0628\u0627 \u067e\u06cc\u0627\u0645\u06a9"),a.Lb(),a.Lb(),a.Mb(13,"button",13),a.fc(14,"\u0648\u0631\u0648\u062f"),a.Lb(),a.Lb(),a.Jb()}if(2&t){const t=a.Vb();a.xb(1),a.Wb("formGroup",t.firstStepForm),a.xb(9),a.Wb("checked",t.otp)}}function m(t,e){if(1&t){const t=a.Nb();a.Kb(0),a.Mb(1,"form",4),a.Tb("ngSubmit",(function(){return a.Zb(t),a.Vb().verify()})),a.Mb(2,"h1",5),a.fc(3),a.Lb(),a.Mb(4,"div",6),a.Mb(5,"div",7),a.Mb(6,"span",8),a.Ib(7,"img",14),a.Lb(),a.Lb(),a.Ib(8,"input",15),a.Lb(),a.Mb(9,"button",13),a.fc(10,"\u0627\u062f\u0627\u0645\u0647"),a.Lb(),a.Mb(11,"div",16),a.Mb(12,"span",17),a.Tb("click",(function(){return a.Zb(t),a.Vb().firstStep()})),a.fc(13,"\u0628\u0627\u0632\u06af\u0634\u062a"),a.Lb(),a.Lb(),a.Lb(),a.Jb()}if(2&t){const t=a.Vb();a.xb(1),a.Wb("formGroup",t.secondStepForm),a.xb(2),a.hc(" ",t.otp?"\u06a9\u062f \u0641\u0631\u0633\u062a\u0627\u062f\u0647 \u0634\u062f\u0647 \u0631\u0627 \u0648\u0627\u0631\u062f \u06a9\u0646\u06cc\u062f:":"\u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u062e\u0648\u062f \u0631\u0627 \u0648\u0627\u0631\u062f \u06a9\u0646\u06cc\u062f:"," "),a.xb(5),a.Wb("placeholder",t.otp?"Code":"Password")}}const d=[{path:"",component:(()=>{class t{constructor(t,e,n,o){this.formBuilder=t,this.authService=e,this.snackbarService=n,this.router=o,this.step=1,this.otp=Boolean(Number(localStorage.getItem("login_otp")||1)),this.firstStepForm=this.formBuilder.group({account:["",[s.i.required]]}),this.secondStepForm=this.formBuilder.group({pass:["",[s.i.required]]}),this.guid="",this.tempId="",this.account=""}ngOnInit(){}request(){const t=this.firstStepForm.controls.account;r.a.i("LoginComponent#request",t),t.invalid?this.snackbarService.showMessage("\u0627\u06cc\u0645\u06cc\u0644 \u06cc\u0627 \u0645\u0648\u0628\u0627\u06cc\u0644 \u06cc\u0627 \u0646\u0627\u0645 \u06a9\u0627\u0631\u0628\u0631\u06cc \u062e\u0648\u062f \u0631\u0627 \u0648\u0627\u0631\u062f \u06a9\u0646\u06cc\u062f"):(this.account=t.value,this.authService.request(t.value,this.otp).subscribe({next:t=>{r.a.i("AuthService#request",t),t.success?(this.guid=t.data.guid,this.tempId=t.data.tempId,this.step=2):this.snackbarService.showMessage(t.message)}}))}verify(){const t=this.secondStepForm.controls.pass;r.a.i("LoginComponent#verify",t),t.invalid?this.snackbarService.showMessage(this.otp?"\u06a9\u062f \u0648\u0627\u0631\u062f \u0646\u0634\u062f\u0647 \u0627\u0633\u062a":"\u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0648\u0627\u0631\u062f \u0646\u0634\u062f\u0647 \u0627\u0633\u062a"):this.authService.verify(this.guid,this.tempId,this.account,t.value,this.otp).subscribe({next:t=>{r.a.i("AuthService#verify",t),t.success?(localStorage.setItem("jwt_token",t.data.token),c.a.production||localStorage.setItem("b_jwt_token",t.data.token),this.router.navigate(["home"])):this.snackbarService.showMessage(t.message)}})}firstStep(){this.step=1,this.secondStepForm.controls.pass.setValue("")}saveLoginOtp(t){this.otp=t.target.checked,localStorage.setItem("login_otp",this.otp?"1":"0")}}return t.\u0275fac=function(e){return new(e||t)(a.Hb(s.b),a.Hb(b.a),a.Hb(p.a),a.Hb(i.e))},t.\u0275cmp=a.Bb({type:t,selectors:[["app-login"]],decls:5,vars:2,consts:[[1,"body","text-center"],[1,"form-signin"],["src","assets/images/filimo_logo.svg","alt","","width","72","height","72",1,"mb-4"],[4,"ngIf"],[3,"formGroup","ngSubmit"],[1,"h6","mb-3","font-weight-normal"],["dir","ltr",1,"input-group"],[1,"input-group-prepend"],[1,"input-group-text"],["type","text","placeholder","Email or Mobile or Username","aria-label","EmailOrMobileOrUsername","formControlName","account",1,"form-control"],[1,"form-check","mt-2"],["type","checkbox","id","login-otp",1,"form-check-input",3,"checked","input"],["for","login-otp",1,"form-check-label"],["type","submit",1,"mt-3","btn","btn-lg","btn-success","btn-block"],["src","assets/images/password.svg","alt","","width","24px","height","24px"],["type","password","aria-label","CodeOrPassword","formControlName","pass",1,"form-control",3,"placeholder"],[1,"back","mt-3","text-right","small"],[3,"click"]],template:function(t,e){1&t&&(a.Mb(0,"div",0),a.Mb(1,"div",1),a.Ib(2,"img",2),a.ec(3,u,15,2,"ng-container",3),a.ec(4,m,14,3,"ng-container",3),a.Lb(),a.Lb()),2&t&&(a.xb(3),a.Wb("ngIf",1===e.step),a.xb(1),a.Wb("ngIf",2===e.step))},directives:[g.i,s.j,s.f,s.d,s.a,s.e,s.c],styles:[".body[_ngcontent-%COMP%]{color:#262626;background-image:url(/assets/images/login_bg.jpg);background-repeat:no-repeat;background-size:cover;background-position:50%;display:flex;align-items:center;justify-content:center;padding-top:40px;padding-bottom:40px}.body[_ngcontent-%COMP%]   .form-signin[_ngcontent-%COMP%]{width:100%;max-width:330px;padding:15px;margin:0 auto}.body[_ngcontent-%COMP%]   .form-signin[_ngcontent-%COMP%]   .form-control[_ngcontent-%COMP%]{position:relative;box-sizing:border-box;height:auto;padding:10px}.body[_ngcontent-%COMP%]   .form-signin[_ngcontent-%COMP%]   .form-check[_ngcontent-%COMP%]{text-align:right}.body[_ngcontent-%COMP%]   .form-signin[_ngcontent-%COMP%]   .form-check[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{margin:auto}.body[_ngcontent-%COMP%]   .form-signin[_ngcontent-%COMP%]   .form-check[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{margin-right:1.25rem;font-size:.8rem;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.body[_ngcontent-%COMP%]   .form-signin[_ngcontent-%COMP%]   .back[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{cursor:pointer}"]}),t})()}];let l=(()=>{class t{}return t.\u0275mod=a.Fb({type:t}),t.\u0275inj=a.Eb({factory:function(e){return new(e||t)},imports:[[i.g.forChild(d)],i.g]}),t})(),h=(()=>{class t{}return t.\u0275mod=a.Fb({type:t}),t.\u0275inj=a.Eb({factory:function(e){return new(e||t)},imports:[[o.a,l]]}),t})()}}]);