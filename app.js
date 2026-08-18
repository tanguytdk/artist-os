/* ============ FIREBASE ============ */
const firebaseConfig = {
  apiKey: "AIzaSyCH-RzCay9SgktIrF1dDyjFVaKmtz-Y1eg",
  authDomain: "artist-os-66748.firebaseapp.com",
  projectId: "artist-os-66748",
  storageBucket: "artist-os-66748.firebasestorage.app",
  messagingSenderId: "373944279125",
  appId: "1:373944279125:web:a658be2fe89885a20e74dc",
  measurementId: "G-RSVMZ7PVL3"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const DOC_REF = db.collection('artistos').doc('shared');
/* ============ DATA MODEL ============ */
const ROLES = [
  {id:'artiste', label:'Artiste', icon:'🎤'},
  {id:'producteur', label:'Producteur', icon:'🎚️'},
  {id:'arrangeur', label:'Arrangeur / Beatmaker', icon:'🎧'},
  {id:'videaste', label:'Vidéaste', icon:'🎬'},
  {id:'photographe', label:'Photographe', icon:'📷'},
  {id:'infographiste', label:'Infographiste', icon:'🎨'},
  {id:'styliste', label:'Styliste', icon:'👗'},
  {id:'cm', label:'Community Manager', icon:'📱'},
  {id:'manager', label:'Manager', icon:'📋'},
];
const LOCAL_KEY = 'artistos_local_v1';
function defaultArtistProfile(){
  return { name:'Tanguy DJE RoiStar', genre:'', bio:'', manager:'', phone:'', email:'' };
}
function seedShared(){
  const today = new Date();
  const d = (offsetDays) => {
    const dt = new Date(today);
    dt.setDate(dt.getDate() + offsetDays);
    return dt.toISOString().slice(0,10);
  };
  return {
    projects: [
      {id:'destin', title:'DESTIN', type:'Single', releaseDate:'2026-10-15'}
    ],
    tasks: [
      {id:'t1', projectId:'destin', title:'Arrangement du morceau', role:'arrangeur', status:'terminé', due:d(-20), dependsOn:[]},
      {id:'t2', projectId:'destin', title:'Mixage', role:'arrangeur', status:'en retard', due:d(-2), dependsOn:['t1']},
      {id:'t3', projectId:'destin', title:'Mastering', role:'producteur', status:'à venir', due:d(3), dependsOn:['t2']},
      {id:'t4', projectId:'destin', title:'Transmission au distributeur', role:'producteur', status:'à venir', due:d(6), dependsOn:['t3']},
      {id:'t5', projectId:'destin', title:'Pitching plateformes', role:'producteur', status:'à venir', due:d(9), dependsOn:['t4']},
      {id:'t6', projectId:'destin', title:'Shooting pochette', role:'photographe', status:'en cours', due:d(1), dependsOn:[]},
      {id:'t7', projectId:'destin', title:'Sélection & retouches photos', role:'photographe', status:'à venir', due:d(3), dependsOn:['t6']},
      {id:'t8', projectId:'destin', title:'Création pochette', role:'infographiste', status:'à venir', due:d(5), dependsOn:['t7']},
      {id:'t9', projectId:'destin', title:'Visuels réseaux sociaux', role:'infographiste', status:'à venir', due:d(8), dependsOn:['t8']},
      {id:'t10', projectId:'destin', title:'Tournage clip', role:'videaste', status:'en cours', due:d(2), dependsOn:[]},
      {id:'t11', projectId:'destin', title:'Montage clip', role:'videaste', status:'à venir', due:d(7), dependsOn:['t10']},
      {id:'t12', projectId:'destin', title:'Intégration audio final', role:'videaste', status:'à venir', due:d(9), dependsOn:['t11','t2']},
      {id:'t13', projectId:'destin', title:'Proposition de looks', role:'styliste', status:'terminé', due:d(-5), dependsOn:[]},
      {id:'t14', projectId:'destin', title:'Teaser TikTok', role:'cm', status:'à venir', due:d(10), dependsOn:['t9']},
      {id:'t15', projectId:'destin', title:'Compte à rebours Instagram', role:'cm', status:'à venir', due:d(13), dependsOn:[]},
      {id:'t16', projectId:'destin', title:'Confirmer budget clip', role:'manager', status:'en cours', due:d(1), dependsOn:[]},
    ],
    notifications: [
      {time:'09:12', text:'⚠️ Le mixage arrive à échéance dans 2 jours.'},
      {time:'08:40', text:'✅ Les looks du styliste ont été validés.'},
      {time:'Hier', text:'📁 Nouveau fichier disponible : rushes du tournage.'},
      {time:'Hier', text:'📅 Shooting pochette prévu demain.'},
    ],
    bookings: [
      {id:'bk1', title:'Interview radio', type:'Interview', confirmation:'confirmé', date:d(2), time:'14:00', location:'Studio RFI, Paris', contact:'Aïcha K. – 06 11 22 33 44', notes:'Prévoir visuel pochette et bio à jour.', status:'à venir'},
      {id:'bk2', title:'Répétition avant clip', type:'Répétition', confirmation:'confirmé', date:d(-3), time:'10:00', location:'Studio B', contact:'', notes:'Studio B, avec danseurs.', status:'terminé'},
    ],
    artistProfile: defaultArtistProfile()
  };
}
function loadLocalPrefs(){
  try{
    const raw = localStorage.getItem(LOCAL_KEY);
    if(raw) return JSON.parse(raw);
  }catch(e){}
  return { currentRole: 'artiste', currentProjectId: null };
}
function saveLocalPrefs(){
  localStorage.setItem(LOCAL_KEY, JSON.stringify({
    currentRole: DATA.currentRole,
    currentProjectId: DATA.currentProjectId
  }));
}
let DATA = Object.assign({ projects: [], tasks: [], notifications: [], bookings: [], artistProfile: defaultArtistProfile() }, loadLocalPrefs());
let dataReady = false;
function saveData(data){
  saveLocalPrefs();
  setSyncBadge('saving');
  DOC_REF.set({
    projects: data.projects,
    tasks: data.tasks,
    notifications: data.notifications,
    bookings: data.bookings,
    artistProfile: data.artistProfile
  }).then(() => setSyncBadge('ok')).catch(err => {
    console.error('Erreur de sauvegarde Firestore :', err);
    setSyncBadge('err');
  });
}
function setSyncBadge(state){
  const el = document.getElementById('syncBadge');
  if(!el) return;
  if(state === 'ok'){ el.textContent = '🟢 synchronisé'; el.className = 'sync-badge ok'; }
  else if(state === 'saving'){ el.textContent = '🔄 sauvegarde…'; el.className = 'sync-badge'; }
  else if(state === 'err'){ el.textContent = '🔴 erreur de sync'; el.className = 'sync-badge err'; }
  else { el.textContent = '🔄 connexion…'; el.className = 'sync-badge'; }
}
/* ============ CONNEXION ============ */
function showLoginScreen(){
  const login = document.getElementById('loginScreen');
  const appRoot = document.getElementById('appRoot');
  if(login) login.style.display = 'flex';
  if(appRoot) appRoot.style.display = 'none';
}
function hideLoginScreen(){
  const login = document.getElementById('loginScreen');
  const appRoot = document.getElementById('appRoot');
  if(login) login.style.display = 'none';
  if(appRoot) appRoot.style.display = 'block';
}
function handleLogin(e){
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errEl = document.getElementById('loginError');
  const btn = document.getElementById('loginSubmitBtn');
  errEl.textContent = '';
  btn.disabled = true;
  btn.textContent = 'Connexion…';
  auth.signInWithEmailAndPassword(email, password)
    .catch(err => {
      console.error('Erreur de connexion :', err);
      errEl.textContent = 'Identifiant ou mot de passe incorrect.';
    })
    .finally(() => {
      btn.disabled = false;
      btn.textContent = 'Se connecter';
    });
}
function logout(){
  if(!confirm('Se déconnecter ?')) return;
  auth.signOut();
}
window.logout = logout;
const INACTIVITY_LIMIT_MS = 5 * 60 * 1000;
let inactivityTimer = null;
let loggedOutForInactivity = false;
function resetInactivityTimer(){
  if(!auth.currentUser) return;
  if(inactivityTimer) clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    loggedOutForInactivity = true;
    auth.signOut();
  }, INACTIVITY_LIMIT_MS);
}
function clearInactivityTimer(){
  if(inactivityTimer){ clearTimeout(inactivityTimer); inactivityTimer = null; }
}
['mousemove','mousedown','keydown','scroll','touchstart','click'].forEach(evt => {
  document.addEventListener(evt, resetInactivityTimer, {passive:true});
});
function startSync(){
  const form = document.getElementById('loginForm');
  if(form) form.addEventListener('submit', handleLogin);
  auth.onAuthStateChanged(user => {
    if(!user){
      dataReady = false;
      clearInactivityTimer();
      showLoginScreen();
      if(loggedOutForInactivity){
        const errEl = document.getElementById('loginError');
        if(errEl) errEl.textContent = 'Tu as été déconnecté après 5 minutes d\'inactivité.';
        loggedOutForInactivity = false;
      }
      return;
    }
    hideLoginScreen();
    resetInactivityTimer();
    DOC_REF.onSnapshot(snap => {
      let shared;
      const banner = document.getElementById('missingDocBanner');
      if(snap.exists){
        shared = snap.data();
        if(banner) banner.style.display = 'none';
      } else {
        console.warn('Document Firestore introuvable — affichage des données de démonstration SANS écriture automatique.');
        shared = seedShared();
        if(banner) banner.style.display = 'flex';
      }
      DATA.projects = shared.projects || [];
      DATA.tasks = shared.tasks || [];
      DATA.notifications = shared.notifications || [];
      DATA.bookings = shared.bookings || [];
      DATA.artistProfile = shared.artistProfile || defaultArtistProfile();
      if(!DATA.currentProjectId || !DATA.projects.some(p => p.id === DATA.currentProjectId)){
        DATA.currentProjectId = DATA.projects[0] ? DATA.projects[0].id : null;
      }
      dataReady = true;
      setSyncBadge('ok');
      renderAll();
    }, err => {
      console.error('Erreur de synchronisation Firestore :', err);
      setSyncBadge('err');
    });
  });
}
function initializeSharedDoc(){
  if(!confirm('Créer une nouvelle base avec les données de démonstration ? À faire seulement si tu es sûr qu\'il n\'y a pas de vraies données ailleurs.')) return;
  DOC_REF.set(seedShared()).then(() => {
    const banner = document.getElementById('missingDocBanner');
    if(banner) banner.style.display = 'none';
  }).catch(err => {
    console.error('Erreur d\'initialisation Firestore :', err);
    alert('Erreur lors de la création de la base. Regarde la console (F12) pour le détail.');
  });
}
window.initializeSharedDoc = initializeSharedDoc;
function exportData(){
  const backup = {
    exportedAt: new Date().toISOString(),
    projects: DATA.projects,
    tasks: DATA.tasks,
    notifications: DATA.notifications,
    bookings: DATA.bookings,
    artistProfile: DATA.artistProfile
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `artistos-sauvegarde-${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
window.exportData = exportData;
function importData(file){
  if(!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    let parsed;
    try{
      parsed = JSON.parse(e.target.result);
    }catch(err){
      alert('Fichier invalide : ce n\'est pas un JSON lisible.');
      return;
    }
    if(!parsed.projects || !parsed.tasks){
      alert('Fichier invalide : structure inattendue (projects/tasks manquants).');
      return;
    }
    if(!confirm(`Remplacer TOUTES les données actuelles par cette sauvegarde (${parsed.projects.length} projet(s), ${parsed.tasks.length} tâche(s)) ? Cette action est irréversible.`)) return;
    setSyncBadge('saving');
    DOC_REF.set({
      projects: parsed.projects,
      tasks: parsed.tasks,
      notifications: parsed.notifications || [],
      bookings: parsed.bookings || [],
      artistProfile: parsed.artistProfile || defaultArtistProfile()
    }).then(() => setSyncBadge('ok')).catch(err => {
      console.error('Erreur de restauration Firestore :', err);
      setSyncBadge('err');
      alert('Erreur lors de la restauration. Regarde la console (F12) pour le détail.');
    });
  };
  reader.readAsText(file);
  document.getElementById('importFile').value = '';
}
window.importData = importData;
/* ============ HELPERS ============ */
function taskById(id){ return DATA.tasks.find(t=>t.id===id); }
function currentProject(){ return DATA.projects.find(p => p.id === DATA.currentProjectId) || DATA.projects[0]; }
function projectTasks(projectId){ return DATA.tasks.filter(t => t.projectId === projectId); }
function daysUntil(dateStr){
  const now = new Date();
  const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const [y, m, d] = dateStr.split('-').map(Number);
  const dueUTC = Date.UTC(y, m - 1, d);
  return Math.round((dueUTC - todayUTC) / 86400000);
}
function effectiveStatus(task){
  if(task.status === 'terminé') return 'terminé';
  const blockedBy = (task.dependsOn||[]).map(taskById).filter(dep => dep && dep.status !== 'terminé');
  if(blockedBy.length){
    return {status:'bloqué', blockedBy};
  }
  if(daysUntil(task.due) < 0){
    return 'en retard';
  }
  return task.status;
}
function fmtDue(dateStr){
  const n = daysUntil(dateStr);
  if(n < 0) return `EN RETARD DE ${Math.abs(n)} J`;
  if(n === 0) return `AUJOURD'HUI`;
  if(n === 1) return `DEMAIN`;
  return `DANS ${n} J`;
}
const roleLabel = (id) => (ROLES.find(r=>r.id===id)||{}).label || id;
/* ============ RENDER ============ */
function statusDotClass(effStatus){
  if(effStatus === 'terminé') return 'done';
  if(effStatus === 'bloqué' || (effStatus && effStatus.status === 'bloqué')) return 'blocked';
  if(effStatus === 'en retard') return 'late';
  if(effStatus === 'en cours') return 'progress';
  return 'upcoming';
}
function renderRoleSelect(){
  const sel = document.getElementById('roleSelect');
  sel.innerHTML = ROLES.map(r => `<option value="${r.id}" ${r.id===DATA.currentRole?'selected':''}>${r.icon} ${r.label}</option>`).join('');
  sel.onchange = () => {
    DATA.currentRole = sel.value;
    saveLocalPrefs();
    renderAll();
  };
}
function myTasks(){
  const role = DATA.currentRole;
  const inProject = DATA.tasks.filter(t => t.projectId === DATA.currentProjectId);
  if(role === 'artiste' || role === 'manager') return inProject;
  return inProject.filter(t => t.role === role);
}
function projectTitleOf(task){
  const p = DATA.projects.find(pr => pr.id === task.projectId);
  return p ? p.title : '';
}
function computeHealth(projectId){
  const pid = projectId || DATA.currentProjectId;
  const tasks = projectTasks(pid);
  const late = tasks.filter(t => effectiveStatus(t) === 'en retard');
  const blocked = tasks.filter(t => { const s = effectiveStatus(t); return s && s.status === 'bloqué'; });
  if(late.length > 0) return 'red';
  if(blocked.length > 1) return 'orange';
  return 'green';
}
function computeProgress(projectId){
  const pid = projectId || DATA.currentProjectId;
  const tasks = projectTasks(pid);
  if(!tasks.length) return 0;
  const done = tasks.filter(t => t.status === 'terminé').length;
  return Math.round((done/tasks.length)*100);
}
function renderHero(){
  const role = ROLES.find(r=>r.id===DATA.currentRole);
  document.getElementById('heroTitle').textContent = `Bon retour, ${role.label}`;
  const relevant = myTasks().filter(t => t.status !== 'terminé').length;
  document.getElementById('heroSub').textContent = relevant > 0
    ? `${relevant} tâche${relevant>1?'s':''} te concerne${relevant>1?'nt':''} activement.`
    : `Aucune tâche active pour toi en ce moment.`;
  document.getElementById('dateBadge').textContent = new Date().toLocaleDateString('fr-FR', {weekday:'long', day:'numeric', month:'long'});
}
function renderProject(){
  const proj = currentProject();
  if(!proj) return;
  document.getElementById('projectTitle').textContent = proj.title;
  document.getElementById('projectMeta').textContent = `${proj.type} · Sortie le ${new Date(proj.releaseDate + 'T00:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}`;
  const pct = computeProgress();
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('progressLabel').textContent = pct + '% des tâches terminées';
  const health = computeHealth();
  const dot = document.getElementById('healthDot');
  dot.className = 'health ' + health;
  dot.textContent = health === 'green' ? '🟢' : health === 'orange' ? '🟠' : '🔴';
}
function taskRowHtml(task, opts={}){
  const eff = effectiveStatus(task);
  const isBlocked = eff && eff.status === 'bloqué';
  const dotClass = statusDotClass(eff);
  const blockReason = isBlocked
    ? `Bloqué par : ${eff.blockedBy.map(b=>`"${b.title}" (${roleLabel(b.role)})`).join(', ')}`
    : '';
  const projectTag = opts.showProject ? `<span class="task-project-tag">${projectTitleOf(task)}</span>` : '';
  return `
    <div class="task ${isBlocked?'blocked':''}">
      <span class="task-dot ${dotClass}"></span>
      <div class="task-body">
        <div class="task-title">${task.title} ${projectTag}</div>
        <div class="task-sub">${roleLabel(task.role)} · ${fmtDue(task.due)}</div>
        ${blockReason ? `<div class="task-block-reason">${blockReason}</div>` : ''}
      </div>
      <select onchange="changeStatus('${task.id}', this.value)" ${isBlocked?'disabled title="Débloque d\'abord la tâche dont elle dépend"':''}>
        ${['à venir','en cours','en retard','terminé'].map(s=>`<option value="${s}" ${task.status===s?'selected':''}>${s}</option>`).join('')}
      </select>
      <button class="icon-btn" title="Modifier" onclick="editTask('${task.id}')">✎</button>
      <button class="icon-btn danger" title="Supprimer" onclick="deleteTask('${task.id}')">🗑</button>
    </div>`;
}
function renderTodayList(){
  const list = myTasks().filter(t => {
    const eff = effectiveStatus(t);
    if(eff === 'terminé') return false;
    return daysUntil(t.due) <= 2;
  }).sort((a,b)=> daysUntil(a.due) - daysUntil(b.due));
  const el = document.getElementById('todayList');
  el.innerHTML = list.length ? list.map(t=>taskRowHtml(t)).join('') : `<div class="empty">Rien d'urgent pour l'instant 👌</div>`;
}
function renderAllTasks(){
  const list = myTasks().slice().sort((a,b)=> daysUntil(a.due) - daysUntil(b.due));
  const el = document.getElementById('allTasksList');
  el.innerHTML = list.length ? list.map(t=>taskRowHtml(t)).join('') : `<div class="empty">Aucune tâche pour ce rôle pour le moment.</div>`;
}
function renderAlerts(){
  const relevant = myTasks();
  const late = relevant.filter(t => effectiveStatus(t) === 'en retard');
  const blocked = relevant.filter(t => { const s = effectiveStatus(t); return s && s.status === 'bloqué'; });
  const el = document.getElementById('alertsList');
  let html = '';
  late.forEach(t => {
    html += `<div class="alert red"><span>🔴</span><div><b>${t.title} est en retard</b><p>Échéance dépassée de ${Math.abs(daysUntil(t.due))} jour(s). Les tâches qui en dépendent risquent d'être décalées.</p></div></div>`;
  });
  blocked.forEach(t => {
    const eff = effectiveStatus(t);
    html += `<div class="alert orange"><span>🟠</span><div><b>${t.title} est bloquée</b><p>En attente de : ${eff.blockedBy.map(b=>b.title).join(', ')}.</p></div></div>`;
  });
  if(!late.length && !blocked.length){
    html = `<div class="alert green"><span>🟢</span><div><b>Tout est sous contrôle</b><p>Aucune tâche en retard ou bloquée pour ce rôle.</p></div></div>`;
  }
  el.innerHTML = html;
}
function renderNotifications(){
  const el = document.getElementById('notifList');
  el.innerHTML = DATA.notifications.map(n => `
    <div class="notif"><div class="time mono">${n.time}</div><div class="txt">${n.text}</div></div>
  `).join('');
}
function renderAll(){
  if(!dataReady || !DATA.projects || !DATA.projects.length){
    return;
  }
  renderRoleSelect();
  renderHero();
  renderProject();
  renderTodayList();
  renderAllTasks();
  renderAlerts();
  renderNotifications();
  if(document.getElementById('view-calendar').classList.contains('active')){
    renderCalendar();
  }
  if(document.getElementById('view-projects').classList.contains('active')){
    renderProjectsList();
  }
  if(document.getElementById('view-tasks').classList.contains('active')){
    renderTasksView();
  }
  if(document.getElementById('view-booking').classList.contains('active')){
    renderBookingList();
    renderArtistProfile();
  }
}
/* ============ CALENDAR ============ */
let currentMonth = new Date();
currentMonth.setDate(1);
let selectedCalDate = null;
function switchView(view){
  document.getElementById('navDashboard').classList.toggle('active', view === 'dashboard');
  document.getElementById('navCalendar').classList.toggle('active', view === 'calendar');
  document.getElementById('navProjects').classList.toggle('active', view === 'projects');
  document.getElementById('navTasks').classList.toggle('active', view === 'tasks');
  document.getElementById('navBooking').classList.toggle('active', view === 'booking');
  document.getElementById('view-dashboard').classList.toggle('active', view === 'dashboard');
  document.getElementById('view-calendar').classList.toggle('active', view === 'calendar');
  document.getElementById('view-projects').classList.toggle('active', view === 'projects');
  document.getElementById('view-tasks').classList.toggle('active', view === 'tasks');
  document.getElementById('view-booking').classList.toggle('active', view === 'booking');
  if(view === 'calendar') renderCalendar();
  if(view === 'projects') renderProjectsList();
  if(view === 'tasks') renderTasksView();
  if(view === 'booking'){ renderBookingList(); renderArtistProfile(); }
}
window.switchView = switchView;
function shiftMonth(delta){
  currentMonth.setMonth(currentMonth.getMonth() + delta);
  renderCalendar();
}
window.shiftMonth = shiftMonth;
function tasksByDate(){
  const map = {};
  myTasks().forEach(t => {
    (map[t.due] = map[t.due] || []).push(t);
  });
  return map;
}
function renderCalendar(){
  const label = currentMonth.toLocaleDateString('fr-FR', {month:'long', year:'numeric'});
  document.getElementById('calMonthLabel').textContent = label;
  const map = tasksByDate();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const todayStr = new Date().toISOString().slice(0,10);
  let cells = [];
  for(let i = startOffset - 1; i >= 0; i--){
    cells.push({day: prevMonthDays - i, outside: true, dateStr: null});
  }
  for(let d = 1; d <= daysInMonth; d++){
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    cells.push({day: d, outside: false, dateStr});
  }
  while(cells.length % 7 !== 0){
    cells.push({day: '', outside: true, dateStr: null});
  }
  const el = document.getElementById('calGrid');
  el.innerHTML = cells.map(c => {
    if(c.outside) return `<div class="cal-day outside"><div class="num">${c.day}</div></div>`;
    const tasks = map[c.dateStr] || [];
    const isToday = c.dateStr === todayStr;
    const pills = tasks.slice(0,3).map(t => {
      const eff = effectiveStatus(t);
      const cls = statusDotClass(eff);
      return `<span class="cal-pill ${cls}">${t.title}</span>`;
    }).join('');
    const more = tasks.length > 3 ? `<span class="cal-pill more">+${tasks.length - 3}</span>` : '';
    const hasTasks = tasks.length ? 'has-tasks' : '';
    return `<div class="cal-day ${isToday?'today':''} ${hasTasks}" onclick="showDayTasks('${c.dateStr}')"><div class="num">${c.day}</div>${pills}${more}</div>`;
  }).join('');
  if(selectedCalDate){
    showDayTasks(selectedCalDate);
  }
}
function showDayTasks(dateStr){
  selectedCalDate = dateStr;
  const map = tasksByDate();
  const tasks = map[dateStr] || [];
  const card = document.getElementById('calDayCard');
  const title = document.getElementById('calDayTitle');
  const list = document.getElementById('calDayTasks');
  const d = new Date(dateStr + 'T00:00:00');
  title.textContent = d.toLocaleDateString('fr-FR', {weekday:'long', day:'numeric', month:'long'});
  list.innerHTML = tasks.length ? tasks.map(t => taskRowHtml(t, {showProject:true})).join('') : `<div class="empty">Aucune tâche ce jour-là pour ce rôle.</div>`;
  card.style.display = 'block';
}
window.showDayTasks = showDayTasks;
/* ============ INTERACTIONS ============ */
function changeStatus(taskId, newStatus){
  const task = taskById(taskId);
  if(!task) return;
  const oldStatus = task.status;
  task.status = newStatus;
  if(newStatus === 'terminé' && oldStatus !== 'terminé'){
    const dependents = DATA.tasks.filter(t => (t.dependsOn||[]).includes(taskId));
    if(dependents.length){
      DATA.notifications.unshift({
        time: 'À l\'instant',
        text: `✅ ${task.title} terminé. Prochaine étape : ${dependents.map(d=>d.title).join(', ')}.`
      });
    }
  }
  saveData(DATA);
  renderAll();
}
window.changeStatus = changeStatus;
function editTask(id){
  const task = taskById(id);
  if(!task) return;
  const newTitle = prompt('Titre de la tâche :', task.title);
  if(newTitle === null) return;
  const newDue = prompt('Date d\'échéance (AAAA-MM-JJ) :', task.due);
  if(newDue === null) return;
  if(newTitle.trim()) task.title = newTitle.trim();
  if(/^\d{4}-\d{2}-\d{2}$/.test(newDue.trim())) task.due = newDue.trim();
  else if(newDue.trim() !== task.due){
    alert('Format de date invalide, la date n\'a pas été changée (utilise AAAA-MM-JJ).');
  }
  saveData(DATA);
  renderAll();
}
window.editTask = editTask;
function deleteTask(id){
  const task = taskById(id);
  if(!task) return;
  const dependents = DATA.tasks.filter(t => (t.dependsOn||[]).includes(id));
  const warn = dependents.length
    ? `Attention : ${dependents.length} tâche(s) dépendent de "${task.title}" et perdront cette dépendance. `
    : '';
  if(!confirm(`${warn}Supprimer "${task.title}" ? Cette action est irréversible.`)) return;
  DATA.tasks = DATA.tasks.filter(t => t.id !== id);
  DATA.tasks.forEach(t => { t.dependsOn = (t.dependsOn||[]).filter(d => d !== id); });
  saveData(DATA);
  renderAll();
}
window.deleteTask = deleteTask;
function editProject(id, evt){
  if(evt) evt.stopPropagation();
  const proj = DATA.projects.find(p => p.id === id);
  if(!proj) return;
  const newTitle = prompt('Titre du projet :', proj.title);
  if(newTitle === null) return;
  const newDate = prompt('Date de sortie (AAAA-MM-JJ) :', proj.releaseDate);
  if(newDate === null) return;
  if(newTitle.trim()) proj.title = newTitle.trim();
  const trimmedDate = newDate.trim();
  if(/^\d{4}-\d{2}-\d{2}$/.test(trimmedDate)){
    if(trimmedDate !== proj.releaseDate){
      const oldDate = proj.releaseDate;
      const oldD = new Date(oldDate + 'T00:00:00');
      const newD = new Date(trimmedDate + 'T00:00:00');
      const delta = Math.round((newD - oldD) / 86400000);
      proj.releaseDate = trimmedDate;
      if(delta !== 0){
        DATA.tasks.filter(t => t.projectId === id).forEach(t => {
          t.due = addDaysTo(t.due, delta);
        });
        DATA.notifications.unshift({
          time: 'À l\'instant',
          text: `📅 Date de sortie de "${proj.title}" modifiée. Toutes ses tâches ont été décalées de ${delta > 0 ? '+' : ''}${delta} jour(s).`
        });
      }
    }
  } else if(trimmedDate !== proj.releaseDate){
    alert('Format de date invalide, la date n\'a pas été changée (utilise AAAA-MM-JJ).');
  }
  saveData(DATA);
  renderProjectsList();
  renderAll();
}
window.editProject = editProject;
function resyncProjectTasks(id, evt){
  if(evt) evt.stopPropagation();
  const proj = DATA.projects.find(p => p.id === id);
  if(!proj) return;
  if(!confirm(`Recalculer toutes les dates des tâches générées automatiquement pour "${proj.title}", à partir de sa date de sortie actuelle (${proj.releaseDate}) ? Les tâches ajoutées manuellement ne sont pas concernées.`)) return;
  let count = 0;
  DATA.tasks.filter(t => t.projectId === id).forEach(t => {
    const prefix = id + '_';
    if(t.id.startsWith(prefix)){
      const key = t.id.slice(prefix.length);
      const template = RELEASE_TEMPLATE.find(item => item.key === key);
      if(template){
        t.due = addDaysTo(proj.releaseDate, template.offset);
        count++;
      }
    }
  });
  saveData(DATA);
  renderProjectsList();
  renderAll();
  alert(`${count} tâche(s) recalculée(s) avec succès.`);
}
window.resyncProjectTasks = resyncProjectTasks;
function deleteProject(id, evt){
  if(evt) evt.stopPropagation();
  const proj = DATA.projects.find(p => p.id === id);
  if(!proj) return;
  if(DATA.projects.length <= 1){
    alert('Impossible de supprimer le dernier projet restant.');
    return;
  }
  if(!confirm(`Supprimer le projet "${proj.title}" et toutes ses tâches ? Cette action est irréversible.`)) return;
  DATA.projects = DATA.projects.filter(p => p.id !== id);
  DATA.tasks = DATA.tasks.filter(t => t.projectId !== id);
  if(DATA.currentProjectId === id){
    DATA.currentProjectId = DATA.projects[0].id;
  }
  saveData(DATA);
  renderProjectsList();
  renderAll();
}
window.deleteProject = deleteProject;
/* ============ PROJECTS ============ */
const RELEASE_TEMPLATE = [
  {key:'arrangement', title:'Arrangement', role:'arrangeur', offset:-35, deps:[]},
  {key:'enregistrement', title:'Enregistrement', role:'arrangeur', offset:-32, deps:['arrangement']},
  {key:'mixage', title:'Mixage', role:'arrangeur', offset:-28, deps:['enregistrement']},
  {key:'mastering', title:'Mastering', role:'producteur', offset:-24, deps:['mixage']},
  {key:'prepa_master', title:'Préparation du master', role:'producteur', offset:-21, deps:['mastering']},
  {key:'transmission', title:'Transmission au distributeur', role:'producteur', offset:-20, deps:['prepa_master']},
  {key:'pitching', title:'Pitching plateformes', role:'producteur', offset:-17, deps:['transmission']},
  {key:'verification', title:'Vérification métadonnées', role:'producteur', offset:-9, deps:['pitching']},
  {key:'shooting', title:'Shooting pochette', role:'photographe', offset:-18, deps:[]},
  {key:'selection', title:'Sélection & retouches photos', role:'photographe', offset:-14, deps:['shooting']},
  {key:'pochette', title:'Création pochette', role:'infographiste', offset:-12, deps:['selection']},
  {key:'affiches', title:'Affiches', role:'infographiste', offset:-9, deps:['pochette']},
  {key:'visuels', title:'Visuels réseaux sociaux', role:'infographiste', offset:-8, deps:['pochette']},
  {key:'prepa_video', title:'Préparation vidéo', role:'videaste', offset:-19, deps:[]},
  {key:'tournage', title:'Tournage clip', role:'videaste', offset:-13, deps:['prepa_video']},
  {key:'montage', title:'Montage clip', role:'videaste', offset:-7, deps:['tournage']},
  {key:'audio_final', title:'Intégration audio final', role:'videaste', offset:-6, deps:['montage','mixage']},
  {key:'validation_video', title:'Validation version finale', role:'videaste', offset:-3, deps:['audio_final']},
  {key:'teaser', title:'Teaser', role:'cm', offset:-9, deps:['visuels']},
  {key:'extrait', title:'Extrait promotionnel', role:'cm', offset:-6, deps:['validation_video']},
  {key:'compte_a_rebours', title:'Compte à rebours', role:'cm', offset:-1, deps:['affiches']},
  {key:'communication', title:'Communication de sortie', role:'cm', offset:0, deps:['verification','compte_a_rebours']},
];
function addDaysTo(dateStr, n){
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + n);
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(dt.getUTCDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}
function slugify(str){
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'') || 'projet';
}
function generateReleasePlan(project){
  const idPrefix = project.id;
  RELEASE_TEMPLATE.forEach(item => {
    DATA.tasks.push({
      id: `${idPrefix}_${item.key}`,
      projectId: idPrefix,
      title: item.title,
      role: item.role,
      status: 'à venir',
      due: addDaysTo(project.releaseDate, item.offset),
      dependsOn: item.deps.map(k => `${idPrefix}_${k}`),
    });
  });
}
function renderProjectsList(){
  const el = document.getElementById('projectsList');
  const sortedProjects = DATA.projects.slice().sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
  el.innerHTML = sortedProjects.map(p => {
    const pct = computeProgress(p.id);
    const health = computeHealth(p.id);
    const healthIcon = health === 'green' ? '🟢' : health === 'orange' ? '🟠' : '🔴';
    const isCurrent = p.id === DATA.currentProjectId;
    return `
      <div class="proj-card ${isCurrent?'current':''}" onclick="setCurrentProject('${p.id}')">
        <div class="proj-card-top">
          <h3>${p.title}</h3>
          <div class="proj-card-actions">
            <span class="proj-health">${healthIcon}</span>
            <button class="icon-btn" title="Resynchroniser les tâches avec la date de sortie" onclick="resyncProjectTasks('${p.id}', event)">🔄</button>
            <button class="icon-btn" title="Modifier" onclick="editProject('${p.id}', event)">✎</button>
            <button class="icon-btn danger" title="Supprimer" onclick="deleteProject('${p.id}', event)">🗑</button>
          </div>
        </div>
        <div class="proj-meta">${p.type} · Sortie le ${new Date(p.releaseDate + 'T00:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}</div>
        <div class="progress-outer"><div class="progress-inner" style="width:${pct}%"></div></div>
        <div class="progress-label">${pct}% terminé</div>
      </div>`;
  }).join('');
}
function setCurrentProject(id){
  DATA.currentProjectId = id;
  saveLocalPrefs();
  switchView('dashboard');
  renderAll();
}
window.setCurrentProject = setCurrentProject;
document.getElementById('newProjectForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('npTitle').value.trim();
  const type = document.getElementById('npType').value;
  const releaseDate = document.getElementById('npDate').value;
  if(!title || !releaseDate) return;
  let id = slugify(title);
  if(DATA.projects.some(p => p.id === id)){
    id = id + '_' + Math.random().toString(36).slice(2,6);
  }
  const project = {id, title, type, releaseDate};
  DATA.projects.push(project);
  generateReleasePlan(project);
  DATA.notifications.unshift({
    time: 'À l\'instant',
    text: `📅 Nouvelle sortie créée : ${title}. Le plan de production a été généré automatiquement (${RELEASE_TEMPLATE.length} tâches).`
  });
  DATA.currentProjectId = id;
  saveData(DATA);
  e.target.reset();
  switchView('dashboard');
  renderAll();
});
/* ============ TASKS VIEW ============ */
function renderTasksView(){
  const proj = currentProject();
  const sel = document.getElementById('ntRole');
  if(sel && !sel.dataset.filled){
    sel.innerHTML = ROLES.filter(r => r.id !== 'artiste').map(r => `<option value="${r.id}">${r.icon} ${r.label}</option>`).join('');
    sel.dataset.filled = '1';
  }
  if(!proj){
    document.getElementById('tasksViewTitle').textContent = 'Aucun projet';
    document.getElementById('tasksFullList').innerHTML = `<div class="empty">Crée d'abord un projet dans l'onglet Projets.</div>`;
    return;
  }
  document.getElementById('tasksViewTitle').textContent = `Tâches de ${proj.title}`;
  document.getElementById('tasksSub').textContent = `Toutes les tâches de ${proj.title}, tous métiers confondus.`;
  const list = projectTasks(proj.id).slice().sort((a,b)=> daysUntil(a.due) - daysUntil(b.due));
  const el = document.getElementById('tasksFullList');
  el.innerHTML = list.length ? list.map(t => taskRowHtml(t)).join('') : `<div class="empty">Aucune tâche pour ce projet pour le moment.</div>`;
}
document.getElementById('newTaskForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const proj = currentProject();
  if(!proj){ alert('Crée d\'abord un projet dans l\'onglet Projets.'); return; }
  const title = document.getElementById('ntTitle').value.trim();
  const role = document.getElementById('ntRole').value;
  const due = document.getElementById('ntDue').value;
  if(!title || !due) return;
  const id = `${proj.id}_${slugify(title)}_${Math.random().toString(36).slice(2,6)}`;
  DATA.tasks.push({
    id, projectId: proj.id, title, role, status: 'à venir', due, dependsOn: []
  });
  DATA.notifications.unshift({
    time: 'À l\'instant',
    text: `🆕 Nouvelle tâche créée : ${title} (${roleLabel(role)}).`
  });
  saveData(DATA);
  e.target.reset();
  renderAll();
});
/* ============ BOOKING (agenda de l'artiste) ============ */
function bookingById(id){ return DATA.bookings.find(b=>b.id===id); }
function bookingStatusInfo(b){
  if(b.confirmation === 'annulé') return {label:'Annulé', cls:'blocked'};
  if(b.status === 'terminé') return {label:'Terminé', cls:'done'};
  const n = daysUntil(b.date);
  if(n < 0) return {label:'Passé (non marqué terminé)', cls:'late'};
  if(n === 0) return {label:"Aujourd'hui", cls:'progress'};
  if(n === 1) return {label:'Demain', cls:'upcoming'};
  return {label:`Dans ${n} j`, cls:'upcoming'};
}
function confirmationTag(b){
  const c = b.confirmation || 'confirmé';
  if(c === 'annulé') return `<span class="booking-confirm-tag cancelled">Annulé</span>`;
  if(c === 'option') return `<span class="booking-confirm-tag option">En option</span>`;
  return `<span class="booking-confirm-tag confirmed">Confirmé</span>`;
}
function bookingRowHtml(b){
  const info = bookingStatusInfo(b);
  const timeStr = b.time ? ` · ${b.time}` : '';
  const locationStr = b.location ? ` · 📍 ${b.location}` : '';
  const contactStr = b.contact ? ` · ☎️ ${b.contact}` : '';
  const dateStr = new Date(b.date + 'T00:00:00').toLocaleDateString('fr-FR', {day:'numeric', month:'long', year:'numeric'});
  return `
    <div class="task">
      <span class="task-dot ${info.cls}"></span>
      <div class="task-body">
        <div class="task-title">${b.title} <span class="task-project-tag">${b.type}</span>${confirmationTag(b)}</div>
        <div class="task-sub">${dateStr}${timeStr}${locationStr}${contactStr} · ${info.label}</div>
        ${b.notes ? `<div class="task-block-reason" style="color:var(--muted);">${b.notes}</div>` : ''}
      </div>
      <select onchange="changeBookingConfirmation('${b.id}', this.value)" title="Statut de confirmation">
        <option value="confirmé" ${(b.confirmation||'confirmé')==='confirmé'?'selected':''}>Confirmé</option>
        <option value="option" ${b.confirmation==='option'?'selected':''}>En option</option>
        <option value="annulé" ${b.confirmation==='annulé'?'selected':''}>Annulé</option>
      </select>
      <select onchange="changeBookingStatus('${b.id}', this.value)" title="Statut de l'événement">
        <option value="à venir" ${b.status!=='terminé'?'selected':''}>à venir</option>
        <option value="terminé" ${b.status==='terminé'?'selected':''}>terminé</option>
      </select>
      <button class="icon-btn" title="Modifier" onclick="editBooking('${b.id}')">✎</button>
      <button class="icon-btn danger" title="Supprimer" onclick="deleteBooking('${b.id}')">🗑</button>
    </div>`;
}
function renderBookingList(){
  const upcoming = DATA.bookings.filter(b => b.status !== 'terminé').sort((a,b)=> daysUntil(a.date) - daysUntil(b.date));
  const past = DATA.bookings.filter(b => b.status === 'terminé').sort((a,b)=> daysUntil(b.date) - daysUntil(a.date));
  const upEl = document.getElementById('bookingUpcomingList');
  const pastEl = document.getElementById('bookingPastList');
  if(upEl) upEl.innerHTML = upcoming.length ? upcoming.map(b=>bookingRowHtml(b)).join('') : `<div class="empty">Aucun événement à venir pour l'instant.</div>`;
  if(pastEl) pastEl.innerHTML = past.length ? past.map(b=>bookingRowHtml(b)).join('') : `<div class="empty">Aucun événement terminé pour l'instant.</div>`;
}
function changeBookingStatus(id, status){
  const b = bookingById(id);
  if(!b) return;
  b.status = status;
  saveData(DATA);
  renderBookingList();
}
window.changeBookingStatus = changeBookingStatus;
function changeBookingConfirmation(id, value){
  const b = bookingById(id);
  if(!b) return;
  b.confirmation = value;
  saveData(DATA);
  renderBookingList();
}
window.changeBookingConfirmation = changeBookingConfirmation;
function editBooking(id){
  const b = bookingById(id);
  if(!b) return;
  const newTitle = prompt('Titre :', b.title);
  if(newTitle === null) return;
  const newLocation = prompt('Lieu :', b.location || '');
  if(newLocation === null) return;
  const newDate = prompt('Date (AAAA-MM-JJ) :', b.date);
  if(newDate === null) return;
  const newTime = prompt('Heure (HH:MM, laisse vide si aucune) :', b.time || '');
  if(newTime === null) return;
  const newContact = prompt('Contact sur place (nom, téléphone) :', b.contact || '');
  if(newContact === null) return;
  const newConfirmation = prompt('Statut de confirmation (confirmé / option / annulé) :', b.confirmation || 'confirmé');
  if(newConfirmation === null) return;
  const newNotes = prompt('Détails / ce qu\'il y aura à faire :', b.notes || '');
  if(newNotes === null) return;
  if(newTitle.trim()) b.title = newTitle.trim();
  b.location = newLocation.trim();
  if(/^\d{4}-\d{2}-\d{2}$/.test(newDate.trim())) b.date = newDate.trim();
  else if(newDate.trim() !== b.date){
    alert('Format de date invalide, la date n\'a pas été changée (utilise AAAA-MM-JJ).');
  }
  b.time = newTime.trim();
  b.contact = newContact.trim();
  const conf = newConfirmation.trim().toLowerCase();
  b.confirmation = ['confirmé','option','annulé'].includes(conf) ? conf : (b.confirmation || 'confirmé');
  b.notes = newNotes.trim();
  saveData(DATA);
  renderBookingList();
}
window.editBooking = editBooking;
function deleteBooking(id){
  const b = bookingById(id);
  if(!b) return;
  if(!confirm(`Supprimer "${b.title}" de l'agenda ? Cette action est irréversible.`)) return;
  DATA.bookings = DATA.bookings.filter(x => x.id !== id);
  saveData(DATA);
  renderBookingList();
}
window.deleteBooking = deleteBooking;
document.getElementById('newBookingForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('bkTitle').value.trim();
  const location = document.getElementById('bkLocation').value.trim();
  const type = document.getElementById('bkType').value;
  const confirmation = document.getElementById('bkConfirmation').value;
  const date = document.getElementById('bkDate').value;
  const time = document.getElementById('bkTime').value;
  const contact = document.getElementById('bkContact').value.trim();
  const notes = document.getElementById('bkNotes').value.trim();
  if(!title || !date || !location) return;
  const id = `bk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,6)}`;
  DATA.bookings.push({ id, title, location, type, confirmation, date, time, contact, notes, status: 'à venir' });
  saveData(DATA);
  e.target.reset();
  renderBookingList();
});
/* ============ PROFIL ARTISTE & PDF ============ */
function renderArtistProfile(){
  const p = Object.assign(defaultArtistProfile(), DATA.artistProfile || {});
  const el = document.getElementById('artistProfileView');
  if(!el) return;
  const rows = [
    ['Nom d\'artiste', p.name],
    ['Genre musical', p.genre],
    ['Bio', p.bio],
    ['Manager / Contact', p.manager],
    ['Téléphone', p.phone],
    ['Email', p.email],
  ];
  el.innerHTML = rows.map(([label, val]) => `<div class="row"><b>${label}</b><span>${val ? val : 'Non renseigné'}</span></div>`).join('');
}
function editArtistProfile(){
  const p = Object.assign(defaultArtistProfile(), DATA.artistProfile || {});
  const name = prompt('Nom d\'artiste :', p.name);
  if(name === null) return;
  const genre = prompt('Genre musical :', p.genre);
  if(genre === null) return;
  const bio = prompt('Bio courte :', p.bio);
  if(bio === null) return;
  const manager = prompt('Manager / Contact :', p.manager);
  if(manager === null) return;
  const phone = prompt('Téléphone :', p.phone);
  if(phone === null) return;
  const email = prompt('Email :', p.email);
  if(email === null) return;
  DATA.artistProfile = {
    name: name.trim(), genre: genre.trim(), bio: bio.trim(),
    manager: manager.trim(), phone: phone.trim(), email: email.trim()
  };
  saveData(DATA);
  renderArtistProfile();
}
window.editArtistProfile = editArtistProfile;

function downloadBookingPDF(){
  if(!window.jspdf){
    alert('Le générateur de PDF n\'a pas pu se charger. Vérifie ta connexion et réessaie.');
    return;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit:'mm', format:'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const p = Object.assign(defaultArtistProfile(), DATA.artistProfile || {});

  /* ---------- Palette (identique à celle du site) ---------- */
  const violet = [139,92,246];
  const violetDark = [104,58,214];
  const blue = [91,157,249];
  const dark = [33,30,48];
  const muted = [117,113,140];
  const surfaceSoft = [241,240,250];
  const border = [222,214,247];
  const white = [255,255,255];
  const green = [32,178,108];
  const orange = [245,165,36];
  const red = [239,90,90];

  const MARGIN_L = 14;
  const SIDEBAR_W = 15; // largeur réservée au grand mot "PROGRAMME" vertical
  const CONTENT_X = MARGIN_L + SIDEBAR_W;
  const CONTENT_R = pageWidth - 12;
  const FOOTER_H = 12;
  const BOTTOM_LIMIT = pageHeight - FOOTER_H - 12;

  function lerp(a,b,t){ return a + (b-a)*t; }
  function lerpColor(c1,c2,t){ return [lerp(c1[0],c2[0],t), lerp(c1[1],c2[1],t), lerp(c1[2],c2[2],t)]; }

  /* ---------- En-tête (bandeau dégradé violet -> bleu, façon identité du site) ---------- */
  function drawHeader(){
    const headerH = 46;
    const bands = 70;
    for(let i=0;i<bands;i++){
      const t = i/(bands-1);
      const [r,g,b] = lerpColor(violet, blue, t);
      doc.setFillColor(r,g,b);
      doc.rect(0, (headerH/bands)*i, pageWidth, (headerH/bands)+0.5, 'F');
    }
    doc.setFillColor(...white);
    doc.circle(17, 13.5, 1.7, 'F');
    doc.setTextColor(...white);
    doc.setFont('helvetica','bold');
    doc.setFontSize(9);
    doc.text('ARTIST OS', 21.5, 15);

    doc.setFont('helvetica','bold');
    doc.setFontSize(25);
    doc.text((p.name || 'Programme artiste').toUpperCase(), MARGIN_L, 30);

    doc.setFont('helvetica','normal');
    doc.setFontSize(11);
    doc.text('Programme complet · Booking', MARGIN_L, 38);

    const yearStr = String(new Date().getFullYear());
    doc.setFillColor(...white);
    doc.roundedRect(pageWidth - 36, 8, 22, 13, 3, 3, 'F');
    doc.setTextColor(...violetDark);
    doc.setFont('helvetica','bold');
    doc.setFontSize(14);
    doc.text(yearStr, pageWidth - 25, 17, {align:'center'});

    doc.setTextColor(...white);
    doc.setFont('helvetica','normal');
    doc.setFontSize(7.5);
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}`, pageWidth - 12, 27, {align:'right'});

    return headerH;
  }

  const pageContentTop = {1: 0};
  let y = drawHeader() + 12;

  /* ---------- Profil (compact, une seule ligne + bio courte) ---------- */
  doc.setTextColor(...dark);
  doc.setFont('helvetica','bold');
  doc.setFontSize(10.5);
  doc.text('PROFIL', CONTENT_X, y);
  y += 6;
  const profileBits = [
    p.genre || null,
    p.manager ? `Manager : ${p.manager}` : null,
    p.phone ? `Tél : ${p.phone}` : null,
    p.email ? `Email : ${p.email}` : null,
  ].filter(Boolean);
  if(profileBits.length){
    doc.setFont('helvetica','normal');
    doc.setFontSize(9);
    doc.setTextColor(...muted);
    doc.text(profileBits.join('   ·   '), CONTENT_X, y);
    y += 5.5;
  }
  if(p.bio){
    doc.setFont('helvetica','normal');
    doc.setFontSize(9);
    doc.setTextColor(...dark);
    const bioLines = doc.splitTextToSize(p.bio, CONTENT_R - CONTENT_X);
    doc.text(bioLines, CONTENT_X, y);
    y += bioLines.length * 4.6 + 2;
  }
  y += 5;
  doc.setDrawColor(...surfaceSoft);
  doc.setLineWidth(0.4);
  doc.line(CONTENT_X, y, CONTENT_R, y);
  y += 8;

  pageContentTop[1] = y;

  /* ---------- Ajout de page avec suivi des bornes (pour le mot vertical + pied de page) ---------- */
  function ensureSpace(needed){
    if(y + needed > BOTTOM_LIMIT){
      doc.addPage();
      const pageNum = doc.internal.getNumberOfPages();
      y = 18;
      pageContentTop[pageNum] = y;
      return true;
    }
    return false;
  }

  /* ---------- Programme groupé par date ---------- */
  const events = (DATA.bookings || []).slice().sort((a,b)=> daysUntil(a.date) - daysUntil(b.date));

  doc.setFont('helvetica','bold');
  doc.setFontSize(12.5);
  doc.setTextColor(...dark);
  doc.text('PROGRAMME', CONTENT_X, y);
  y += 9;

  if(!events.length){
    doc.setFont('helvetica','normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...muted);
    doc.text('Aucun événement enregistré pour le moment.', CONTENT_X, y);
  }

  const groups = [];
  events.forEach(b => {
    let g = groups.find(gr => gr.date === b.date);
    if(!g){ g = {date:b.date, items:[]}; groups.push(g); }
    g.items.push(b);
  });

  groups.forEach(group => {
    ensureSpace(16);
    const dLabel = new Date(group.date + 'T00:00:00').toLocaleDateString('fr-FR', {weekday:'long', day:'2-digit', month:'long', year:'numeric'});
    const dLabelCap = dLabel.charAt(0).toUpperCase() + dLabel.slice(1);
    doc.setFont('helvetica','bold');
    doc.setFontSize(11);
    doc.setTextColor(...violetDark);
    doc.text(dLabelCap, CONTENT_X, y);
    y += 7;

    group.items.forEach(b => {
      const isCancelled = b.confirmation === 'annulé';
      const isDone = b.status === 'terminé';
      const confirmColor = isCancelled ? red : (b.confirmation === 'option' ? orange : green);
      const confirmLabel = isCancelled ? 'ANNULÉ' : (b.confirmation === 'option' ? 'EN OPTION' : 'CONFIRMÉ');
      const eff = bookingStatusInfo(b);
      const accentColor = isCancelled ? muted : (isDone ? green : (statusDotClass(eff.cls) ? blue : blue));

      /* -- ligne pilule horaire + statut de confirmation -- */
      const pillH = 7;
      ensureSpace(pillH + 4);
      if(b.time){
        const pillW = doc.getTextWidth(b.time) + 12;
        doc.setDrawColor(...violet);
        doc.setLineWidth(0.5);
        doc.roundedRect(CONTENT_X, y, pillW, pillH, pillH/2, pillH/2, 'S');
        doc.setTextColor(...violetDark);
        doc.setFont('helvetica','bold');
        doc.setFontSize(9);
        doc.text(b.time, CONTENT_X + pillW/2, y + pillH/2 + 1.2, {align:'center'});
      }
      doc.setFont('helvetica','bold');
      doc.setFontSize(7.5);
      doc.setTextColor(...confirmColor);
      doc.text(confirmLabel, CONTENT_R, y + pillH/2 + 1, {align:'right'});
      y += pillH + 2.5;

      /* -- calcul du contenu de la boîte -- */
      const boxX = CONTENT_X;
      const boxW = CONTENT_R - CONTENT_X;
      const innerX = boxX + 5;
      const innerW = boxW - 10;
      doc.setFont('helvetica','normal');
      doc.setFontSize(8.3);
      const locLine = b.location ? `Lieu : ${b.location}` : null;
      const contactLine = b.contact ? `Contact : ${b.contact}` : null;
      const noteLines = b.notes ? doc.splitTextToSize(`Notes : ${b.notes}`, innerW) : [];

      let boxH = 5 + 6; // padding haut + ligne titre
      if(locLine) boxH += 4.6;
      if(contactLine) boxH += 4.6;
      if(noteLines.length) boxH += noteLines.length * 4.2;
      boxH += 4; // padding bas

      ensureSpace(boxH + 5);

      doc.setFillColor(...(isCancelled ? [248,247,252] : white));
      doc.setDrawColor(...border);
      doc.setLineWidth(0.4);
      doc.roundedRect(boxX, y, boxW, boxH, 2.5, 2.5, 'FD');
      // liseré de statut à gauche de la boîte
      doc.setFillColor(...accentColor);
      doc.roundedRect(boxX, y, 1.6, boxH, 0.8, 0.8, 'F');

      let ty = y + 7;
      doc.setFont('helvetica','bold');
      doc.setFontSize(10);
      doc.setTextColor(...(isCancelled ? muted : dark));
      doc.text(b.title || '', innerX, ty);
      const titleW = doc.getTextWidth(b.title || '');
      if(b.type){
        doc.setFont('helvetica','normal');
        doc.setFontSize(8);
        doc.setTextColor(...blue);
        doc.text(b.type, innerX + titleW + 4, ty);
      }
      if(isDone){
        doc.setFont('helvetica','bold');
        doc.setFontSize(7.5);
        doc.setTextColor(...green);
        doc.text('TERMINÉ', boxX + boxW - 5, ty, {align:'right'});
      }
      ty += 5;
      doc.setFont('helvetica','normal');
      doc.setFontSize(8.3);
      doc.setTextColor(...muted);
      if(locLine){ doc.text(locLine, innerX, ty); ty += 4.6; }
      if(contactLine){ doc.text(contactLine, innerX, ty); ty += 4.6; }
      if(noteLines.length){
        doc.setTextColor(...dark);
        doc.text(noteLines, innerX, ty);
        ty += noteLines.length * 4.2;
      }

      y += boxH + 6;
    });
    y += 2;
  });

  /* ---------- Mot vertical "PROGRAMME" + pied de page violet, sur chaque page ---------- */
  const pageCount = doc.internal.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++){
    doc.setPage(i);

    doc.setTextColor(...violet);
    doc.setFont('helvetica','bold');
    doc.setFontSize(32);
    doc.text('PROGRAMME', 9, pageHeight - 22, {angle:90});

    const barY = pageHeight - FOOTER_H - 4;
    doc.setFillColor(...violet);
    doc.roundedRect(CONTENT_X, barY, CONTENT_R - CONTENT_X, FOOTER_H, FOOTER_H/2, FOOTER_H/2, 'F');
    doc.setTextColor(...white);
    doc.setFont('helvetica','bold');
    doc.setFontSize(8);
    const contactBits = [p.phone, p.email].filter(Boolean).join('   ·   ');
    doc.text(contactBits || p.manager || p.name || 'Artist OS', CONTENT_X + 6, barY + FOOTER_H/2 + 1.3);
    doc.setFont('helvetica','normal');
    doc.setFontSize(7.5);
    doc.text(`page ${i}/${pageCount}`, CONTENT_R - 6, barY + FOOTER_H/2 + 1.3, {align:'right'});
  }

  const filename = `programme-${slugify(p.name || 'artiste')}-${new Date().toISOString().slice(0,10)}.pdf`;
  doc.save(filename);
}
window.downloadBookingPDF = downloadBookingPDF;
/* ============ INIT ============ */
startSync();
