document.addEventListener('DOMContentLoaded', () => {

    // Google Apps Script doesn't return readable responses cross-origin,
    // so we use no-cors and optimistically show success on send.
    function setupForm(formId, successId) {
        const form = document.getElementById(formId);
        const success = document.getElementById(successId);
        if (!form || !success) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('[type="submit"]');
            submitBtn.textContent = 'Sending…';
            submitBtn.disabled = true;

            const formData = new FormData(form);
            formData.append('form_type', formId);
            const encoded = new URLSearchParams(formData).toString();

            try {
                await fetch(form.action, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: encoded,
                });
                form.classList.add('hidden');
                success.classList.remove('hidden');
                success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
