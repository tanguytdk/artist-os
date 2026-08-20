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
/* Échappe tout texte saisi par un utilisateur avant de l'insérer dans du HTML,
   pour empêcher qu'un titre/note contenant des balises (ex. <script>) ne s'exécute
   dans le navigateur d'un autre membre de l'équipe (faille XSS stockée). */
function escapeHtml(str){
  if(str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
function defaultArtistProfile(){
  return { name:'Tanguy DJE RoiStar', genre:'', bio:'', manager:'', phone:'', email:'', rolePin:'0000', calAllAccessPin:'1234' };
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
      {id:'t1', projectId:'destin', title:'Arrangement du morceau', role:'arrangeur', situation:'terminé', dateDebut:d(-28), due:d(-20), dependsOn:[], waitingReason:'', manualBlockReason:'', finalDelay:null},
      {id:'t2', projectId:'destin', title:'Mixage', role:'arrangeur', situation:'en cours', dateDebut:d(-7), due:d(-2), dependsOn:['t1'], waitingReason:'', manualBlockReason:'', finalDelay:null},
      {id:'t3', projectId:'destin', title:'Mastering', role:'producteur', situation:'à venir', dateDebut:d(1), due:d(3), dependsOn:['t2'], waitingReason:'', manualBlockReason:'', finalDelay:null},
      {id:'t4', projectId:'destin', title:'Transmission au distributeur', role:'producteur', situation:'à venir', dateDebut:d(4), due:d(6), dependsOn:['t3'], waitingReason:'', manualBlockReason:'', finalDelay:null},
      {id:'t5', projectId:'destin', title:'Pitching plateformes', role:'producteur', situation:'à venir', dateDebut:d(7), due:d(9), dependsOn:['t4'], waitingReason:'', manualBlockReason:'', finalDelay:null},
      {id:'t6', projectId:'destin', title:'Shooting pochette', role:'photographe', situation:'en cours', dateDebut:d(-1), due:d(1), dependsOn:[], waitingReason:'', manualBlockReason:'', finalDelay:null},
      {id:'t7', projectId:'destin', title:'Sélection & retouches photos', role:'photographe', situation:'en attente', dateDebut:d(2), due:d(3), dependsOn:['t6'], waitingReason:'Shooting pas encore livré', manualBlockReason:'', finalDelay:null},
      {id:'t8', projectId:'destin', title:'Création pochette', role:'infographiste', situation:'à venir', dateDebut:d(4), due:d(5), dependsOn:['t7'], waitingReason:'', manualBlockReason:'', finalDelay:null},
      {id:'t9', projectId:'destin', title:'Visuels réseaux sociaux', role:'infographiste', situation:'à venir', dateDebut:d(7), due:d(8), dependsOn:['t8'], waitingReason:'', manualBlockReason:'', finalDelay:null},
      {id:'t10', projectId:'destin', title:'Tournage clip', role:'videaste', situation:'en cours', dateDebut:d(0), due:d(2), dependsOn:[], waitingReason:'', manualBlockReason:'', finalDelay:null},
      {id:'t11', projectId:'destin', title:'Montage clip', role:'videaste', situation:'bloqué', dateDebut:d(3), due:d(7), dependsOn:[], waitingReason:'', manualBlockReason:'Audio final non reçu', finalDelay:null},
      {id:'t12', projectId:'destin', title:'Intégration audio final', role:'videaste', situation:'à venir', dateDebut:d(8), due:d(9), dependsOn:['t11','t2'], waitingReason:'', manualBlockReason:'', finalDelay:null},
      {id:'t13', projectId:'destin', title:'Proposition de looks', role:'styliste', situation:'terminé', dateDebut:d(-11), due:d(-7), dependsOn:[], waitingReason:'', manualBlockReason:'', finalDelay:2},
      {id:'t14', projectId:'destin', title:'Teaser TikTok', role:'cm', situation:'à venir', dateDebut:d(9), due:d(10), dependsOn:['t9'], waitingReason:'', manualBlockReason:'', finalDelay:null},
      {id:'t15', projectId:'destin', title:'Compte à rebours Instagram', role:'cm', situation:'à venir', dateDebut:d(12), due:d(13), dependsOn:[], waitingReason:'', manualBlockReason:'', finalDelay:null},
      {id:'t16', projectId:'destin', title:'Confirmer budget clip', role:'manager', situation:'à valider', dateDebut:d(-2), due:d(1), dependsOn:[], waitingReason:'', manualBlockReason:'', finalDelay:null},
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
  return { currentRole: 'artiste', currentProjectId: null, tasksRoleFilter: false, calShowAllProjects: false, calShowAllRoles: false };
}
function saveLocalPrefs(){
  localStorage.setItem(LOCAL_KEY, JSON.stringify({
    currentRole: DATA.currentRole,
    currentProjectId: DATA.currentProjectId,
    tasksRoleFilter: !!DATA.tasksRoleFilter,
    calShowAllProjects: !!DATA.calShowAllProjects,
    calShowAllRoles: !!DATA.calShowAllRoles
  }));
}
let DATA = Object.assign({ projects: [], tasks: [], notifications: [], bookings: [], artistProfile: defaultArtistProfile(), tasksRoleFilter: false, calShowAllProjects: false, calShowAllRoles: false }, loadLocalPrefs());
let dataReady = false;
let projectSelected = false;
let roleChosen = false; // se réinitialise à chaque chargement de page / reconnexion
let roleUnlocked = false; // se réinitialise à chaque chargement de page
let calAllUnlocked = false; // déverrouillage de la vue "programme complet" du calendrier (classe B), se réinitialise à chaque chargement de page
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
function hideAllGateScreens(){
  const login = document.getElementById('loginScreen');
  const roleSel = document.getElementById('roleSelectScreen');
  const projSel = document.getElementById('projectSelectScreen');
  const appRoot = document.getElementById('appRoot');
  if(login) login.style.display = 'none';
  if(roleSel) roleSel.style.display = 'none';
  if(projSel) projSel.style.display = 'none';
  if(appRoot) appRoot.style.display = 'none';
}
function showLoginScreen(){
  hideAllGateScreens();
  const login = document.getElementById('loginScreen');
  if(login) login.style.display = 'flex';
}
function showRoleSelectScreen(){
  hideAllGateScreens();
  const roleSel = document.getElementById('roleSelectScreen');
  if(roleSel) roleSel.style.display = 'flex';
  renderRoleSelectScreen();
}
function showProjectSelectScreen(){
  hideAllGateScreens();
  const projSel = document.getElementById('projectSelectScreen');
  if(projSel) projSel.style.display = 'flex';
  renderProjectSelectDropdown();
}
function showAppRoot(){
  hideAllGateScreens();
  const appRoot = document.getElementById('appRoot');
  if(appRoot) appRoot.style.display = 'block';
}
let pendingProtectedRoleId = null;
function renderRoleSelectScreen(){
  const grid = document.getElementById('roleSelectGrid');
  if(grid){
    grid.innerHTML = ROLES.map(r => `<button type="button" class="role-chip" onclick="chooseInitialRole('${r.id}')">
      <span class="role-chip-icon">${r.icon}</span>
      <span class="role-chip-label">${r.label}</span>
    </button>`).join('');
  }
  cancelRolePinEntry();
}
function chooseInitialRole(roleId){
  if(PROTECTED_ROLES.includes(roleId) && !roleUnlocked){
    pendingProtectedRoleId = roleId;
    const form = document.getElementById('rolePinForm');
    const err = document.getElementById('rolePinError');
    const input = document.getElementById('rolePinInput');
    if(err) err.textContent = '';
    if(input) input.value = '';
    if(form) form.style.display = 'flex';
    if(input) input.focus();
    return;
  }
  finalizeRoleChoice(roleId);
}
window.chooseInitialRole = chooseInitialRole;
function confirmRolePin(){
  const p = Object.assign(defaultArtistProfile(), DATA.artistProfile || {});
  const input = document.getElementById('rolePinInput');
  const err = document.getElementById('rolePinError');
  const code = input ? input.value.trim() : '';
  if(!pendingProtectedRoleId || code !== (p.rolePin || '0000')){
    if(err) err.textContent = 'Code incorrect.';
    if(input){ input.value = ''; input.focus(); }
    return;
  }
  roleUnlocked = true;
  const roleId = pendingProtectedRoleId;
  finalizeRoleChoice(roleId);
}
window.confirmRolePin = confirmRolePin;
function cancelRolePinEntry(){
  pendingProtectedRoleId = null;
  const form = document.getElementById('rolePinForm');
  const err = document.getElementById('rolePinError');
  const input = document.getElementById('rolePinInput');
  if(form) form.style.display = 'none';
  if(err) err.textContent = '';
  if(input) input.value = '';
}
window.cancelRolePinEntry = cancelRolePinEntry;
function finalizeRoleChoice(roleId){
  DATA.currentRole = roleId;
  saveLocalPrefs();
  roleChosen = true;
  pendingProtectedRoleId = null;
  if(!projectSelected){
    showProjectSelectScreen();
  } else {
    showAppRoot();
    switchView('dashboard');
    renderAll();
  }
}
function renderProjectSelectDropdown(){
  const sel = document.getElementById('projectSelectDropdown');
  const btn = document.getElementById('projectSelectBtn');
  const err = document.getElementById('projectSelectError');
  if(!sel) return;
  if(!DATA.projects || !DATA.projects.length){
    sel.innerHTML = '<option value="">Aucun projet disponible</option>';
    sel.disabled = true;
    if(btn) btn.disabled = true;
    if(err) err.textContent = 'Aucun projet pour l\'instant. Connecte-toi, crée un projet dans l\'onglet Projets, puis reviens choisir.';
    return;
  }
  sel.disabled = false;
  if(btn) btn.disabled = false;
  if(err) err.textContent = '';
  const previousValue = sel.value;
  const sortedProjects = DATA.projects.slice().sort((a,b)=> new Date(a.releaseDate) - new Date(b.releaseDate));
  sel.innerHTML = sortedProjects.map(p => `<option value="${p.id}">${escapeHtml(p.title)} — sortie le ${new Date(p.releaseDate + 'T00:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}</option>`).join('');
  if(sortedProjects.some(p => p.id === previousValue)){
    sel.value = previousValue;
  } else if(DATA.currentProjectId && sortedProjects.some(p => p.id === DATA.currentProjectId)){
    sel.value = DATA.currentProjectId;
  }
}
function confirmProjectSelection(){
  const sel = document.getElementById('projectSelectDropdown');
  if(!sel || !sel.value) return;
  DATA.currentProjectId = sel.value;
  saveLocalPrefs();
  projectSelected = true;
  showAppRoot();
  switchView('dashboard');
  renderAll();
}
window.confirmProjectSelection = confirmProjectSelection;
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
  const pinForm = document.getElementById('rolePinForm');
  if(pinForm) pinForm.addEventListener('submit', (e) => { e.preventDefault(); confirmRolePin(); });
  auth.onAuthStateChanged(user => {
    if(!user){
      dataReady = false;
      projectSelected = false;
      roleChosen = false;
      roleUnlocked = false;
      calAllUnlocked = false;
      clearInactivityTimer();
      showLoginScreen();
      if(loggedOutForInactivity){
        const errEl = document.getElementById('loginError');
        if(errEl) errEl.textContent = 'Tu as été déconnecté après 5 minutes d\'inactivité.';
        loggedOutForInactivity = false;
      }
      return;
    }
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
      const migrationHappened = migrateTasksInPlace(shared.tasks || []);
      DATA.tasks = shared.tasks || [];
      DATA.notifications = shared.notifications || [];
      DATA.bookings = shared.bookings || [];
      DATA.artistProfile = shared.artistProfile || defaultArtistProfile();
      dataReady = true;
      setSyncBadge('ok');
      if(!roleChosen){
        showRoleSelectScreen();
      } else if(!projectSelected){
        showProjectSelectScreen();
      } else {
        showAppRoot();
        renderAll();
      }
      if(migrationHappened){
        // D'anciennes tâches utilisaient encore le champ "status" (avant l'introduction de
        // situation/dateDebut/retard). On les a converties en mémoire ci-dessus sans rien
        // perdre de leur avancement réel ; on réenregistre une fois pour mettre la base à jour.
        saveData(DATA);
      }
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
/* ============ SITUATION vs COULEUR (voir synthèse système de suivi des tâches) ============
   - La COULEUR (bleu/vert/orange/rouge) représente EXCLUSIVEMENT la position temporelle
     de la tâche par rapport à son échéance (sauf "terminé", toujours vert).
   - La SITUATION (à venir / en cours / en attente / à valider / bloqué / terminé)
     représente EXCLUSIVEMENT l'état opérationnel réel de la tâche.
   - Le RETARD ("en retard de X jours") est calculé automatiquement (date actuelle vs
     échéance) et n'est jamais choisi manuellement. Une fois la tâche terminée, son retard
     final est conservé dans task.finalDelay à titre d'historique.
*/
const SITUATIONS = [
  {value:'à venir', label:'À venir'},
  {value:'en cours', label:'En cours'},
  {value:'en attente', label:'En attente'},
  {value:'à valider', label:'À valider'},
  {value:'bloqué', label:'Bloqué'},
  {value:'terminé', label:'Terminé'},
];
function situationLabel(value){
  return (SITUATIONS.find(s => s.value === value) || {}).label || value;
}
/* ============ MIGRATION — anciennes tâches (champ "status") vers le nouveau schéma
   (situation / dateDebut / waitingReason / manualBlockReason / finalDelay). Sans cette
   conversion, les tâches déjà enregistrées avant l'introduction de ce système (ex. projets
   déjà avancés) n'ont pas de champ "situation" : elles seraient lues comme "à venir" partout
   (0 % d'avancement affiché) alors que le vrai travail effectué, lui, n'a jamais bougé. ============ */
function migrateTasksInPlace(tasks){
  let migrated = false;
  tasks.forEach(t => {
    if(t.situation === undefined){
      let situation = t.status;
      if(situation === 'en retard') situation = 'en cours'; // le retard est désormais recalculé automatiquement, ce n'est plus un statut choisi
      if(!SITUATIONS.some(s => s.value === situation)) situation = 'à venir';
      t.situation = situation;
      delete t.status;
      migrated = true;
    }
    if(!t.dateDebut){
      t.dateDebut = t.due;
      migrated = true;
    }
    if(t.waitingReason === undefined){ t.waitingReason = ''; migrated = true; }
    if(t.manualBlockReason === undefined){ t.manualBlockReason = ''; migrated = true; }
    if(t.finalDelay === undefined){ t.finalDelay = null; migrated = true; }
  });
  return migrated;
}
function dependencyBlockers(task){
  return (task.dependsOn||[]).map(taskById).filter(dep => dep && dep.situation !== 'terminé');
}
function effectiveSituation(task){
  if(task.situation === 'terminé') return {situation:'terminé'};
  const blockedBy = dependencyBlockers(task);
  if(blockedBy.length){
    return {situation:'bloqué', autoBlocked:true, blockedBy};
  }
  if(task.situation === 'bloqué'){
    return {situation:'bloqué', autoBlocked:false, manualReason: task.manualBlockReason || ''};
  }
  return {situation: task.situation, waitingReason: task.situation === 'en attente' ? (task.waitingReason || '') : ''};
}
function isTaskLate(task){
  return task.situation !== 'terminé' && daysUntil(task.due) < 0;
}
function timeColorClass(task){
  if(task.situation === 'terminé') return 'green';
  const n = daysUntil(task.due);
  if(n <= 0) return 'red';
  if(n <= 6) return 'orange';
  if(n <= 14) return 'green';
  return 'blue';
}
function dueStatusText(task){
  if(task.situation === 'terminé'){
    return (task.finalDelay && task.finalDelay > 0) ? `TERMINÉ · RETARD FINAL : ${task.finalDelay} J` : `TERMINÉ`;
  }
  const n = daysUntil(task.due);
  if(n < 0) return `EN RETARD DE ${Math.abs(n)} J`;
  if(n === 0) return `ÉCHÉANCE AUJOURD'HUI`;
  if(n === 1) return `1 JOUR RESTANT`;
  return `${n} JOURS RESTANTS`;
}
const roleLabel = (id) => (ROLES.find(r=>r.id===id)||{}).label || id;
/* ============ MODALE DE CODE PERSONNALISÉE ============
   Remplace les prompt()/alert() natifs du navigateur (moches et non personnalisables) par une
   petite fenêtre stylée cohérente avec le reste du site, pour toute demande de code à 4 chiffres. */
let pinModalEl = null;
function pinModalEscHandler(e){
  if(e.key === 'Escape') closePinModal(true);
}
function closePinModal(triggerCancel){
  if(pinModalEl){
    const onCancel = pinModalEl.__onCancel;
    pinModalEl.remove();
    pinModalEl = null;
    if(triggerCancel && onCancel) onCancel();
  }
  document.removeEventListener('keydown', pinModalEscHandler);
}
window.closePinModal = closePinModal;
function openPinModal({ title, message, onConfirm, onCancel }){
  closePinModal(false);
  const overlay = document.createElement('div');
  overlay.className = 'pin-modal-overlay';
  overlay.innerHTML = `
    <div class="pin-modal-card">
      <h3 class="pin-modal-title">${escapeHtml(title || 'Code requis')}</h3>
      <p class="pin-modal-msg">${escapeHtml(message || 'Entre le code à 4 chiffres.')}</p>
      <form class="pin-modal-form" id="pinModalForm" novalidate>
        <input type="password" id="pinModalInput" class="pin-modal-input" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off" placeholder="••••">
        <div class="pin-modal-error" id="pinModalError"></div>
        <div class="pin-modal-actions">
          <button type="button" class="icon-btn wide" id="pinModalCancelBtn">Annuler</button>
          <button type="submit" class="cta-inline login-btn">Valider</button>
        </div>
      </form>
    </div>`;
  document.body.appendChild(overlay);
  overlay.__onCancel = onCancel || null;
  pinModalEl = overlay;
  const input = overlay.querySelector('#pinModalInput');
  const err = overlay.querySelector('#pinModalError');
  const form = overlay.querySelector('#pinModalForm');
  const cancelBtn = overlay.querySelector('#pinModalCancelBtn');
  setTimeout(() => input && input.focus(), 20);
  overlay.addEventListener('mousedown', (e) => { if(e.target === overlay) closePinModal(true); });
  cancelBtn.addEventListener('click', () => closePinModal(true));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = input.value.trim();
    const ok = onConfirm ? onConfirm(code) : true;
    if(ok === false){
      err.textContent = 'Code incorrect.';
      input.value = '';
      input.focus();
    } else {
      overlay.__onCancel = null; // succès : pas d'annulation à déclencher
      closePinModal(false);
    }
  });
  document.addEventListener('keydown', pinModalEscHandler);
}
window.openPinModal = openPinModal;
/* ============ RENDER ============ */
function roleTaskCount(roleId){
  const tasks = projectTasks(DATA.currentProjectId).filter(t => t.situation !== 'terminé');
  if(isClassA(roleId)) return tasks.length;
  return tasks.filter(t => t.role === roleId).length;
}
const PROTECTED_ROLES = ['artiste', 'manager', 'producteur'];
/* Classe A = rôles protégés par le code d'accès rôle (0000 par défaut) : ils voient TOUJOURS
   tout le calendrier (tous projets, tous rôles) sans avoir besoin de cases à cocher.
   Classe B = tous les autres rôles : par défaut ils ne voient QUE leur propre rôle sur le
   projet en cours ; pour élargir la vue ("programme complet"), il leur faut un second code
   (1234 par défaut, distinct du code de rôle). */
function isClassA(roleId){
  return PROTECTED_ROLES.includes(roleId || DATA.currentRole);
}
window.isClassA = isClassA;
function selectRole(roleId){
  if(PROTECTED_ROLES.includes(roleId) && DATA.currentRole !== roleId && !roleUnlocked){
    openPinModal({
      title: 'Rôle protégé',
      message: 'Ce rôle est protégé par un code. Entre le code à 4 chiffres :',
      onConfirm: (code) => {
        const p = Object.assign(defaultArtistProfile(), DATA.artistProfile || {});
        if(code !== (p.rolePin || '0000')) return false;
        roleUnlocked = true;
        DATA.currentRole = roleId;
        saveLocalPrefs();
        renderAll();
        return true;
      },
      onCancel: () => { renderRoleSelect(); renderRoleChips(); }
    });
    return;
  }
  DATA.currentRole = roleId;
  saveLocalPrefs();
  renderAll();
}
window.selectRole = selectRole;
function changeRolePin(){
  const p = Object.assign(defaultArtistProfile(), DATA.artistProfile || {});
  openPinModal({
    title: 'Modifier le code de rôle',
    message: 'Entre le code actuel :',
    onConfirm: (current) => {
      if(current !== (p.rolePin || '0000')) return false;
      setTimeout(() => {
        openPinModal({
          title: 'Nouveau code',
          message: 'Choisis le nouveau code à 4 chiffres :',
          onConfirm: (next) => {
            if(!/^\d{4}$/.test(next)) return false;
            DATA.artistProfile = Object.assign({}, p, { rolePin: next });
            saveData(DATA);
            showCelebrationToast('Code mis à jour ✅');
            return true;
          }
        });
      }, 10);
      return true;
    }
  });
}
window.changeRolePin = changeRolePin;
function renderRoleSelect(){
  const sel = document.getElementById('roleSelect');
  sel.innerHTML = ROLES.map(r => {
    const count = roleTaskCount(r.id);
    return `<option value="${r.id}" ${r.id===DATA.currentRole?'selected':''}>${r.icon} ${r.label}${count>0?` (${count})`:''}</option>`;
  }).join('');
  sel.onchange = () => selectRole(sel.value);
}
function renderRoleChips(){
  const el = document.getElementById('roleChips');
  if(!el) return;
  el.innerHTML = ROLES.map(r => {
    const count = roleTaskCount(r.id);
    const active = r.id === DATA.currentRole;
    return `<button type="button" class="role-chip ${active?'active':''}" onclick="selectRole('${r.id}')">
      <span class="role-chip-icon">${r.icon}</span>
      <span class="role-chip-label">${r.label}</span>
      ${count>0?`<span class="role-chip-count">${count}</span>`:''}
    </button>`;
  }).join('');
}
function myTasks(){
  const role = DATA.currentRole;
  const inProject = DATA.tasks.filter(t => t.projectId === DATA.currentProjectId);
  if(isClassA(role)) return inProject;
  return inProject.filter(t => t.role === role);
}
function projectTitleOf(task){
  const p = DATA.projects.find(pr => pr.id === task.projectId);
  return p ? p.title : '';
}
function computeHealth(projectId){
  const pid = projectId || DATA.currentProjectId;
  const tasks = projectTasks(pid);
  const late = tasks.filter(t => isTaskLate(t));
  const blocked = tasks.filter(t => effectiveSituation(t).situation === 'bloqué');
  if(late.length > 0 || blocked.length > 1) return 'red';
  return 'green';
}
function computeProgress(projectId){
  const pid = projectId || DATA.currentProjectId;
  const tasks = projectTasks(pid);
  if(!tasks.length) return 0;
  const done = tasks.filter(t => t.situation === 'terminé').length;
  return Math.round((done/tasks.length)*100);
}
function renderHero(){
  const role = ROLES.find(r=>r.id===DATA.currentRole);
  document.getElementById('heroTitle').textContent = `Bon retour, ${role.label}`;
  const active = myTasks().filter(t => t.situation !== 'terminé');
  const late = active.filter(t => isTaskLate(t));
  const blocked = active.filter(t => effectiveSituation(t).situation === 'bloqué');
  const subEl = document.getElementById('heroSub');
  if(late.length > 0){
    subEl.textContent = `⚠️ ${late.length} tâche${late.length>1?'s':''} en retard te concerne${late.length>1?'nt':''}. À traiter en priorité.`;
  } else if(blocked.length > 0){
    subEl.textContent = `🟠 ${blocked.length} tâche${blocked.length>1?'s':''} bloquée${blocked.length>1?'s':''} te concerne${blocked.length>1?'nt':''}.`;
  } else if(active.length > 0){
    subEl.textContent = `${active.length} tâche${active.length>1?'s':''} te concerne${active.length>1?'nt':''} activement. Tout est sous contrôle 👌`;
  } else {
    subEl.textContent = `Rien à faire pour toi en ce moment, tu peux souffler 😌`;
  }
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
  dot.textContent = health === 'green' ? '🟢' : '🔴';
}
function taskRowHtml(task, opts={}){
  const eff = effectiveSituation(task);
  const isBlocked = eff.situation === 'bloqué';
  const colorClass = timeColorClass(task);
  let reasonLine = '';
  if(isBlocked){
    if(eff.autoBlocked){
      reasonLine = `<div class="task-block-reason">Bloqué par : ${eff.blockedBy.map(b=>`"${escapeHtml(b.title)}" (${roleLabel(b.role)})`).join(', ')}</div>`;
    } else {
      reasonLine = `<div class="task-block-reason">Bloqué${eff.manualReason ? ` — ${escapeHtml(eff.manualReason)}` : ''}</div>`;
    }
  } else if(eff.situation === 'en attente' && eff.waitingReason){
    reasonLine = `<div class="task-wait-reason">En attente — ${escapeHtml(eff.waitingReason)}</div>`;
  }
  const projectTag = opts.showProject ? `<span class="task-project-tag">${escapeHtml(projectTitleOf(task))}</span>` : '';
  const situationTag = `<span class="task-situation-tag">${situationLabel(eff.situation)}</span>`;
  const disableSelect = isBlocked && eff.autoBlocked;
  return `
    <div class="task ${isBlocked?'blocked':''}">
      <span class="task-dot ${colorClass}"></span>
      <div class="task-body">
        <div class="task-title">${escapeHtml(task.title)} ${situationTag} ${projectTag}</div>
        <div class="task-sub">${roleLabel(task.role)} · ${dueStatusText(task)}</div>
        ${reasonLine}
      </div>
      <select onchange="changeSituation('${task.id}', this.value)" ${disableSelect?'disabled title="Débloque d\'abord la tâche dont elle dépend"':''}>
        ${SITUATIONS.map(s=>`<option value="${s.value}" ${task.situation===s.value?'selected':''}>${s.label}</option>`).join('')}
      </select>
      <button class="icon-btn" title="Modifier" onclick="editTask('${task.id}')">✎</button>
      <button class="icon-btn danger" title="Supprimer" onclick="deleteTask('${task.id}')">🗑</button>
    </div>`;
}
function renderTodayList(){
  const list = myTasks().filter(t => {
    if(t.situation === 'terminé') return false;
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
  const late = relevant.filter(t => isTaskLate(t));
  const blocked = relevant.filter(t => effectiveSituation(t).situation === 'bloqué');
  const el = document.getElementById('alertsList');
  let html = '';
  late.forEach(t => {
    html += `<div class="alert red"><span>🔴</span><div><b>${escapeHtml(t.title)} est en retard</b><p>Échéance dépassée de ${Math.abs(daysUntil(t.due))} jour(s). Les tâches qui en dépendent risquent d'être décalées.</p></div></div>`;
  });
  blocked.forEach(t => {
    const eff = effectiveSituation(t);
    const reasonText = eff.autoBlocked
      ? `En attente de : ${eff.blockedBy.map(b=>escapeHtml(b.title)).join(', ')}.`
      : escapeHtml(eff.manualReason ? eff.manualReason : 'Motif non précisé.');
    html += `<div class="alert orange"><span>🟠</span><div><b>${escapeHtml(t.title)} est bloquée</b><p>${reasonText}</p></div></div>`;
  });
  if(!late.length && !blocked.length){
    html = `<div class="alert green"><span>🟢</span><div><b>Tout est sous contrôle</b><p>Aucune tâche en retard ou bloquée pour ce rôle.</p></div></div>`;
  }
  el.innerHTML = html;
}
function renderNotifications(){
  const el = document.getElementById('notifList');
  const showAll = isClassA();
  const list = showAll ? DATA.notifications : DATA.notifications.filter(n => !n.role || n.role === DATA.currentRole);
  el.innerHTML = list.length ? list.map(n => `
    <div class="notif"><div class="time mono">${escapeHtml(n.time)}</div><div class="txt">${escapeHtml(n.text)}</div></div>
  `).join('') : `<div class="empty">Aucune notification pour ce rôle pour l'instant.</div>`;
}
function renderAll(){
  if(!dataReady || !DATA.projects || !DATA.projects.length){
    return;
  }
  renderRoleSelect();
  renderRoleChips();
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
/* ============ CALENDRIER (un seul, avec filtres projets/rôles) ============ */
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
  closeGlobalSearch();
}
window.switchView = switchView;
function shiftMonth(delta){
  currentMonth.setMonth(currentMonth.getMonth() + delta);
  renderCalendar();
}
window.shiftMonth = shiftMonth;
/* Demande le code "programme complet" (1234 par défaut) avant d'accorder à un rôle de
   classe B l'accès aux cases à cocher "tous les projets" / "tous les rôles" du calendrier.
   Une fois déverrouillé (calAllUnlocked), les deux cases restent utilisables librement pour
   le reste de la session. Les rôles de classe A n'ont jamais besoin de ce code : ils voient
   déjà tout automatiquement, sans case à cocher. */
function requestCalAllAccess(toggleId, onGranted){
  if(calAllUnlocked){ onGranted(); return; }
  openPinModal({
    title: 'Programme complet',
    message: 'Cette vue élargie est protégée par un code à 4 chiffres.',
    onConfirm: (code) => {
      const p = Object.assign(defaultArtistProfile(), DATA.artistProfile || {});
      if(code !== (p.calAllAccessPin || '1234')) return false;
      calAllUnlocked = true;
      onGranted();
      return true;
    },
    onCancel: () => {
      const toggle = document.getElementById(toggleId);
      if(toggle) toggle.checked = false;
    }
  });
}
function toggleCalShowAllProjects(checked){
  if(isClassA()){ renderCalendar(); return; } // classe A : toujours tout, rien à faire
  if(checked && !calAllUnlocked){
    requestCalAllAccess('calShowAllProjectsToggle', () => {
      DATA.calShowAllProjects = true;
      saveLocalPrefs();
      renderCalendar();
    });
    return;
  }
  DATA.calShowAllProjects = checked;
  saveLocalPrefs();
  renderCalendar();
}
window.toggleCalShowAllProjects = toggleCalShowAllProjects;
function toggleCalShowAllRoles(checked){
  if(isClassA()){ renderCalendar(); return; } // classe A : toujours tout, rien à faire
  if(checked && !calAllUnlocked){
    requestCalAllAccess('calShowAllRolesToggle', () => {
      DATA.calShowAllRoles = true;
      saveLocalPrefs();
      renderCalendar();
    });
    return;
  }
  DATA.calShowAllRoles = checked;
  saveLocalPrefs();
  renderCalendar();
}
window.toggleCalShowAllRoles = toggleCalShowAllRoles;
function tasksByDate(){
  const map = {};
  const classA = isClassA();
  const showAllProjects = classA || !!DATA.calShowAllProjects;
  const showAllRoles = classA || !!DATA.calShowAllRoles;
  let source = showAllProjects ? (DATA.tasks||[]) : projectTasks(DATA.currentProjectId);
  if(!showAllRoles){
    source = source.filter(t => t.role === DATA.currentRole);
  }
  source.forEach(t => {
    (map[t.due] = map[t.due] || []).push(t);
  });
  return map;
}
function renderCalendar(){
  const label = currentMonth.toLocaleDateString('fr-FR', {month:'long', year:'numeric'});
  document.getElementById('calMonthLabel').textContent = label;
  const classA = isClassA();
  // Classe A : accès complet automatique, on masque entièrement les cases à cocher (inutiles).
  // Classe B : cases à cocher visibles, protégées par le code "programme complet" (1234).
  const filtersRow = document.getElementById('calFiltersRow');
  if(filtersRow) filtersRow.style.display = classA ? 'none' : '';
  const allProjectsToggle = document.getElementById('calShowAllProjectsToggle');
  if(allProjectsToggle) allProjectsToggle.checked = classA ? true : !!DATA.calShowAllProjects;
  const allRolesToggle = document.getElementById('calShowAllRolesToggle');
  if(allRolesToggle) allRolesToggle.checked = classA ? true : !!DATA.calShowAllRoles;
  const subEl = document.getElementById('calSub');
  if(subEl){
    if(classA){
      subEl.textContent = 'Toutes les échéances, tous projets et tous rôles confondus, par mois.';
    } else {
      const proj = currentProject();
      const projBit = DATA.calShowAllProjects ? 'tous projets confondus' : (proj ? `pour "${proj.title}"` : 'pour le projet sélectionné');
      const roleBit = DATA.calShowAllRoles ? 'tous rôles confondus' : `concernant ton rôle actuel (${roleLabel(DATA.currentRole)})`;
      subEl.textContent = `Échéances ${projBit}, ${roleBit}, par mois.`;
    }
  }
  const map = tasksByDate();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const todayStr = new Date().toISOString().slice(0,10);
  const showProject = classA || !!DATA.calShowAllProjects;
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
      const cls = timeColorClass(t);
      const titleSafe = escapeHtml(t.title);
      if(!showProject) return `<span class="cal-pill ${cls}">${titleSafe}</span>`;
      const proj = escapeHtml(projectTitleOf(t));
      return `<span class="cal-pill ${cls}" title="${proj} — ${titleSafe}">${proj} · ${titleSafe}</span>`;
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
  const tasks = (map[dateStr] || []).slice().sort((a,b)=> projectTitleOf(a).localeCompare(projectTitleOf(b)));
  const card = document.getElementById('calDayCard');
  const title = document.getElementById('calDayTitle');
  const list = document.getElementById('calDayTasks');
  const d = new Date(dateStr + 'T00:00:00');
  title.textContent = d.toLocaleDateString('fr-FR', {weekday:'long', day:'numeric', month:'long'});
  list.innerHTML = tasks.length ? tasks.map(t => taskRowHtml(t, {showProject: isClassA() || !!DATA.calShowAllProjects})).join('') : `<div class="empty">Aucune tâche ce jour-là.</div>`;
  card.style.display = 'block';
}
window.showDayTasks = showDayTasks;
/* ============ RECHERCHE GLOBALE ============ */
function searchableTasks(){
  const showAll = isClassA();
  return showAll ? (DATA.tasks || []) : (DATA.tasks || []).filter(t => t.role === DATA.currentRole);
}
function handleGlobalSearch(query){
  const box = document.getElementById('globalSearchResults');
  if(!box) return;
  const q = (query || '').trim().toLowerCase();
  if(!q){ box.style.display = 'none'; box.innerHTML = ''; return; }
  const taskMatches = searchableTasks()
    .filter(t => t.title.toLowerCase().includes(q))
    .slice(0, 6)
    .map(t => ({
      icon: '📋', title: t.title,
      sub: `${projectTitleOf(t)} · ${roleLabel(t.role)}`,
      action: () => { DATA.currentProjectId = t.projectId; saveLocalPrefs(); switchView('tasks'); renderAll(); }
    }));
  const projectMatches = (DATA.projects || [])
    .filter(p => p.title.toLowerCase().includes(q))
    .slice(0, 4)
    .map(p => ({
      icon: '🎵', title: p.title, sub: p.type,
      action: () => { setCurrentProject(p.id); }
    }));
  const bookingMatches = (DATA.bookings || [])
    .filter(b => b.title.toLowerCase().includes(q))
    .slice(0, 4)
    .map(b => ({
      icon: '🎤', title: b.title, sub: b.location || b.type,
      action: () => { switchView('booking'); }
    }));
  const results = [...taskMatches, ...projectMatches, ...bookingMatches];
  window.__searchResultActions = results.map(r => r.action);
  if(!results.length){
    box.innerHTML = `<div class="search-empty">Aucun résultat pour "${escapeHtml(query.trim())}".</div>`;
    box.style.display = 'block';
    return;
  }
  box.innerHTML = results.map((r, i) => `
    <div class="search-result-item" onclick="runGlobalSearchAction(${i})">
      <span class="search-result-icon">${r.icon}</span>
      <div class="search-result-text">
        <div class="search-result-title">${escapeHtml(r.title)}</div>
        <div class="search-result-sub">${escapeHtml(r.sub)}</div>
      </div>
    </div>
  `).join('');
  box.style.display = 'block';
}
window.handleGlobalSearch = handleGlobalSearch;
function runGlobalSearchAction(i){
  const fn = window.__searchResultActions && window.__searchResultActions[i];
  if(fn) fn();
  closeGlobalSearch();
}
window.runGlobalSearchAction = runGlobalSearchAction;
function closeGlobalSearch(){
  const box = document.getElementById('globalSearchResults');
  const input = document.getElementById('globalSearchInput');
  if(box){ box.style.display = 'none'; box.innerHTML = ''; }
  if(input) input.value = '';
}
window.closeGlobalSearch = closeGlobalSearch;
document.addEventListener('click', (e) => {
  const wrap = document.querySelector('.global-search-wrap');
  if(wrap && !wrap.contains(e.target)){
    const box = document.getElementById('globalSearchResults');
    if(box) box.style.display = 'none';
  }
});
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape') closeGlobalSearch();
});
/* ============ PETITES CÉLÉBRATIONS ============ */
function celebrateConfetti(){
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const colors = ['#8B5CF6', '#5B9DF9', '#20B26C', '#F5A524', '#EF5A5A'];
  const pieces = Array.from({length: 140}, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.5,
    r: 4 + Math.random() * 5,
    color: colors[Math.floor(Math.random() * colors.length)],
    speed: 2 + Math.random() * 3,
    drift: (Math.random() - 0.5) * 2,
    rot: Math.random() * Math.PI,
    rotSpeed: (Math.random() - 0.5) * 0.2,
  }));
  let frame = 0;
  const maxFrames = 220;
  function tick(){
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.y += p.speed;
      p.x += p.drift;
      p.rot += p.rotSpeed;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r * 0.6);
      ctx.restore();
    });
    if(frame < maxFrames){
      requestAnimationFrame(tick);
    } else {
      canvas.remove();
    }
  }
  tick();
}
function showCelebrationToast(message){
  const toast = document.createElement('div');
  toast.className = 'celebration-toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}
/* ============ INTERACTIONS ============ */
function changeSituation(taskId, newSituation){
  const task = taskById(taskId);
  if(!task) return;
  const oldSituation = task.situation;
  const wasLate = isTaskLate(task);
  const progressBefore = computeProgress(task.projectId);
  const projTitle = projectTitleOf(task);
  if(newSituation === 'en attente'){
    const reason = prompt('Pourquoi cette tâche est-elle en attente ? (ex. "audio final attendu")', task.waitingReason || '');
    if(reason === null){ renderAll(); return; }
    task.waitingReason = reason.trim();
  } else if(oldSituation === 'en attente'){
    task.waitingReason = '';
  }
  if(newSituation === 'bloqué'){
    const reason = prompt('Pourquoi cette tâche est-elle bloquée ? (motif libre, ex. "attente validation client")', task.manualBlockReason || '');
    if(reason === null){ renderAll(); return; }
    task.manualBlockReason = reason.trim();
  } else if(oldSituation === 'bloqué'){
    task.manualBlockReason = '';
  }
  task.situation = newSituation;
  if(newSituation === 'terminé' && oldSituation !== 'terminé'){
    const lateDays = daysUntil(task.due) < 0 ? Math.abs(daysUntil(task.due)) : 0;
    task.finalDelay = lateDays;
    const dependents = DATA.tasks.filter(t => (t.dependsOn||[]).includes(taskId));
    if(dependents.length){
      DATA.notifications.unshift({
        time: 'À l\'instant',
        text: `✅ ${task.title} terminé${lateDays>0?` (retard final : ${lateDays} j)`:''}. Prochaine étape : ${dependents.map(d=>d.title).join(', ')}.`
      });
    }
  }
  if(oldSituation === 'terminé' && newSituation !== 'terminé'){
    task.finalDelay = null;
  }
  saveData(DATA);
  renderAll();
  if(newSituation === 'terminé' && oldSituation !== 'terminé'){
    const progressAfter = computeProgress(task.projectId);
    if(progressBefore < 100 && progressAfter >= 100){
      celebrateConfetti();
      showCelebrationToast(`🎉 "${projTitle}" est à 100% !`);
    } else if(wasLate){
      showCelebrationToast(`👏 Tâche en retard rattrapée : "${task.title}"`);
    }
  }
}
window.changeSituation = changeSituation;
function editTask(id){
  const task = taskById(id);
  if(!task) return;
  const newTitle = prompt('Titre de la tâche :', task.title);
  if(newTitle === null) return;
  const newDebut = prompt('Date de début (AAAA-MM-JJ) :', task.dateDebut || task.due);
  if(newDebut === null) return;
  const newDue = prompt('Date d\'échéance / deadline (AAAA-MM-JJ) :', task.due);
  if(newDue === null) return;
  if(newTitle.trim()) task.title = newTitle.trim();
  if(/^\d{4}-\d{2}-\d{2}$/.test(newDebut.trim())) task.dateDebut = newDebut.trim();
  else if(newDebut.trim() !== (task.dateDebut || '')){
    alert('Format de date de début invalide, elle n\'a pas été changée (utilise AAAA-MM-JJ).');
  }
  if(/^\d{4}-\d{2}-\d{2}$/.test(newDue.trim())) task.due = newDue.trim();
  else if(newDue.trim() !== task.due){
    alert('Format de date d\'échéance invalide, elle n\'a pas été changée (utilise AAAA-MM-JJ).');
  }
  if(task.dateDebut && task.due && task.dateDebut > task.due){
    alert('Attention : la date de début est après l\'échéance. Vérifie ces deux dates.');
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
          if(t.dateDebut) t.dateDebut = addDaysTo(t.dateDebut, delta);
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
        t.dateDebut = addDaysTo(t.due, -DEFAULT_LEAD_DAYS);
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
const DEFAULT_LEAD_DAYS = 5; // délai par défaut entre la date de début et l'échéance d'une tâche générée automatiquement
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
    const due = addDaysTo(project.releaseDate, item.offset);
    DATA.tasks.push({
      id: `${idPrefix}_${item.key}`,
      projectId: idPrefix,
      title: item.title,
      role: item.role,
      situation: 'à venir',
      dateDebut: addDaysTo(due, -DEFAULT_LEAD_DAYS),
      due,
      dependsOn: item.deps.map(k => `${idPrefix}_${k}`),
      waitingReason: '',
      manualBlockReason: '',
      finalDelay: null,
    });
  });
}
function renderProjectsList(){
  const el = document.getElementById('projectsList');
  const sortedProjects = DATA.projects.slice().sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
  el.innerHTML = sortedProjects.map(p => {
    const pct = computeProgress(p.id);
    const health = computeHealth(p.id);
    const healthIcon = health === 'green' ? '🟢' : '🔴';
    const isCurrent = p.id === DATA.currentProjectId;
    return `
      <div class="proj-card ${isCurrent?'current':''}" onclick="setCurrentProject('${p.id}')">
        <div class="proj-card-top">
          <h3>${escapeHtml(p.title)}</h3>
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
function toggleTasksRoleFilter(checked){
  DATA.tasksRoleFilter = checked;
  saveLocalPrefs();
  renderTasksView();
}
window.toggleTasksRoleFilter = toggleTasksRoleFilter;
function renderTasksView(){
  const proj = currentProject();
  const sel = document.getElementById('ntRole');
  if(sel && !sel.dataset.filled){
    sel.innerHTML = ROLES.filter(r => r.id !== 'artiste').map(r => `<option value="${r.id}">${r.icon} ${r.label}</option>`).join('');
    sel.dataset.filled = '1';
  }
  const filterToggle = document.getElementById('tasksRoleFilterToggle');
  if(filterToggle) filterToggle.checked = !!DATA.tasksRoleFilter;
  if(!proj){
    document.getElementById('tasksViewTitle').textContent = 'Aucun projet';
    document.getElementById('tasksFullList').innerHTML = `<div class="empty">Crée d'abord un projet dans l'onglet Projets.</div>`;
    return;
  }
  document.getElementById('tasksViewTitle').textContent = `Tâches de ${proj.title}`;
  const roleActive = ROLES.find(r => r.id === DATA.currentRole);
  const filterOn = DATA.tasksRoleFilter && !isClassA();
  document.getElementById('tasksSub').textContent = filterOn
    ? `Tâches de ${proj.title} concernant ton rôle actuel (${roleActive.label}).`
    : `Toutes les tâches de ${proj.title}, tous métiers confondus.`;
  let list = projectTasks(proj.id);
  if(filterOn) list = list.filter(t => t.role === DATA.currentRole);
  list = list.slice().sort((a,b)=> daysUntil(a.due) - daysUntil(b.due));
  const el = document.getElementById('tasksFullList');
  el.innerHTML = list.length ? list.map(t => taskRowHtml(t)).join('') : `<div class="empty">Aucune tâche ${filterOn ? 'pour ce rôle ' : ''}pour ce projet pour le moment.</div>`;
}
document.getElementById('newTaskForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const proj = currentProject();
  if(!proj){ alert('Crée d\'abord un projet dans l\'onglet Projets.'); return; }
  const title = document.getElementById('ntTitle').value.trim();
  const role = document.getElementById('ntRole').value;
  const dateDebut = document.getElementById('ntDateDebut').value;
  const due = document.getElementById('ntDue').value;
  if(!title || !due || !dateDebut) return;
  if(dateDebut > due){
    alert('La date de début doit être avant (ou égale à) la date d\'échéance.');
    return;
  }
  const id = `${proj.id}_${slugify(title)}_${Math.random().toString(36).slice(2,6)}`;
  DATA.tasks.push({
    id, projectId: proj.id, title, role, situation: 'à venir', dateDebut, due, dependsOn: [],
    waitingReason: '', manualBlockReason: '', finalDelay: null
  });
  DATA.notifications.unshift({
    time: 'À l\'instant',
    text: `🆕 Nouvelle tâche créée : ${title} (${roleLabel(role)}).`,
    role
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
  const timeStr = b.time ? ` · ${escapeHtml(b.time)}` : '';
  const locationStr = b.location ? ` · 📍 ${escapeHtml(b.location)}` : '';
  const contactStr = b.contact ? ` · ☎️ ${escapeHtml(b.contact)}` : '';
  const dateStr = new Date(b.date + 'T00:00:00').toLocaleDateString('fr-FR', {day:'numeric', month:'long', year:'numeric'});
  return `
    <div class="task">
      <span class="task-dot ${info.cls}"></span>
      <div class="task-body">
        <div class="task-title">${escapeHtml(b.title)} <span class="task-project-tag">${escapeHtml(b.type)}</span>${confirmationTag(b)}</div>
        <div class="task-sub">${dateStr}${timeStr}${locationStr}${contactStr} · ${info.label}</div>
        ${b.notes ? `<div class="task-block-reason" style="color:var(--muted);">${escapeHtml(b.notes)}</div>` : ''}
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
  el.innerHTML = rows.map(([label, val]) => `<div class="row"><b>${label}</b><span>${val ? escapeHtml(val) : 'Non renseigné'}</span></div>`).join('');
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

async function downloadUpcomingBookingPDF(){
  try{
    await generateBookingPDF('upcoming');
  }catch(err){
    console.error('Erreur lors de la génération du PDF :', err);
    alert('Une erreur est survenue pendant la génération du PDF. Regarde la console (F12) pour le détail.');
  }
}
window.downloadUpcomingBookingPDF = downloadUpcomingBookingPDF;
async function downloadDoneBookingPDF(){
  try{
    await generateBookingPDF('done');
  }catch(err){
    console.error('Erreur lors de la génération du PDF :', err);
    alert('Une erreur est survenue pendant la génération du PDF. Regarde la console (F12) pour le détail.');
  }
}
window.downloadDoneBookingPDF = downloadDoneBookingPDF;
async function generateBookingPDF(filterType){
  if(!window.jspdf){
    alert('Le générateur de PDF n\'a pas pu se charger. Vérifie ta connexion et réessaie.');
    return;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit:'mm', format:'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const p = Object.assign(defaultArtistProfile(), DATA.artistProfile || {});

  /* ---------- Palette (thème sombre violet, façon affiche) ---------- */
  const violet = [139,92,246];
  const violetLight = [199,168,255];
  const blue = [91,157,249];
  const bgDark = [23,17,41];
  const boxBg = [35,27,58];
  const boxBorder = [92,74,138];
  const white = [255,255,255];
  const mutedLight = [186,176,214];
  const green = [58,209,140];
  const orange = [252,186,74];
  const red = [255,120,120];

  const MARGIN_L = 14;
  const SIDEBAR_W = 20; // largeur réservée au grand mot "PROGRAMME" vertical
  const CONTENT_X = MARGIN_L + SIDEBAR_W;
  const CONTENT_R = pageWidth - 12;
  const FOOTER_H = 12;
  const FOOTER_TOP = pageHeight - FOOTER_H - 8;
  const BOTTOM_LIMIT = FOOTER_TOP - 4;
  const HEADER_H = 46;

  function lerp(a,b,t){ return a + (b-a)*t; }
  function lerpColor(c1,c2,t){ return [lerp(c1[0],c2[0],t), lerp(c1[1],c2[1],t), lerp(c1[2],c2[2],t)]; }

  // Les polices standards du PDF (Helvetica) ne savent afficher que les caractères latins courants
  // (accents français inclus). Un titre tapé avec une police "stylée" (générateur de texte fantaisie,
  // caractères spéciaux copiés-collés) contient des symboles unicode que la police ne connaît pas et
  // qui s'affichent comme des glyphes corrompus. On les remplace proprement par un espace pour éviter ça.
  function pdfSafe(str){
    if(!str) return '';
    return String(str)
      .replace(/[^\x20-\x7E\u00A0-\u017F\u2018\u2019\u201C\u201D\u2013\u2014\u2026]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function fillPageBg(){
    doc.setFillColor(...bgDark);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
  }

  /* ---------- En-tête : dégradé violet -> bleu ---------- */
  function drawHeader(){
    const bands = 70;
    for(let i=0;i<bands;i++){
      const t = i/(bands-1);
      const [r,g,b] = lerpColor(violet, blue, t);
      doc.setFillColor(r,g,b);
      doc.rect(0, (HEADER_H/bands)*i, pageWidth, (HEADER_H/bands)+0.5, 'F');
    }

    doc.setFillColor(...white);
    doc.circle(17, 13.5, 1.7, 'F');
    doc.setTextColor(...white);
    doc.setFont('helvetica','bold');
    doc.setFontSize(9);
    doc.text('Roi et Sacrificateur', 21.5, 15);

    doc.setFont('helvetica','bold');
    doc.setFontSize(25);
    doc.text(pdfSafe(p.name || 'Programme artiste').toUpperCase(), MARGIN_L, 30);

    doc.setFont('helvetica','normal');
    doc.setFontSize(11);
    const subtitle = filterType === 'done' ? 'Programme déjà effectué · Booking' : 'Programme à venir · Booking';
    doc.text(subtitle, MARGIN_L, 38);

    const yearStr = String(new Date().getFullYear());
    doc.setFillColor(...white);
    doc.roundedRect(pageWidth - 36, 8, 22, 13, 3, 3, 'F');
    doc.setTextColor(...violet);
    doc.setFont('helvetica','bold');
    doc.setFontSize(14);
    doc.text(yearStr, pageWidth - 25, 17, {align:'center'});

    doc.setTextColor(...white);
    doc.setFont('helvetica','normal');
    doc.setFontSize(7.5);
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}`, pageWidth - 12, 27, {align:'right'});

    return HEADER_H;
  }

  fillPageBg();
  const pageContentTop = {1: 0};
  let y = drawHeader() + 12;

  /* ---------- Profil (compact : nom d'artiste [déjà en en-tête], genre, manager/contact uniquement) ---------- */
  doc.setTextColor(...white);
  doc.setFont('helvetica','bold');
  doc.setFontSize(10.5);
  doc.text('PROFIL', CONTENT_X, y);
  y += 6;
  const profileBits = [
    p.genre ? pdfSafe(p.genre) : null,
    p.manager ? `Manager / Contact : ${pdfSafe(p.manager)}` : null,
  ].filter(Boolean);
  if(profileBits.length){
    doc.setFont('helvetica','normal');
    doc.setFontSize(9);
    doc.setTextColor(...mutedLight);
    doc.text(profileBits.join('   ·   '), CONTENT_X, y);
    y += 5.5;
  }
  y += 5;
  doc.setDrawColor(...boxBorder);
  doc.setLineWidth(0.3);
  doc.line(CONTENT_X, y, CONTENT_R, y);
  y += 8;

  pageContentTop[1] = y;

  /* ---------- Ajout de page avec suivi des bornes (pour le mot vertical + pied de page) ---------- */
  function ensureSpace(needed){
    if(y + needed > BOTTOM_LIMIT){
      doc.addPage();
      const pageNum = doc.internal.getNumberOfPages();
      fillPageBg();
      y = 18;
      pageContentTop[pageNum] = y;
      return true;
    }
    return false;
  }

  /* ---------- Programme groupé par date (filtré : à venir OU déjà effectué) ---------- */
  const events = (DATA.bookings || [])
    .filter(b => filterType === 'done' ? b.status === 'terminé' : b.status !== 'terminé')
    .slice()
    .sort((a,b)=> filterType === 'done' ? (daysUntil(b.date) - daysUntil(a.date)) : (daysUntil(a.date) - daysUntil(b.date)));

  doc.setFont('helvetica','bold');
  doc.setFontSize(12.5);
  doc.setTextColor(...white);
  doc.text('BOOKING', CONTENT_X, y);
  y += 9;

  if(!events.length){
    doc.setFont('helvetica','normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...mutedLight);
    const emptyMsg = filterType === 'done' ? 'Aucun événement effectué pour le moment.' : 'Aucun événement à venir pour le moment.';
    doc.text(emptyMsg, CONTENT_X, y);
    y += 8;
  }

  const groups = [];
  events.forEach(b => {
    let g = groups.find(gr => gr.date === b.date);
    if(!g){ g = {date:b.date, items:[]}; groups.push(g); }
    g.items.push(b);
  });

  groups.forEach(group => {
    ensureSpace(45); // évite qu'un en-tête de date se retrouve seul en bas de page
    const dLabel = new Date(group.date + 'T00:00:00').toLocaleDateString('fr-FR', {weekday:'long', day:'2-digit', month:'long', year:'numeric'});
    const dLabelCap = dLabel.charAt(0).toUpperCase() + dLabel.slice(1);
    doc.setFont('helvetica','bold');
    doc.setFontSize(11);
    doc.setTextColor(...violetLight);
    doc.text(dLabelCap, CONTENT_X, y);
    y += 7;

    group.items.forEach(b => {
      const isCancelled = b.confirmation === 'annulé';
      const isDone = b.status === 'terminé';
      const confirmColor = isCancelled ? red : (b.confirmation === 'option' ? orange : green);
      const confirmLabel = isCancelled ? 'ANNULÉ' : (b.confirmation === 'option' ? 'EN OPTION' : 'CONFIRMÉ');
      const accentColor = isCancelled ? mutedLight : (isDone ? green : blue);

      const pillH = 7;
      const boxX = CONTENT_X;
      const boxW = CONTENT_R - CONTENT_X;
      const innerX = boxX + 5;
      const innerW = boxW - 10;
      doc.setFont('helvetica','normal');
      doc.setFontSize(8.3);
      const locLine = b.location ? `Lieu : ${pdfSafe(b.location)}` : null;
      const contactLine = b.contact ? `Contact : ${pdfSafe(b.contact)}` : null;
      const noteLines = b.notes ? doc.splitTextToSize(`Notes : ${pdfSafe(b.notes)}`, innerW) : [];

      let boxH = 5 + 6;
      if(locLine) boxH += 4.6;
      if(contactLine) boxH += 4.6;
      if(noteLines.length) boxH += noteLines.length * 4.2;
      boxH += 4;

      // on garde la pilule horaire et sa boîte ensemble sur la même page
      ensureSpace(pillH + 2.5 + boxH + 6);

      if(b.time){
        const pillW = doc.getTextWidth(b.time) + 12;
        doc.setDrawColor(...violetLight);
        doc.setLineWidth(0.5);
        doc.roundedRect(CONTENT_X, y, pillW, pillH, pillH/2, pillH/2, 'S');
        doc.setTextColor(...violetLight);
        doc.setFont('helvetica','bold');
        doc.setFontSize(9);
        doc.text(b.time, CONTENT_X + pillW/2, y + pillH/2 + 1.2, {align:'center'});
      }
      doc.setFont('helvetica','bold');
      doc.setFontSize(7.5);
      doc.setTextColor(...confirmColor);
      doc.text(confirmLabel, CONTENT_R, y + pillH/2 + 1, {align:'right'});
      y += pillH + 2.5;

      doc.setFillColor(...boxBg);
      doc.setDrawColor(...boxBorder);
      doc.setLineWidth(0.35);
      doc.roundedRect(boxX, y, boxW, boxH, 2.5, 2.5, 'FD');
      doc.setFillColor(...accentColor);
      doc.roundedRect(boxX, y, 1.6, boxH, 0.8, 0.8, 'F');

      let ty = y + 7;
      doc.setFont('helvetica','bold');
      doc.setFontSize(10);
      doc.setTextColor(...(isCancelled ? mutedLight : white));
      const safeTitle = pdfSafe(b.title) || '(sans titre)';
      doc.text(safeTitle, innerX, ty);
      const titleW = doc.getTextWidth(safeTitle);
      if(b.type){
        doc.setFont('helvetica','normal');
        doc.setFontSize(8);
        doc.setTextColor(...blue);
        doc.text(pdfSafe(b.type), innerX + titleW + 4, ty);
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
      doc.setTextColor(...mutedLight);
      if(locLine){ doc.text(locLine, innerX, ty); ty += 4.6; }
      if(contactLine){ doc.text(contactLine, innerX, ty); ty += 4.6; }
      if(noteLines.length){
        doc.setTextColor(...white);
        doc.text(noteLines, innerX, ty);
        ty += noteLines.length * 4.2;
      }

      y += boxH + 6;
    });
    y += 2;
  });

  /* ---------- Mot vertical "PROGRAMME" (remplit toute la hauteur disponible de chaque page) + pied de page violet ----------
     Astuce : on garde une taille de police FIXE (donc une épaisseur de lettres qui ne déborde jamais de la colonne
     latérale ni du bord de page), et on étire le mot jusqu'à la hauteur disponible en espaçant les lettres
     (charSpace), plutôt qu'en grossissant la police — ce qui évite tout risque de texte coupé. */
  const pageCount = doc.internal.getNumberOfPages();
  const SIDEBAR_WORD = 'BOOKING';
  const SIDEBAR_X = 17; // ancrage horizontal du mot, à l'intérieur de la colonne latérale
  const SIDEBAR_FONT = 36; // taille fixe et sûre (épaisseur des lettres ≈ 12-13mm, tient dans SIDEBAR_W)
  doc.setFont('helvetica','bold');
  doc.setFontSize(SIDEBAR_FONT);
  const naturalLen = doc.getTextWidth(SIDEBAR_WORD); // longueur du mot à sa taille normale, avant étirement

  for(let i = 1; i <= pageCount; i++){
    doc.setPage(i);

    const topY = pageContentTop[i] !== undefined ? pageContentTop[i] : 18;
    const bottomY = BOTTOM_LIMIT;
    const available = Math.max(bottomY - topY, 30);
    const targetLen = available * 0.92;

    let fontSize = SIDEBAR_FONT;
    let renderedLen = naturalLen;
    let charSpace = 0;
    if(naturalLen < targetLen){
      // on étire le mot par espacement des lettres pour occuper la hauteur disponible
      charSpace = (targetLen - naturalLen) / (SIDEBAR_WORD.length - 1);
      renderedLen = targetLen;
    } else if(naturalLen > targetLen){
      // page très chargée : peu de place -> on réduit la police (jamais l'inverse, pour ne jamais déborder)
      fontSize = SIDEBAR_FONT * (targetLen / naturalLen);
      renderedLen = targetLen;
    }
    const startY = topY + (available + renderedLen) / 2;

    doc.setTextColor(...violetLight);
    doc.setFont('helvetica','bold');
    doc.setFontSize(fontSize);
    doc.text(SIDEBAR_WORD, SIDEBAR_X, Math.min(startY, bottomY), {angle:90, charSpace: charSpace});

    const barY = FOOTER_TOP;
    doc.setFillColor(...violet);
    doc.roundedRect(CONTENT_X, barY, CONTENT_R - CONTENT_X, FOOTER_H, FOOTER_H/2, FOOTER_H/2, 'F');
    doc.setTextColor(...white);
    doc.setFont('helvetica','bold');
    doc.setFontSize(8);
    doc.text(pdfSafe(p.manager) || pdfSafe(p.name) || 'Artist OS', CONTENT_X + 6, barY + FOOTER_H/2 + 1.3);
    doc.setFont('helvetica','normal');
    doc.setFontSize(7.5);
    doc.text(`page ${i}/${pageCount}`, CONTENT_R - 6, barY + FOOTER_H/2 + 1.3, {align:'right'});
  }

  const filterSlug = filterType === 'done' ? 'deja-effectue' : 'a-venir';
  const filename = `programme-${filterSlug}-${slugify(p.name || 'artiste')}-${new Date().toISOString().slice(0,10)}.pdf`;
  doc.save(filename);
}
/* ============ INIT ============ */
startSync();
