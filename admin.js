document.addEventListener('DOMContentLoaded', () => {

    // --- PROTOTYPE SECRET CONFIG ---
    const SECRET_ADMIN_EMAIL = "admin@sharmnexus.com";
    const ADMIN_AUTH_KEY = "sharmnexus-admin-auth";

    // ---------------------------------------------------------
    // 1. ADMIN LOGIN LOGIC (admin-login.html)
    // ---------------------------------------------------------
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
        if (localStorage.getItem(ADMIN_AUTH_KEY) === 'true') {
            window.location.href = 'admin-dashboard.html';
        }

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('admin-email').value.trim();
            const errorBox = document.getElementById('admin-error');
            
            if (email === SECRET_ADMIN_EMAIL) {
                localStorage.setItem(ADMIN_AUTH_KEY, 'true');
                window.location.href = 'admin-dashboard.html';
            } else {
                errorBox.style.display = 'block';
            }
        });
        return; 
    }

    // ---------------------------------------------------------
    // 2. ADMIN DASHBOARD GUARD
    // ---------------------------------------------------------
    if (!localStorage.getItem(ADMIN_AUTH_KEY)) {
        alert("🔒 Access Denied. Admin authentication required.");
        window.location.href = 'premium-auth.html';
        return;
    }

    document.getElementById('admin-logout')?.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem(ADMIN_AUTH_KEY);
        window.location.href = 'premium-auth.html';
    });

    // ---------------------------------------------------------
    // 3. NAVIGATION TAB LOGIC
    // ---------------------------------------------------------
    window.switchAdminTab = function(targetId) {
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        document.querySelectorAll('.admin-view').forEach(v => v.classList.remove('active'));
        
        const trigger = document.querySelector(`[data-target="${targetId}"]`);
        if(trigger) trigger.classList.add('active');
        
        const targetView = document.getElementById(targetId);
        if(targetView) targetView.classList.add('active');
    };

    document.querySelectorAll('.nav-item[data-target]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            switchAdminTab(item.getAttribute('data-target'));
        });
    });

    // ---------------------------------------------------------
    // 4. MOCK DATA & REMOVAL LOGIC
    // ---------------------------------------------------------
    
    // Mutable Data Arrays (Unique entries only)
    let mockWorkers = [
        { id: "W1", name: "Raj Kumar", cat: "Plumbing", jobs: 327, verif: "Verified", status: "Online" },
        { id: "W2", name: "Meena Devi", cat: "Electrical", jobs: 184, verif: "Verified", status: "Offline" },
        { id: "W3", name: "Sunita Sharma", cat: "Cleaning", jobs: 412, verif: "Verified", status: "Online" },
        { id: "W4", name: "Amit Singh", cat: "Technician", jobs: 56, verif: "Pending", status: "Offline" },
        { id: "W5", name: "Vikram Yadav", cat: "Driver", jobs: 210, verif: "Verified", status: "Online" }
    ];

    let mockCoops = [
        { id: "C1", name: "Shakti Labour Coop", reg: "REG-9921", members: 248, status: "Active" },
        { id: "C2", name: "Rajasthan Navnirman", reg: "REG-8834", members: 112, status: "Under Review" },
        { id: "C3", name: "Jaipur Cleaning Society", reg: "REG-7721", members: 45, status: "Active" }
    ];

    // Render Functions
    const renderWorkers = () => {
        const workTbody = document.getElementById('workers-tbody');
        if (!workTbody) return;
        workTbody.innerHTML = mockWorkers.map(w => `
            <tr>
                <td><strong>${w.name}</strong></td>
                <td>${w.cat}</td>
                <td>${w.jobs}</td>
                <td><span class="badge ${w.verif === 'Verified' ? 'badge-verified' : 'badge-pending'}">${w.verif}</span></td>
                <td><span style="color: ${w.status === 'Online' ? 'var(--green)' : 'var(--muted)'}">● ${w.status}</span></td>
                <td>
                    <button class="btn btn-outline" style="padding: 0.3rem 0.6rem; font-size: 0.7rem; color: var(--red); border-color: var(--red);" 
                    onclick="triggerAdminAction('worker', '${w.id}', '${w.name}')">Remove</button>
                </td>
            </tr>
        `).join('');
    };

    const renderCoops = () => {
        const coopsTbody = document.getElementById('coops-tbody');
        if (!coopsTbody) return;
        coopsTbody.innerHTML = mockCoops.map(c => `
            <tr>
                <td><strong>${c.name}</strong></td>
                <td>${c.reg}</td>
                <td>${c.members}</td>
                <td><span class="badge ${c.status === 'Active' ? 'badge-verified' : 'badge-pending'}">${c.status}</span></td>
                <td>
                    <button class="btn btn-outline" style="padding: 0.3rem 0.6rem; font-size: 0.7rem; color: var(--red); border-color: var(--red);" 
                    onclick="triggerAdminAction('coop', '${c.id}', '${c.name}')">Suspend/Remove</button>
                </td>
            </tr>
        `).join('');
    };

    // Removal Modal Logic
    let pendingAction = null;

    window.triggerAdminAction = (type, id, name) => {
        pendingAction = { type, id, name };
        document.getElementById('admin-action-title').innerText = type === 'worker' ? 'Remove Worker' : 'Suspend Cooperative';
        document.getElementById('admin-action-desc').innerText = `Are you sure you want to remove ${name} from the ShramNexus platform? This action is logged.`;
        document.getElementById('admin-action-modal').style.display = 'flex';
    };

    document.getElementById('confirm-action-btn')?.addEventListener('click', () => {
        if (!pendingAction) return;
        
        const reason = document.getElementById('admin-action-reason').value;
        
        if (pendingAction.type === 'worker') {
            mockWorkers = mockWorkers.filter(w => w.id !== pendingAction.id);
            renderWorkers();
        } else if (pendingAction.type === 'coop') {
            mockCoops = mockCoops.filter(c => c.id !== pendingAction.id);
            renderCoops();
        }

        document.getElementById('admin-action-modal').style.display = 'none';
        
        const toast = document.getElementById('admin-toast');
        if(toast) {
            toast.innerText = `${pendingAction.name} has been removed. (Reason: ${reason})`;
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
            setTimeout(() => {
                toast.style.transform = 'translateY(100px)';
                toast.style.opacity = '0';
            }, 3000);
        }
        
        pendingAction = null;
    });

    // ---------------------------------------------------------
    // 5. OTHER STATIC MOCK DATA (Customers, Bookings, Reviews)
    // ---------------------------------------------------------
    const mockCustomers = [
        { name: "Priya Sharma", email: "priya.s@example.com", bookings: 12, spent: "₹ 5,400", status: "Active", date: "Jan 12, 2023" },
        { name: "Rahul Verma", email: "rahul.v@example.com", bookings: 4, spent: "₹ 1,800", status: "Active", date: "Mar 05, 2023" },
        { name: "Anita Desai", email: "anita.d@example.com", bookings: 28, spent: "₹ 14,200", status: "Active", date: "Nov 22, 2022" }
    ];

    const custTbody = document.getElementById('customers-tbody');
    if (custTbody) {
        custTbody.innerHTML = mockCustomers.map(c => `
            <tr>
                <td><strong>${c.name}</strong></td>
                <td>${c.email}</td>
                <td>${c.bookings}</td>
                <td>${c.spent}</td>
                <td><span class="badge ${c.status === 'Active' ? 'badge-success' : 'badge-cancelled'}">${c.status}</span></td>
                <td>${c.date}</td>
            </tr>
        `).join('');
    }

    const mockReviews = [
        { c: "Priya Sharma", w: "Raj Kumar", s: "Plumbing", r: "★★★★★", rev: "Excellent work, arrived on time.", d: "Today" },
        { c: "Rahul Verma", w: "Meena Devi", s: "Electrical", r: "★★★★☆", rev: "Good job, but a bit expensive.", d: "Yesterday" },
        { c: "Anita Desai", w: "Sunita Sharma", s: "Cleaning", r: "★★★★★", rev: "Spotless cleaning. Highly recommend.", d: "Oct 12" }
    ];

    const revTbody = document.getElementById('reviews-tbody');
    if (revTbody) {
        revTbody.innerHTML = mockReviews.map(r => `
            <tr>
                <td>${r.c}</td><td>${r.w}</td><td>${r.s}</td>
                <td style="color: var(--gold); letter-spacing: 2px;">${r.r}</td>
                <td><span style="font-size: 0.8rem; color: var(--muted);">${r.rev}</span></td>
                <td>${r.d}</td>
            </tr>
        `).join('');
    }

    const mockBookings = [
        { id: "#SNX-992", c: "Priya Sharma", w: "Raj Kumar", s: "Plumbing", d: "Oct 14, 2023", a: "₹ 450", st: "Ongoing", bc: "badge-ongoing" },
        { id: "#SNX-991", c: "Rahul Verma", w: "Sunita Sharma", s: "Cleaning", d: "Oct 14, 2023", a: "₹ 800", st: "Pending", bc: "badge-pending" },
        { id: "#SNX-990", c: "Anita Desai", w: "Meena Devi", s: "Electrical", d: "Oct 13, 2023", a: "₹ 350", st: "Completed", bc: "badge-success" }
    ];

    const bookTbody = document.getElementById('bookings-tbody');
    if (bookTbody) {
        bookTbody.innerHTML = mockBookings.map(b => `
            <tr>
                <td><strong>${b.id}</strong></td>
                <td>${b.c}</td><td>${b.w}</td><td>${b.s}</td>
                <td>${b.d}</td><td>${b.a}</td>
                <td><span class="badge ${b.bc}">${b.st}</span></td>
            </tr>
        `).join('');
    }

    // Initialize Active Tables
    renderWorkers();
    renderCoops();

    // ---------------------------------------------------------
    // 6. CHART.JS EARNINGS
    // ---------------------------------------------------------
    const ctx = document.getElementById('earningsChart');
    if (ctx) {
        const earningsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Platform Commission (₹)',
                        data: [12000, 19000, 15000, 22000, 18000, 28000, 31000],
                        borderColor: '#e6aa3b',
                        backgroundColor: 'rgba(230, 170, 59, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Worker Payouts (₹)',
                        data: [48000, 76000, 60000, 88000, 72000, 112000, 124000],
                        borderColor: '#18ae79',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'top', labels: { usePointStyle: true, font: { family: "'DM Sans', sans-serif" } } } },
                scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } }, x: { grid: { display: false } } }
            }
        });

        document.querySelectorAll('.chart-filters .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.chart-filters .btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const multiplier = e.target.dataset.range === '30D' ? 4 : e.target.dataset.range === '6M' ? 24 : e.target.dataset.range === '1Y' ? 48 : 1;
                earningsChart.data.datasets[0].data = earningsChart.data.datasets[0].data.map(() => Math.floor(Math.random() * 20000 * multiplier) + (10000 * multiplier));
                earningsChart.data.datasets[1].data = earningsChart.data.datasets[0].data.map(val => val * 4);
                earningsChart.update();
            });
        });
    }
});