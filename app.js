const seedLeads = [
  { id: 1, name: 'Rohan Mehta', initials: 'RM', phone: '+91 98102 34567', company: 'Nexora Technologies', city: 'Mumbai', stage: 'Qualified', owner: 'Sana Kapoor', last: 'Called · 22 min ago', next: 'Today, 3:30 PM', avatar: 'la1', value: '₹1,80,000' },
  { id: 2, name: 'Aisha Khan', initials: 'AK', phone: '+91 99110 28451', company: 'Solis Studio', city: 'Delhi', stage: 'Follow-up', owner: 'Sana Kapoor', last: 'Email sent · 1h ago', next: 'Today, 4:00 PM', avatar: 'la2', value: '₹95,000' },
  { id: 3, name: 'Karan Patel', initials: 'KP', phone: '+91 98255 61982', company: 'Verti Solutions', city: 'Ahmedabad', stage: 'Contacted', owner: 'Sana Kapoor', last: 'No answer · Yesterday', next: 'Tomorrow, 11:00 AM', avatar: 'la3', value: '₹72,000' },
  { id: 4, name: 'Naina Verma', initials: 'NV', phone: '+91 98712 44081', company: 'Northstar Labs', city: 'Bengaluru', stage: 'New', owner: 'Unassigned', last: 'Created · Yesterday', next: '—', avatar: 'la4', value: '₹1,20,000' },
  { id: 5, name: 'Dev Malhotra', initials: 'DM', phone: '+91 99588 11731', company: 'August Ventures', city: 'Gurugram', stage: 'Qualified', owner: 'Sana Kapoor', last: 'Note added · Sep 10', next: 'Sep 15, 10:00 AM', avatar: 'la5', value: '₹2,40,000' },
  { id: 6, name: 'Meera Iyer', initials: 'MI', phone: '+91 99876 03824', company: 'Orbit Finance', city: 'Pune', stage: 'Follow-up', owner: 'Sana Kapoor', last: 'Called · Sep 10', next: 'Sep 15, 2:00 PM', avatar: 'la6', value: '₹84,000' },
  { id: 7, name: 'Vikram Rao', initials: 'VR', phone: '+91 98840 49128', company: 'Peak Commerce', city: 'Chennai', stage: 'Won', owner: 'Arjun Sharma', last: 'Deal won · Sep 9', next: '—', avatar: 'la7', value: '₹1,62,000' },
  { id: 8, name: 'Tanya Bose', initials: 'TB', phone: '+91 98301 78301', company: 'Mosaic Works', city: 'Kolkata', stage: 'New', owner: 'Unassigned', last: 'Created · Sep 9', next: '—', avatar: 'la8', value: '₹65,000' }
];
let leads = JSON.parse(localStorage.getItem('brandb-leads') || localStorage.getItem('callpilot-leads') || 'null') || seedLeads;
let filterStage = 'all'; let callLead = leads[0]; let calling = false; let elapsed = 0; let callInterval;
const defaultTeam = [
  { id: 1, name: 'Sana Kapoor', email: 'sana@brandb.com', role: 'Sales manager', status: 'Available', calls: 148, lastActive: 'Active now', avatar: '' },
  { id: 2, name: 'Arjun Sharma', email: 'arjun@brandb.com', role: 'Team lead', status: 'Available', calls: 224, lastActive: 'Active now', avatar: 'a2' },
  { id: 3, name: 'Sarah Malik', email: 'sarah@brandb.com', role: 'Telecaller', status: 'Available', calls: 196, lastActive: 'Active now', avatar: 'a3' },
  { id: 4, name: 'Rahul Singh', email: 'rahul@brandb.com', role: 'Telecaller', status: 'Away', calls: 127, lastActive: '18 min ago', avatar: 'a4' }
];
let teamMembers = JSON.parse(localStorage.getItem('brandb-team') || 'null') || defaultTeam;
let teamFilter = 'all';
const defaultPortalSettings = { callerId:'+91 98102 34567', callingMode:'Power dialer', routing:'Round robin', outcome:'Connected', recording:false, owner:'Sana Kapoor · Sales manager', leadStage:'New', dataField:'Company & phone', autoAssign:false };
let portalSettings = { ...defaultPortalSettings, ...JSON.parse(localStorage.getItem('brandb-portal-settings') || 'null') };
const defaultPhoneNumbers = [
  { id:1, number:'+91 98102 34567', label:'India sales', region:'India', status:'Active' },
  { id:2, number:'+91 99201 77431', label:'Mumbai sales', region:'Mumbai', status:'Active' },
  { id:3, number:'+91 80673 52184', label:'Support line', region:'Support', status:'Paused' }
];
let phoneNumbers = JSON.parse(localStorage.getItem('brandb-phone-numbers') || 'null') || defaultPhoneNumbers;
let activeRole = localStorage.getItem('brandb-active-role') || 'Sales manager';
const viewPermissions = { dashboard:['Sales manager','Team lead','Telecaller'], leads:['Sales manager','Team lead','Telecaller'], dialer:['Sales manager','Team lead','Telecaller'], followups:['Sales manager','Team lead','Telecaller'], analytics:['Sales manager','Team lead'], team:['Sales manager','Team lead'], settings:['Sales manager'] };
const focus = [
  { initials: 'AK', avatar: 'fa2', name: 'Aisha Khan', meta: 'Follow-up · Solis Studio', due: 'Due in 48m', urgency: 'today' },
  { initials: 'RM', avatar: 'fa1', name: 'Rohan Mehta', meta: 'Qualified · Nexora Technologies', due: 'Due at 3:30 PM', urgency: 'today' },
  { initials: 'KP', avatar: 'fa3', name: 'Karan Patel', meta: 'Callback · Verti Solutions', due: 'Tomorrow', urgency: '' }
];
const activities = [
  ['☎','Sana Kapoor','completed a call with','Rohan Mehta','12 min ago'],['✦','Arjun Sharma','qualified','Dev Malhotra','25 min ago'],['◷','Sana Kapoor','scheduled a follow-up with','Aisha Khan','1h ago'],['✉','Sarah Malik','sent a proposal to','Vikram Rao','2h ago']
];
const tasks = { overdue: [ ['Call back Karan about pricing questions','Karan Patel','Overdue by 1 day'], ['Send proposal after product demo','Leah Fernandez','Overdue by 2 days'] ], today: [ ['Discuss enterprise rollout requirements','Rohan Mehta','3:30 PM'], ['Follow up on last week’s proposal','Aisha Khan','4:00 PM'], ['Confirm product demo attendees','Nitesh Gupta','5:15 PM'] ], upcoming: [ ['Share case study with the operations team','Meera Iyer','Mon, Sep 15'], ['Review renewal timeline','Tanya Bose','Tue, Sep 16'], ['Prepare discovery call notes','Danish Ali','Wed, Sep 17'] ] };

function stageClass(stage){ return 'stage-' + stage.toLowerCase().replace(/[^a-z]+/g, '-'); }
function saveLeads(){ localStorage.setItem('brandb-leads', JSON.stringify(leads)); }
function escapeText(value){ return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char])); }
function initials(name){ return name.split(/\s+/).slice(0,2).map(part=>part[0]).join('').toUpperCase(); }
function saveTeam(){ localStorage.setItem('brandb-team', JSON.stringify(teamMembers)); }
function savePortalSettings(){ localStorage.setItem('brandb-portal-settings', JSON.stringify(portalSettings)); }
function savePhoneNumbers(){ localStorage.setItem('brandb-phone-numbers', JSON.stringify(phoneNumbers)); }
function canAccessView(view){ return (viewPermissions[view] || []).includes(activeRole); }
function isManager(){ return activeRole === 'Sales manager'; }
function requireManager(){ if(isManager())return true; showToast('This control is available to sales managers only'); return false; }
function applyRoleAccess(){
  document.getElementById('profileRole').textContent=activeRole;
  const accessAction=document.querySelector('[data-profile-action="access"]'); if(accessAction)accessAction.textContent=`🔒 Access: ${activeRole}`;
  document.querySelectorAll('[data-manager-only],[data-manager-control]').forEach(element=>element.classList.toggle('manager-only-hidden',!isManager()));
  document.querySelectorAll('.nav-item[data-view]').forEach(item=>item.classList.toggle('manager-only-hidden',!canAccessView(item.dataset.view)));
  document.querySelectorAll('#newLeadBtn,#newLeadBtn2,#downloadReport').forEach(element=>element.classList.toggle('manager-only-hidden',activeRole === 'Telecaller'));
  const current=document.querySelector('.view.active-view')?.id;
  if(current && !canAccessView(current))navigate('dashboard');
}
function renderSettingsSummaries(){
  const calling=document.getElementById('callingSettingsSummary');
  const workspace=document.getElementById('workspaceSettingsSummary');
  if(calling)calling.textContent=`${portalSettings.callerId} · ${portalSettings.callingMode}${portalSettings.recording ? ' · Recording on' : ''}`;
  if(workspace)workspace.textContent=`${portalSettings.autoAssign ? 'Auto-assign on' : 'Manual assignment'} · ${portalSettings.leadStage} leads`;
}
function renderPhoneNumbers(){
  const list=document.getElementById('phoneNumberList'); const select=document.getElementById('callerIdSelect'); if(!list || !select)return;
  const active=phoneNumbers.filter(item=>item.status==='Active');
  if(!active.some(item=>item.number===portalSettings.callerId))portalSettings.callerId=(active[0] || phoneNumbers[0] || {}).number || '';
  select.innerHTML=active.map(item=>`<option value="${escapeText(item.number)}">${escapeText(item.number)} · ${escapeText(item.label)}</option>`).join('') || '<option value="">No active numbers</option>';
  select.value=portalSettings.callerId;
  list.innerHTML=phoneNumbers.map(item=>`<div class="phone-number-row"><span class="number-badge">☎</span><div class="number-copy"><strong>${escapeText(item.number)} · ${escapeText(item.label)}</strong><small>${escapeText(item.region)}</small></div><span class="phone-status ${item.status==='Paused'?'paused':''}">${item.status}</span><button type="button" class="number-edit" data-edit-number="${item.id}">Edit</button></div>`).join('') || '<p class="empty-list">No phone numbers have been added.</p>';
  list.querySelectorAll('[data-edit-number]').forEach(button=>button.onclick=()=>openNumberEditor(Number(button.dataset.editNumber)));
}
function renderTeam(){
  const search = document.getElementById('teamSearch')?.value.toLowerCase() || '';
  const shown = teamMembers.filter(member => (teamFilter === 'all' || member.status === teamFilter) && `${member.name} ${member.email} ${member.role}`.toLowerCase().includes(search));
  const body = document.getElementById('teamTableBody'); if(!body) return;
  body.innerHTML = shown.map(member => `<tr><td><div class="member-person"><span class="member-avatar ${member.avatar}">${initials(member.name)}</span><div><strong>${escapeText(member.name)}</strong><small>${escapeText(member.email)}</small></div></div></td><td><span class="role-badge">${escapeText(member.role)}</span></td><td><span class="member-status ${member.status === 'Away' ? 'away' : ''}"><i></i>${member.status}</span></td><td>${member.calls}</td><td>${escapeText(member.lastActive)}</td><td><span class="member-actions"><button class="member-action" data-member="${member.id}">${member.status === 'Available' ? 'Set away' : 'Set available'}</button><button class="member-action manager-member-action ${isManager()?'':'manager-only-hidden'}" data-edit-member="${member.id}">Edit</button></span></td></tr>`).join('') || '<tr><td colspan="6" style="text-align:center;height:110px;color:#9296a7">No team members match this view.</td></tr>';
  const available = teamMembers.filter(member=>member.status === 'Available').length;
  const roles = new Set(teamMembers.map(member=>member.role)).size;
  document.getElementById('teamHeadingCount').textContent = teamMembers.length;
  document.getElementById('teamTotal').textContent = teamMembers.length;
  document.getElementById('teamAvailable').textContent = available;
  document.getElementById('teamRoles').textContent = roles;
  body.querySelectorAll('[data-member]').forEach(button=>button.onclick=()=>{ const member=teamMembers.find(item=>item.id===Number(button.dataset.member)); member.status=member.status === 'Available' ? 'Away' : 'Available'; member.lastActive=member.status === 'Available' ? 'Active now' : 'Just now'; saveTeam(); renderTeam(); showToast(`${member.name} is now ${member.status.toLowerCase()}`); });
  body.querySelectorAll('[data-edit-member]').forEach(button=>button.onclick=()=>openTeamModal(Number(button.dataset.editMember)));
}
function renderLeads(){
  const term = document.getElementById('leadSearch')?.value.toLowerCase() || '';
  const display = leads.filter(l => (filterStage === 'all' || l.stage === filterStage) && `${l.name} ${l.phone} ${l.company}`.toLowerCase().includes(term));
  const body = document.getElementById('leadTableBody'); if(!body) return;
  body.innerHTML = display.map(l => `<tr><td><input type="checkbox" /></td><td><div class="lead-person"><span class="lead-avatar ${l.avatar || 'la1'}">${l.initials}</span><div><strong>${l.name}</strong><small>${l.phone} · ${l.company}</small></div></div></td><td><span class="stage-tag ${stageClass(l.stage)}">${l.stage.toUpperCase()}</span></td><td><div class="owner">${l.owner === 'Unassigned' ? '<span style="color:#9b9fae">Unassigned</span>' : '<i class="owner-avatar">SK</i>'+l.owner}</div></td><td>${l.last}</td><td class="${l.next.includes('Today') ? 'next-date' : ''}">${l.next}</td><td><button class="call-row" data-call="${l.id}">☎ Call</button></td></tr>`).join('') || `<tr><td colspan="7" style="text-align:center;height:120px;color:#9296a7">No leads match this view.</td></tr>`;
  document.getElementById('tableShowing').textContent = `Showing ${display.length ? '1–'+display.length : '0'} of ${leads.length} leads`;
  ['leadCount','leadHeadingCount','allLeadCount'].forEach(id=>{ const el=document.getElementById(id);if(el)el.textContent=leads.length; });
  body.querySelectorAll('[data-call]').forEach(btn=>btn.onclick=()=>openLeadForCall(Number(btn.dataset.call)));
}
function renderDashboard(){
  document.getElementById('focusList').innerHTML = focus.map((f,i)=>`<div class="focus-item"><span class="focus-avatar ${f.avatar}">${f.initials}</span><div><strong>${f.name}</strong><small>${f.meta}</small></div><div><span class="due ${f.urgency}">${f.due}</span><button class="quick-call" data-focus="${i}">☎ Call</button></div></div>`).join('');
  document.querySelectorAll('[data-focus]').forEach(b=>b.onclick=()=>openLeadForCall(leads[Number(b.dataset.focus)+1]||leads[0]));
  document.getElementById('activityList').innerHTML=activities.map(a=>`<div class="activity-row"><span class="activity-icon">${a[0]}</span><div><p><strong>${a[1]}</strong> ${a[2]} <strong>${a[3]}</strong></p><small>Sales pipeline</small></div><time>${a[4]}</time></div>`).join('');
}
function renderTasks(){ Object.entries(tasks).forEach(([key,list])=>{ const node=document.getElementById(key+'Tasks'); if(node) node.innerHTML=list.map((t,i)=>`<article class="task-card"><p>${t[0]}</p><div class="task-meta"><span class="contact-chip">${t[1]}</span><small>${t[2]}</small></div><button data-complete="${key}-${i}" style="margin-top:10px">✓ Complete</button></article>`).join(''); }); document.querySelectorAll('[data-complete]').forEach(b=>b.onclick=()=>{ b.closest('.task-card').style.opacity='.45'; b.textContent='Completed'; showToast('Task marked complete'); }); }
function renderQueue(){ const queue = leads.filter(l=>l.id!==callLead.id).slice(0,5); document.getElementById('queueList').innerHTML = queue.map(l=>`<div class="queue-item"><strong>${l.name}</strong><p>${l.company}</p><button data-queue="${l.id}">Call next →</button></div>`).join(''); document.querySelectorAll('[data-queue]').forEach(b=>b.onclick=()=>openLeadForCall(Number(b.dataset.queue))); }
function openLeadForCall(id){ callLead= typeof id === 'object' ? id : leads.find(l=>l.id===id); if(!callLead)return; stopCall(false); document.getElementById('callAvatar').textContent=callLead.initials; document.getElementById('callName').textContent=callLead.name; document.getElementById('callCompany').textContent=`${callLead.company} · ${callLead.city}`; document.getElementById('callPhone').textContent=callLead.phone; document.getElementById('callStage').textContent=callLead.stage.toUpperCase(); document.getElementById('callStage').className='stage-tag '+stageClass(callLead.stage); document.getElementById('callNotes').value=''; renderQueue(); navigate('dialer'); }
function formatTime(seconds){return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;}
function startCall(){ calling=true; elapsed=0; document.getElementById('callTimer').textContent='00:00'; const button=document.getElementById('callButton'); button.classList.add('hangup'); button.innerHTML='☎<span>End call</span>'; document.getElementById('dialerStatus').textContent='Call in progress'; document.querySelector('.dialer-status').classList.add('in-call'); document.querySelector('.call-progress').classList.add('live'); document.getElementById('callProgressText').textContent='Connected securely · Call recording off'; document.getElementById('muteButton').disabled=false; document.getElementById('keypadButton').disabled=false; callInterval=setInterval(()=>{elapsed++;document.getElementById('callTimer').textContent=formatTime(elapsed)},1000); }
function stopCall(show=true){ if(!calling && elapsed===0){document.getElementById('callTimer')&&(document.getElementById('callTimer').textContent='00:00');return;} calling=false;clearInterval(callInterval);const button=document.getElementById('callButton');button.classList.remove('hangup');button.innerHTML='☎<span>Start call</span>';document.getElementById('dialerStatus').textContent='Call complete — log an outcome';document.querySelector('.dialer-status').classList.remove('in-call');document.querySelector('.call-progress').classList.remove('live');document.getElementById('callProgressText').textContent='Choose an outcome to keep the conversation moving.';document.getElementById('muteButton').disabled=true;document.getElementById('keypadButton').disabled=true;document.getElementById('callOutcomes').classList.add('enabled');if(show)showToast(`Call with ${callLead.name} ended`);}
function logOutcome(outcome){ const current=leads.find(l=>l.id===callLead.id); if(current){ current.last=`${outcome} · Just now`; if(outcome==='Qualified')current.stage='Qualified'; if(outcome==='Callback'){current.stage='Follow-up';current.next='Tomorrow, 10:00 AM';} if(outcome==='No answer')current.next='Today, 5:30 PM';saveLeads();} document.getElementById('callOutcomes').classList.remove('enabled');showToast(`${outcome} logged for ${callLead.name}`);renderLeads();}
function navigate(view){if(!canAccessView(view)){showToast(`${activeRole}s cannot open ${view} controls`);return;}document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active-view',v.id===view));document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===view));const workspace=document.getElementById('workspaceName')?.textContent || 'Workspace';document.getElementById('breadcrumbs').innerHTML=`${workspace} <span>/</span> ${view.charAt(0).toUpperCase()+view.slice(1)}`;window.scrollTo({top:0,behavior:'smooth'});document.querySelector('.sidebar').classList.remove('show');closeSidebarMenus();}
function showToast(msg){const toast=document.getElementById('toast');document.getElementById('toastText').textContent=msg;toast.classList.remove('hidden');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>toast.classList.add('hidden'),2600);}
function openLeadModal(){if(activeRole==='Telecaller'){showToast('Telecallers can work existing leads but cannot create new ones');return;}document.getElementById('leadModal').classList.remove('hidden');setTimeout(()=>document.querySelector('#leadForm input').focus(),100)}
function closeLeadModal(){document.getElementById('leadModal').classList.add('hidden');document.getElementById('leadForm').reset();}
function roleHint(role){ return { 'Sales manager':'Sales managers have full workspace, team, number, and settings controls.', 'Team lead':'Team leads can view team performance and work leads, calls, and follow-ups.', 'Telecaller':'Telecallers can work leads, calls, notes, and their follow-ups only.', 'Admin':'Admins have the same portal controls as sales managers.' }[role] || ''; }
function updateRoleHint(){ const form=document.getElementById('teamForm'); document.getElementById('roleHint').textContent=roleHint(form.elements.role.value); }
function openTeamModal(memberId=null){
  if(!requireManager())return;
  const form=document.getElementById('teamForm');const member=memberId ? teamMembers.find(item=>item.id===memberId) : null;
  form.reset();form.elements.memberId.value=member?.id || '';document.getElementById('teamModalTitle').textContent=member?'Edit team member':'Add team member';document.getElementById('teamModalCopy').textContent=member?'Change this person’s role, availability, or profile details.':'Add someone to Brand.B CRM Portal. Their profile is saved to this workspace.';document.getElementById('teamSubmitBtn').textContent=member?'Save changes':'Add member';
  if(member){form.elements.name.value=member.name;form.elements.email.value=member.email;form.elements.role.value=member.role;form.elements.status.value=member.status;}
  updateRoleHint();document.getElementById('teamModal').classList.remove('hidden');setTimeout(()=>form.elements.name.focus(),100);
}
function closeTeamModal(){document.getElementById('teamModal').classList.add('hidden');document.getElementById('teamForm').reset();}
function openNumbersModal(){
  if(!requireManager())return;
  const form=document.getElementById('numbersForm');
  renderPhoneNumbers();form.elements.callerId.value=portalSettings.callerId;form.elements.callingMode.value=portalSettings.callingMode;form.elements.routing.value=portalSettings.routing;form.elements.outcome.value=portalSettings.outcome;form.elements.recording.checked=portalSettings.recording;
  document.getElementById('numbersModal').classList.remove('hidden');
}
function closeNumbersModal(){document.getElementById('numbersModal').classList.add('hidden');}
function openNumberEditor(numberId=null){
  if(!requireManager())return;
  const form=document.getElementById('numberForm');const item=numberId?phoneNumbers.find(number=>number.id===numberId):null;form.reset();form.elements.numberId.value=item?.id || '';document.getElementById('numberModalTitle').textContent=item?'Edit phone number':'Add phone number';document.getElementById('numberSubmitBtn').textContent=item?'Save number':'Add number';
  if(item){form.elements.number.value=item.number;form.elements.label.value=item.label;form.elements.region.value=item.region;form.elements.status.value=item.status;}
  document.getElementById('numberEditorModal').classList.remove('hidden');setTimeout(()=>form.elements.number.focus(),100);
}
function closeNumberEditor(){document.getElementById('numberEditorModal').classList.add('hidden');document.getElementById('numberForm').reset();}
function openWorkspaceModal(){
  if(!requireManager())return;
  const form=document.getElementById('workspaceForm');
  form.elements.workspaceName.value=document.getElementById('workspaceName').textContent;form.elements.owner.value=portalSettings.owner;form.elements.leadStage.value=portalSettings.leadStage;form.elements.dataField.value=portalSettings.dataField;form.elements.autoAssign.checked=portalSettings.autoAssign;
  document.getElementById('workspaceModal').classList.remove('hidden');
}
function closeWorkspaceModal(){document.getElementById('workspaceModal').classList.add('hidden');}
function openAccessModal(){ const form=document.getElementById('accessForm');form.elements.role.value=activeRole;document.getElementById('accessModal').classList.remove('hidden'); }
function closeAccessModal(){document.getElementById('accessModal').classList.add('hidden');}
function openRoleRulesModal(){if(!requireManager())return;document.getElementById('roleRulesModal').classList.remove('hidden');}
function closeRoleRulesModal(){document.getElementById('roleRulesModal').classList.add('hidden');}
function closeSidebarMenus(){
  document.getElementById('workspaceMenu')?.classList.add('hidden');
  document.getElementById('profileMenu')?.classList.add('hidden');
  document.getElementById('workspaceSwitch')?.setAttribute('aria-expanded','false');
  document.getElementById('profileSwitch')?.setAttribute('aria-expanded','false');
}
function selectWorkspace(option, notify=true){
  const workspace = { name:option.dataset.workspace, plan:option.dataset.plan, initial:option.dataset.initial };
  document.getElementById('workspaceName').textContent=workspace.name;
  document.getElementById('workspacePlan').textContent=workspace.plan;
  document.getElementById('workspaceAvatar').textContent=workspace.initial;
  document.querySelectorAll('.workspace-option').forEach(item=>item.classList.toggle('active',item.dataset.workspace===workspace.name));
  localStorage.setItem('brandb-workspace',JSON.stringify(workspace));
  const currentView=document.querySelector('.view.active-view')?.id || 'dashboard';
  document.getElementById('breadcrumbs').innerHTML=`${workspace.name} <span>/</span> ${currentView.charAt(0).toUpperCase()+currentView.slice(1)}`;
  closeSidebarMenus();
  if(notify)showToast(`Switched to ${workspace.name}`);
}
function updateProfileStatus(){
  const status=localStorage.getItem('brandb-user-status') || 'Available';
  const action=document.querySelector('[data-profile-action="availability"]');
  if(action)action.textContent=`● Set status: ${status === 'Available' ? 'Away' : 'Available'}`;
}

document.addEventListener('DOMContentLoaded',()=>{
  renderLeads();renderDashboard();renderTasks();renderQueue();renderTeam();renderPhoneNumbers();renderSettingsSummaries();
  try { const savedWorkspace=JSON.parse(localStorage.getItem('brandb-workspace') || 'null'); if(savedWorkspace){ const option=[...document.querySelectorAll('.workspace-option')].find(item=>item.dataset.workspace===savedWorkspace.name); if(option)selectWorkspace(option,false); } } catch { localStorage.removeItem('brandb-workspace'); }
  updateProfileStatus();applyRoleAccess();
  document.querySelectorAll('.nav-item').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.view)));
  document.querySelectorAll('[data-view-link]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.viewLink)));
  document.querySelectorAll('#newLeadBtn,#newLeadBtn2').forEach(b=>b.onclick=openLeadModal);document.getElementById('closeModal').onclick=closeLeadModal;document.getElementById('cancelModal').onclick=closeLeadModal;
  document.getElementById('workspaceSwitch').onclick=()=>{const menu=document.getElementById('workspaceMenu');const willOpen=menu.classList.contains('hidden');closeSidebarMenus();menu.classList.toggle('hidden',!willOpen);document.getElementById('workspaceSwitch').setAttribute('aria-expanded',String(willOpen));};
  document.getElementById('profileSwitch').onclick=()=>{const menu=document.getElementById('profileMenu');const willOpen=menu.classList.contains('hidden');closeSidebarMenus();menu.classList.toggle('hidden',!willOpen);document.getElementById('profileSwitch').setAttribute('aria-expanded',String(willOpen));};
  document.querySelectorAll('.workspace-option').forEach(option=>option.onclick=()=>selectWorkspace(option));document.querySelector('[data-workspace-action="manage"]').onclick=()=>{closeSidebarMenus();navigate('settings');openWorkspaceModal();};
  document.querySelectorAll('[data-profile-action]').forEach(action=>action.onclick=()=>{const type=action.dataset.profileAction;if(type==='availability'){const next=(localStorage.getItem('brandb-user-status') || 'Available')==='Available'?'Away':'Available';localStorage.setItem('brandb-user-status',next);updateProfileStatus();showToast(`Your status is now ${next.toLowerCase()}`);}else if(type==='access'){openAccessModal();}else{if(canAccessView('settings')){navigate('settings');showToast(type==='profile'?'Profile preferences opened':'Notification settings opened');}else showToast('Settings are restricted for this role');}closeSidebarMenus();});
  document.addEventListener('click',event=>{if(!event.target.closest('.workspace-control')&&!event.target.closest('.profile-control'))closeSidebarMenus();});
  document.getElementById('leadModal').addEventListener('click',e=>{if(e.target.id==='leadModal')closeLeadModal()});
  document.getElementById('leadForm').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.target);const name=f.get('name').trim();const selectedStage=f.get('stage')==='New'?portalSettings.leadStage:f.get('stage');const owner=portalSettings.autoAssign&&portalSettings.owner!=='Leave unassigned'?portalSettings.owner.split(' ·')[0]:'Unassigned';const item={id:Date.now(),name,initials:name.split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase(),phone:f.get('phone'),company:f.get('company')||'Independent',city:'India',stage:selectedStage,owner,last:'Created · Just now',next:selectedStage==='Follow-up'?'Tomorrow, 10:00 AM':'—',avatar:'la1',value:f.get('value')||'—'};leads.unshift(item);saveLeads();renderLeads();renderQueue();closeLeadModal();showToast(`${item.name} added to your leads`);});
  document.getElementById('leadSearch').addEventListener('input',renderLeads);document.getElementById('filterBtn').onclick=()=>document.getElementById('filterRow').classList.toggle('hidden');document.querySelectorAll('[data-stage]').forEach(b=>b.onclick=()=>{filterStage=b.dataset.stage;document.querySelectorAll('[data-stage]').forEach(x=>x.classList.toggle('active',x===b));renderLeads();});document.querySelectorAll('.summary-tile').forEach(b=>b.onclick=()=>{filterStage=b.dataset.filter;document.querySelectorAll('.summary-tile').forEach(x=>x.classList.toggle('active-filter',x===b));renderLeads();});
  document.getElementById('inviteTeamBtn').onclick=openTeamModal;document.getElementById('closeTeamModal').onclick=closeTeamModal;document.getElementById('cancelTeamModal').onclick=closeTeamModal;document.getElementById('teamModal').addEventListener('click',e=>{if(e.target.id==='teamModal')closeTeamModal()});
  document.getElementById('teamForm').addEventListener('submit',e=>{e.preventDefault();if(!requireManager())return;const form=e.currentTarget;const memberId=Number(form.elements.memberId.value);const name=form.elements.name.value.trim();const email=form.elements.email.value.trim().toLowerCase();if(teamMembers.some(member=>member.email.toLowerCase()===email&&member.id!==memberId)){showToast('A team member already uses this email');return;}const existing=teamMembers.find(member=>member.id===memberId);if(existing){Object.assign(existing,{name,email,role:form.elements.role.value,status:form.elements.status.value,lastActive:'Updated just now'});showToast(`${name} updated`);}else{teamMembers.unshift({id:Date.now(),name,email,role:form.elements.role.value,status:form.elements.status.value,calls:0,lastActive:'Just added',avatar:''});showToast(`${name} added to Brand.B CRM Portal`);}saveTeam();renderTeam();closeTeamModal();});
  document.getElementById('teamForm').elements.role.addEventListener('change',updateRoleHint);
  document.getElementById('teamSearch').addEventListener('input',renderTeam);document.getElementById('teamFilterBtn').onclick=()=>document.getElementById('teamFilterRow').classList.toggle('hidden');document.querySelectorAll('[data-team-filter]').forEach(button=>button.onclick=()=>{teamFilter=button.dataset.teamFilter;document.querySelectorAll('[data-team-filter]').forEach(item=>item.classList.toggle('active',item===button));renderTeam();});
  document.getElementById('roleRulesBtn').onclick=openRoleRulesModal;document.getElementById('closeRoleRulesModal').onclick=closeRoleRulesModal;document.getElementById('doneRoleRulesBtn').onclick=closeRoleRulesModal;document.getElementById('roleRulesModal').addEventListener('click',event=>{if(event.target.id==='roleRulesModal')closeRoleRulesModal()});
  document.getElementById('configureNumbersBtn').onclick=openNumbersModal;document.getElementById('closeNumbersModal').onclick=closeNumbersModal;document.getElementById('cancelNumbersModal').onclick=closeNumbersModal;document.getElementById('numbersModal').addEventListener('click',event=>{if(event.target.id==='numbersModal')closeNumbersModal()});
  document.getElementById('numbersForm').addEventListener('submit',event=>{event.preventDefault();if(!requireManager())return;const form=event.currentTarget;portalSettings={...portalSettings,callerId:form.elements.callerId.value,callingMode:form.elements.callingMode.value,routing:form.elements.routing.value,outcome:form.elements.outcome.value,recording:form.elements.recording.checked};savePortalSettings();renderSettingsSummaries();closeNumbersModal();showToast('Calling & number settings saved');});
  document.getElementById('addNumberBtn').onclick=()=>openNumberEditor();document.getElementById('closeNumberEditor').onclick=closeNumberEditor;document.getElementById('cancelNumberEditor').onclick=closeNumberEditor;document.getElementById('numberEditorModal').addEventListener('click',event=>{if(event.target.id==='numberEditorModal')closeNumberEditor()});
  document.getElementById('numberForm').addEventListener('submit',event=>{event.preventDefault();if(!requireManager())return;const form=event.currentTarget;const id=Number(form.elements.numberId.value);const number=form.elements.number.value.trim();if(!/^\+?[\d\s()-]{7,}$/.test(number)){showToast('Enter a valid phone number');return;}if(phoneNumbers.some(item=>item.number===number&&item.id!==id)){showToast('This phone number already exists');return;}const existing=phoneNumbers.find(item=>item.id===id);if(existing){Object.assign(existing,{number,label:form.elements.label.value.trim(),region:form.elements.region.value,status:form.elements.status.value});showToast('Phone number updated');}else{phoneNumbers.push({id:Date.now(),number,label:form.elements.label.value.trim(),region:form.elements.region.value,status:form.elements.status.value});showToast('Phone number added');}savePhoneNumbers();renderPhoneNumbers();renderSettingsSummaries();closeNumberEditor();});
  document.getElementById('manageWorkspaceBtn').onclick=openWorkspaceModal;document.getElementById('closeWorkspaceModal').onclick=closeWorkspaceModal;document.getElementById('cancelWorkspaceModal').onclick=closeWorkspaceModal;document.getElementById('workspaceModal').addEventListener('click',event=>{if(event.target.id==='workspaceModal')closeWorkspaceModal()});
  document.getElementById('workspaceForm').addEventListener('submit',event=>{event.preventDefault();if(!requireManager())return;const form=event.currentTarget;const activeOption=document.querySelector('.workspace-option.active');const name=form.elements.workspaceName.value.trim();if(activeOption&&name){activeOption.dataset.workspace=name;activeOption.querySelector('strong').textContent=name;selectWorkspace(activeOption,false);}portalSettings={...portalSettings,owner:form.elements.owner.value,leadStage:form.elements.leadStage.value,dataField:form.elements.dataField.value,autoAssign:form.elements.autoAssign.checked};savePortalSettings();renderSettingsSummaries();closeWorkspaceModal();showToast('Workspace settings saved');});
  document.getElementById('closeAccessModal').onclick=closeAccessModal;document.getElementById('cancelAccessModal').onclick=closeAccessModal;document.getElementById('accessModal').addEventListener('click',event=>{if(event.target.id==='accessModal')closeAccessModal()});document.getElementById('accessForm').addEventListener('submit',event=>{event.preventDefault();activeRole=event.currentTarget.elements.role.value;localStorage.setItem('brandb-active-role',activeRole);closeAccessModal();applyRoleAccess();renderTeam();showToast(`Viewing portal as ${activeRole}`);});
  document.getElementById('callButton').onclick=()=>calling?stopCall():startCall();document.querySelectorAll('[data-outcome]').forEach(b=>b.onclick=()=>logOutcome(b.dataset.outcome));document.getElementById('muteButton').onclick=e=>{e.currentTarget.classList.toggle('muted');showToast(e.currentTarget.classList.contains('muted')?'Microphone muted':'Microphone unmuted')};document.getElementById('saveNotes').onclick=()=>showToast('Call note saved');document.getElementById('openQueue').onclick=()=>showToast('Priority queue is ready for you');document.getElementById('availabilityToggle').onclick=()=>showToast('Availability updated');
  document.getElementById('searchButton').onclick=()=>document.getElementById('searchModal').classList.remove('hidden');document.getElementById('searchModal').addEventListener('click',e=>{if(e.target.id==='searchModal')e.currentTarget.classList.add('hidden')});document.getElementById('commandSearch').addEventListener('input',e=>{const query=e.target.value.toLowerCase();document.querySelectorAll('.command-list button').forEach(b=>b.style.display=b.textContent.toLowerCase().includes(query)?'block':'none')});document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>{document.getElementById('searchModal').classList.add('hidden');if(b.dataset.action==='add')openLeadModal();else navigate(b.dataset.action)});document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();document.getElementById('searchModal').classList.remove('hidden');document.getElementById('commandSearch').focus()}if(e.key==='Escape'){document.getElementById('searchModal').classList.add('hidden');closeLeadModal();closeTeamModal();closeNumbersModal();closeNumberEditor();closeWorkspaceModal();closeAccessModal();closeRoleRulesModal();closeSidebarMenus()}});
  document.querySelector('.mobile-menu').onclick=()=>document.querySelector('.sidebar').classList.toggle('show');document.getElementById('downloadReport').onclick=()=>showToast('Your report is ready to export');document.getElementById('newTaskBtn').onclick=()=>showToast('Choose a column to add a task');
});
