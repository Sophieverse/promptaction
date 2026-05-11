document.addEventListener('DOMContentLoaded', () => {

    // Netlify form handling with success state swap
    function setupForm(formId, successId) {
        const form = document.getElementById(formId);
        const success = document.getElementById(successId);
        if (!form || !success) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = new FormData(form);
            try {
                const res = await fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(data).toString(),
                });
                if (res.ok) {
                    form.classList.add('hidden');
                    success.classList.remove('hidden');
                    success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } else {
                    form.querySelector('[type="submit"]').textContent = 'Something went wrong — try again';
                }
            } catch {
                form.querySelector('[type="submit"]').textContent = 'Something went wrong — try again';
            }
        });
    }

    setupForm('org-form', 'org-success');
    setupForm('ind-form', 'ind-success');

    // Copy link button
    const copyBtn = document.getElementById('copy-link');
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText('https://promptaction.org');
                const orig = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => { copyBtn.textContent = orig; }, 2000);
            } catch {
                copyBtn.textContent = 'promptaction.org';
            }
        });
    }

    // Smooth active nav highlighting on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.site-header nav a');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--accent)' : '';
                });
            }
        });
    }, { rootMargin: '-20% 0px -60% 0px' });

    sections.forEach(s => observer.observe(s));
});
