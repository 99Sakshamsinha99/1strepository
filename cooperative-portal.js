document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation Logic ---
    const navLinks = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.portal-view');
    const viewMeta = {
        'view-dashboard': { t: 'Dashboard', s: 'Digital Infrastructure for Labour Cooperatives' },
        'view-workers': { t: 'Worker Roster', s: 'Verified cooperative members and their status' },
        'view-fairwork': { t: 'FairWork Engine', s: 'Fair and balanced work allocation for cooperative members' },
        'view-contracts': { t: 'Community Contracts', s: 'Manage large-scale service requests from RWAs and institutions' },
        'view-squads': { t: 'Community Squads', s: 'Build verified teams for large contracts' },
        'view-tools': { t: 'Cooperative Tool Bank', s: 'Shared equipment owned and managed by the cooperative' },
        'view-payments': { t: 'Transparent Earnings', s: 'Configured earnings distribution logic' },
        'view-welfare': { t: 'Worker Welfare Fund', s: 'Cooperative surplus and member benefits' },
        'view-assembly': { t: 'Member Assembly', s: 'Democratic proposals and voting' }
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-target');
            navLinks.forEach(n => n.classList.remove('active')); link.classList.add('active');
            views.forEach(v => v.classList.remove('active')); document.getElementById(target).classList.add('active');
            document.getElementById('pageTitle').innerText = viewMeta[target].t;
            document.getElementById('pageSubtitle').innerText = viewMeta[target].s;
            document.getElementById('coopSidebar').classList.remove('open');
        });
    });

    document.getElementById('mobileMenuToggle').addEventListener('click', () => {
        document.getElementById('coopSidebar').classList.toggle('open');
    });

    window.demoToast = (msg) => {
        const toast = document.getElementById('toast');
        toast.innerText = msg; toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    };

    // --- MOCK DATA ---
    const workers = [
        { n: "Ravi Kumar", id: "WRK-1024", tr: "Electrician", av: "Available", jb: 8, hr: 62, er: "₹18,400", fr: 92, st: "Balanced", c: "status-green" },
        { n: "Aman Sharma", id: "WRK-1041", tr: "Painter", av: "Available", jb: 3, hr: 21, er: "₹7,200", fr: 58, st: "Under-utilized", c: "status-gold" },
        { n: "Suresh Patel", id: "WRK-1009", tr: "Plumber", av: "On Job", jb: 11, hr: 79, er: "₹23,600", fr: 42, st: "Overloaded", c: "status-red" }
    ];

    document.getElementById('workerTableBody').innerHTML = workers.map(w => `<tr><td><strong>${w.n}</strong></td><td>${w.id}</td><td>${w.tr}</td><td>${w.av}</td><td>${w.jb}</td><td>${w.er}</td><td><button class="btn btn-outline btn-sm" onclick="demoToast('Managing Member')">Manage</button></td></tr>`).join('');
    document.getElementById('fairworkTableBody').innerHTML = workers.map(w => `<tr><td><strong>${w.n}</strong></td><td>${w.jb}</td><td>${w.hr}h</td><td>${w.er}</td><td><strong>${w.fr}</strong></td><td><span class="${w.c}">${w.st}</span></td></tr>`).join('');

    const contracts = [
        { rwa: "Green Valley Residency", svc: "Painting & Maintenance", wrk: 5, days: 14, b: "₹85,000", st: "Active", c: "badge-verified" },
        { rwa: "Municipal Project", svc: "Deep Cleaning", wrk: 12, days: 10, b: "₹1,25,000", st: "Pending", c: "badge-gold" }
    ];
    document.getElementById('contractsGrid').innerHTML = contracts.map(c => `<div class="card"><div class="obj-head"><h3>${c.rwa}</h3><span class="badge ${c.c}">${c.st}</span></div><p class="text-muted">${c.svc}</p><div style="display:flex; justify-content:space-between; margin:1rem 0; font-size:0.85rem;"><span>👷 ${c.wrk} Workers</span><span>📅 ${c.days} Days</span><span>💰 ${c.b}</span></div><button class="btn btn-outline w-100" onclick="demoToast('Viewing Contract')">View Details</button></div>`).join('');

    document.getElementById('squadsGrid').innerHTML = `<div class="card"><div class="obj-head"><h3>Painting Squad</h3><span class="badge badge-verified">Active</span></div><p class="text-muted mb-2">Assigned: Green Valley Residency</p><p style="font-size:0.8rem">Members: Ravi, Aman, Suresh + 2</p><button class="btn btn-dark w-100 mt-3" onclick="demoToast('Manage Squad Opened')">Manage Members</button></div>`;

    const tools = [{ n: "Industrial Drill", id: "TB-001", st: "Available", c: "status-green" }, { n: "Paint Sprayer", id: "TB-002", st: "In Use", c: "status-gold" }];
    document.getElementById('toolsGrid').innerHTML = tools.map(t => `<div class="card text-center"><div style="font-size:3rem; margin-bottom:1rem;">🔧</div><h3>${t.n}</h3><p class="text-muted">ID: ${t.id}</p><span class="${t.c}">${t.st}</span><button class="btn ${t.st==='Available'?'btn-gold':'btn-outline'} w-100 mt-3" onclick="demoToast('${t.st==='Available'?'Tool Reserved':'Requested Status'}')">${t.st==='Available'?'Reserve Tool':'Status'}</button></div>`).join('');

    document.getElementById('assemblyGrid').innerHTML = `<div class="card"><div class="obj-head"><h3>Purchase Paint Sprayer</h3><span class="badge badge-verified">Approved</span></div><p class="text-muted">Proposal #24 • Cost: ₹45,000</p><div style="background:var(--cream); padding:1rem; border-radius:8px; display:flex; justify-content:space-between; text-align:center; margin:1rem 0;"><div><strong class="text-green">37</strong><br><small>YES</small></div><div><strong class="text-red">8</strong><br><small>NO</small></div></div><button class="btn btn-outline w-100" onclick="demoToast('Viewing Proposal')">View Results</button></div>`;

    document.getElementById('activityList').innerHTML = `<li><div style="display:flex; gap:1rem; padding:0.5rem 0; border-bottom:1px solid var(--border);"><span>⚡</span><div><strong>Ravi Kumar</strong> completed electrical contract.<br><small class="text-muted">2 hours ago</small></div></div></li><li><div style="display:flex; gap:1rem; padding:0.5rem 0;"><span>🏢</span><div><strong>Green Valley RWA</strong> created a community contract.<br><small class="text-muted">Yesterday</small></div></div></li>`;
});