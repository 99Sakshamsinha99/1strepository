document.addEventListener('DOMContentLoaded', () => {

    // --- Authentication Check ---
    const authData = JSON.parse(localStorage.getItem('sharmnexus-auth'));
    if (!authData || !authData.isLoggedIn || authData.role !== 'cooperative') {
        window.location.href = 'premium-auth.html';
        return;
    }

    // --- Navigation Logic ---
    const navLinks = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.portal-view');
    const pageTitle = document.getElementById('pageTitle');
    const pageSubtitle = document.getElementById('pageSubtitle');

    const viewMeta = {
        'view-dashboard': { t: 'Dashboard', s: 'Digital Infrastructure for Labour Cooperatives' },
        'view-workers': { t: 'Worker Roster', s: 'Verified cooperative members and their status' },
        'view-fairwork': { t: 'FairWork Engine', s: 'Algorithmic balancing of work allocation' },
        'view-contracts': { t: 'Community Contracts', s: 'Large-scale service requests from RWAs' },
        'view-squads': { t: 'Community Squads', s: 'Verified teams for large community projects' },
        'view-tools': { t: 'Tool Bank', s: 'Shared equipment managed by the cooperative' },
        'view-payments': { t: 'Transparent Payments', s: 'Configured earnings distribution logic' },
        'view-welfare': { t: 'Welfare Fund', s: 'Cooperative surplus and member benefits' },
        'view-assembly': { t: 'Member Assembly', s: 'Democratic proposals and voting' }
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            
            navLinks.forEach(n => n.classList.remove('active'));
            link.classList.add('active');
            
            views.forEach(v => v.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
            
            pageTitle.innerText = viewMeta[targetId].t;
            pageSubtitle.innerText = viewMeta[targetId].s;

            document.getElementById('coopSidebar').classList.remove('open');
        });
    });

    document.getElementById('mobileMenuToggle').addEventListener('click', () => {
        document.getElementById('coopSidebar').classList.toggle('open');
    });

    // --- Language Translation Logic ---
    const translations = {
        en: {}, hi: {}, bn: {}, mr: {}, ta: {}, te: {}
        // Can be populated to match your other files if needed.
    };

    const LANG_STORAGE_KEY = 'sharmnexus-lang';
    const navSelect = document.getElementById('nav-language-select');
    
    if (navSelect) {
        let savedLang = localStorage.getItem(LANG_STORAGE_KEY) || 'en';
        navSelect.value = savedLang;
        navSelect.addEventListener('change', () => {
            localStorage.setItem(LANG_STORAGE_KEY, navSelect.value);
            // applyLanguage(navSelect.value); // Add translation mapper here if you expand the dict
        });
    }

    // --- Demo Action Global Helper ---
    window.demoAction = (message) => {
        const toast = document.getElementById('toast');
        toast.innerText = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    };

    // --- MOCK DATA & RENDERING ---

    // 1. Worker Roster & FairWork
    const mockWorkers = [
        { name: "Ravi Kumar", id: "WRK-1024", trade: "Electrician", verif: true, avail: "Available", jobs: 8, hrs: 62, earn: "₹18,400", fair: 92, st: "Balanced", stClass: "status-green" },
        { name: "Aman Sharma", id: "WRK-1041", trade: "Painter", verif: true, avail: "Available", jobs: 3, hrs: 21, earn: "₹7,200", fair: 58, st: "Under-utilized", stClass: "status-gold" },
        { name: "Suresh Patel", id: "WRK-1009", trade: "Plumber", verif: true, avail: "On Job", jobs: 11, hrs: 79, earn: "₹23,600", fair: 42, st: "Overloaded", stClass: "status-red" },
        { name: "Neha Gupta", id: "WRK-1102", trade: "Cleaner", verif: true, avail: "Available", jobs: 7, hrs: 45, earn: "₹12,100", fair: 88, st: "Balanced", stClass: "status-green" }
    ];

    const workerHtml = mockWorkers.map(w => `
        <tr>
            <td><strong>${w.name}</strong></td><td>${w.id}</td><td>${w.trade}</td>
            <td><span class="badge badge-verified">✓ Verified</span></td>
            <td>${w.avail}</td><td>${w.jobs}</td><td>${w.earn}</td>
            <td><strong class="${w.stClass}">${w.fair}</strong></td>
        </tr>
    `).join('');
    document.getElementById('workerTableBody').innerHTML = workerHtml;

    const fairWorkHtml = mockWorkers.map(w => `
        <tr>
            <td><strong>${w.name}</strong></td><td>${w.jobs}</td><td>${w.hrs}h</td><td>${w.earn}</td>
            <td><strong>${w.fair}</strong></td>
            <td><span class="${w.stClass}">${w.st}</span></td>
        </tr>
    `).join('');
    document.getElementById('fairworkTableBody').innerHTML = fairWorkHtml;

    // 2. Contracts
    const mockContracts = [
        { rwa: "Green Valley Residency", svc: "Painting & Maint.", wrk: 5, days: 14, budg: "₹85,000", st: "Active", stClass: "badge-verified" },
        { rwa: "Shanti Nagar RWA", svc: "Electrical Update", wrk: 3, days: 30, budg: "₹62,000", st: "Pending", stClass: "badge-gold" },
        { rwa: "Municipal Project", svc: "Deep Cleaning", wrk: 12, days: 10, budg: "₹1,25,000", st: "Completed", stClass: "badge-outline" }
    ];
    document.getElementById('contractsGrid').innerHTML = mockContracts.map(c => `
        <div class="obj-card">
            <div class="obj-head"><h3>${c.rwa}</h3><span class="badge ${c.stClass}">${c.st}</span></div>
            <p class="text-muted">${c.svc}</p>
            <div class="obj-stats"><div><strong>${c.wrk}</strong><br><small>Workers</small></div><div><strong>${c.days}</strong><br><small>Days</small></div><div><strong>${c.budg}</strong><br><small>Budget</small></div></div>
            <div class="obj-actions"><button class="btn btn-outline btn-sm" style="color:var(--ink); border-color:var(--border)" onclick="demoAction('Viewing Contract')">View Details</button></div>
        </div>
    `).join('');

    // 3. Squads
    document.getElementById('squadsGrid').innerHTML = `
        <div class="obj-card">
            <div class="obj-head"><h3>Painting Squad Alpha</h3><span class="badge badge-verified">Active</span></div>
            <p class="text-muted">Assigned: Green Valley Residency</p>
            <div class="mt-3 mb-2"><small>Progress: 68%</small><div style="width:100%; height:6px; background:var(--cream-dark); border-radius:3px; margin-top:4px;"><div style="width:68%; height:100%; background:var(--green); border-radius:3px;"></div></div></div>
            <p class="text-muted mt-2" style="font-size:0.8rem">Members: Aman, Suresh, Rahul + 2</p>
            <div class="obj-actions mt-3"><button class="btn btn-dark w-100" onclick="demoAction('Managing Squad')">Manage Squad</button></div>
        </div>
    `;

    // 4. Tools
    const mockTools = [
        { n: "Industrial Drill", id: "TB-001", st: "Available", stClass: "status-green" },
        { n: "Paint Sprayer", id: "TB-002", st: "In Use", stClass: "status-gold" },
        { n: "Welding Machine", id: "TB-003", st: "Available", stClass: "status-green" },
        { n: "Pressure Washer", id: "TB-004", st: "Maintenance", stClass: "status-red" }
    ];
    document.getElementById('toolsGrid').innerHTML = mockTools.map(t => `
        <div class="obj-card" style="align-items:center; text-align:center;">
            <div style="font-size:3rem; margin-bottom:1rem;">🔧</div>
            <h3>${t.n}</h3>
            <p class="text-muted mb-2">ID: ${t.id}</p>
            <span class="${t.stClass}">${t.st}</span>
            <div class="obj-actions mt-3 w-100">
                ${t.st === 'Available' ? `<button class="btn btn-gold w-100" onclick="demoAction('Tool Reserved')">Reserve</button>` : `<button class="btn btn-outline w-100" style="color:var(--ink); border-color:var(--border)" onclick="demoAction('Requesting Return')">Status</button>`}
            </div>
        </div>
    `).join('');

    // 5. Assembly
    document.getElementById('assemblyGrid').innerHTML = `
        <div class="obj-card">
            <div class="obj-head"><h3>Purchase Industrial Sprayer</h3><span class="badge badge-verified">Approved</span></div>
            <p class="text-muted mb-2">Proposal #24 • Cost: ₹45,000</p>
            <div style="background:var(--cream); padding:1rem; border-radius:8px; display:flex; justify-content:space-between; text-align:center;">
                <div><strong class="text-green">37</strong><br><small>YES</small></div>
                <div><strong class="text-red">8</strong><br><small>NO</small></div>
                <div><strong class="text-muted">3</strong><br><small>ABSTAIN</small></div>
            </div>
            <div class="obj-actions mt-3"><button class="btn btn-outline w-100" style="color:var(--ink); border-color:var(--border)" onclick="demoAction('Viewing Resolution')">View Details</button></div>
        </div>
    `;

    // 6. Activity
    document.getElementById('activityList').innerHTML = `
        <li><div class="act-icon">⚡</div><div><strong>Ravi Kumar</strong> completed electrical contract. <br><small class="text-muted">2 hours ago</small></div></li>
        <li><div class="act-icon">📄</div><div><strong>New member</strong> submitted verification documents. <br><small class="text-muted">5 hours ago</small></div></li>
        <li><div class="act-icon">🏢</div><div><strong>Green Valley RWA</strong> created a community contract. <br><small class="text-muted">Yesterday</small></div></li>
        <li><div class="act-icon">🧰</div><div><strong>Paint Sprayer</strong> returned to Tool Bank. <br><small class="text-muted">Yesterday</small></div></li>
    `;

    // --- CHART.JS INIT WITH STRICT SIZING FIX ---
    const ctx = document.getElementById('coopRevenueChart');
    if(ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                datasets: [{
                    label: 'Cooperative Revenue (₹)',
                    data: [320000, 380000, 350000, 410000, 390000, 420000],
                    backgroundColor: '#e6aa3b',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // CRITICAL FOR HEIGHT FIX
                scales: { 
                    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } }, 
                    x: { grid: { display: false } } 
                },
                plugins: { legend: { display: false } }
            }
        });
    }
});