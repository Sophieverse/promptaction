document.addEventListener('DOMContentLoaded', () => {

    // Formspree AJAX submission with success state swap
    function setupForm(formId, successId) {
        const form = document.getElementById(formId);
        const success = document.getElementById(successId);
        if (!form || !success) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending…';
            submitBtn.disabled = true;

            try {
                const res = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' },
                });
                if (res.ok) {
                    form.classList.add('hidden');
                    success.classList.remove('hidden');
                    success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } else {
                    submitBtn.textContent = 'Something went wrong — try again';
                    submitBtn.disabled = false;
                }
            } catch {
                submitBtn.textContent = 'Something went wrong — try again';
                submitBtn.disabled = false;
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

    // Active nav highlighting on scroll
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
