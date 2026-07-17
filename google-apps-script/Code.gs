
const CONFIG={SHEET_NAME:"Leads",ADMIN_EMAIL:"info@resolvent.in",COMPANY_NAME:"Resolvent IT Services Pvt. Ltd.",WEBSITE:"https://www.resolvent.in"};

function doGet(){return output({success:true,message:"Resolvent lead API is running."});}

function doPost(e){
  try{
    const d=JSON.parse(e.postData.contents||"{}");
    validate(d);
    const ss=SpreadsheetApp.getActiveSpreadsheet();
    let sh=ss.getSheetByName(CONFIG.SHEET_NAME);
    if(!sh){
      sh=ss.insertSheet(CONFIG.SHEET_NAME);
      sh.appendRow(["Lead ID","Submitted At","Employee ID","Employee Name","Employee Email","Visitor Name","Company","Email","Phone","Service","Requirement","Source","Page URL","Status","Last Follow-up","Notes"]);
      sh.setFrozenRows(1);
    }
    const id="RSL-"+Utilities.formatDate(new Date(),Session.getScriptTimeZone(),"yyyyMMdd-HHmmss");
    const now=new Date();
    sh.appendRow([id,now,clean(d.employeeId),clean(d.employeeName),clean(d.employeeEmail),clean(d.name),clean(d.company),clean(d.email),clean(d.phone),clean(d.service),clean(d.requirement),clean(d.source),clean(d.pageUrl),"New","",""]);
    notifyTeam(d,id,now);
    acknowledgeVisitor(d,id);
    return output({success:true,leadId:id});
  }catch(err){
    console.error(err);
    return output({success:false,message:err.message});
  }
}

function validate(d){
  ["employeeName","name","email","phone","service","requirement"].forEach(f=>{if(!clean(d[f]))throw new Error(f+" is required.");});
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(d.email)))throw new Error("Valid email required.");
  if(clean(d.phone).replace(/\D/g,"").length<8)throw new Error("Valid phone required.");
}

function notifyTeam(d,id,now){
  const recipients=[CONFIG.ADMIN_EMAIL];
  if(clean(d.employeeEmail)&&!recipients.includes(clean(d.employeeEmail)))recipients.push(clean(d.employeeEmail));
  const html=`<div style="font-family:Arial;line-height:1.6"><h2 style="color:#123b66">New Digital Card Lead</h2><p><b>Lead ID:</b> ${esc(id)}</p><p><b>Submitted:</b> ${esc(now)}</p><p><b>Card Owner:</b> ${esc(d.employeeName)}</p><hr><p><b>Name:</b> ${esc(d.name)}</p><p><b>Company:</b> ${esc(d.company)}</p><p><b>Email:</b> ${esc(d.email)}</p><p><b>Phone:</b> ${esc(d.phone)}</p><p><b>Service:</b> ${esc(d.service)}</p><p><b>Source:</b> ${esc(d.source)}</p><p><b>Requirement:</b><br>${esc(d.requirement).replace(/\n/g,"<br>")}</p></div>`;
  MailApp.sendEmail({to:recipients.join(","),subject:"New Digital Card Lead | "+clean(d.service)+" | "+clean(d.name),htmlBody:html,name:CONFIG.COMPANY_NAME});
}

function acknowledgeVisitor(d,id){
  const html=`<div style="font-family:Arial;line-height:1.7"><h2 style="color:#123b66">Thank you, ${esc(d.name)}</h2><p>We received your request regarding <b>${esc(d.service)}</b>.</p><p>Our team will contact you shortly.</p><p><b>Reference ID:</b> ${esc(id)}</p><hr><p>Thanks & Regards,<br><b>${CONFIG.COMPANY_NAME}</b><br><a href="${CONFIG.WEBSITE}">${CONFIG.WEBSITE}</a></p></div>`;
  MailApp.sendEmail({to:clean(d.email),subject:"We received your request | "+CONFIG.COMPANY_NAME,htmlBody:html,name:CONFIG.COMPANY_NAME,replyTo:clean(d.employeeEmail)||CONFIG.ADMIN_EMAIL});
}
function clean(v){return v==null?"":String(v).trim()}
function esc(v){return clean(v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}
function output(d){return ContentService.createTextOutput(JSON.stringify(d)).setMimeType(ContentService.MimeType.JSON)}
