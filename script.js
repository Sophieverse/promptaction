document.addEventListener('DOMContentLoaded', () => {

    // Hidden iframe submission — most reliable approach for Google Apps Script.
    // The form posts into a hidden iframe; when the iframe loads the response,
    // we swap in the success state.
    function setupForm(formId, successId, iframeName) {
        const form = document.getElementById(formId);
        const success = document.getElementById(successId);
        const iframe = document.querySelector(`iframe[name="${iframeName}"]`);
        if (!form || !success || !iframe) return;

        let submitted = false;

        form.addEventListener('submit', () => {
            submitted = true;
            const submitBtn = form.querySelector('[type="submit"]');
            submitBtn.textContent = 'Sending…';
            submitBtn.disabled = true;
        });

        iframe.addEventListener('load', () => {
            if (!submitted) return;
            form.classList.add('hidden');
            success.classList.remove('hidden');
            success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    setupForm('org-form', 'org-success', 'org-form-target');
    setupForm('ind-form', 'ind-success', 'ind-form-target');

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
