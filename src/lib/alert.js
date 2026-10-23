// Themed SweetAlert2 popups for the contact form. The library is loaded on demand,
// so it doesn't add to the initial page bundle. Styles: `.swal-portfolio` in src/index.css.

const base = {
  width: 'min(30rem, 92vw)',
  buttonsStyling: false,
  // Don't touch html/body height (avoids a scroll jump) — focus is handled by the caller
  heightAuto: false,
  returnFocus: false,
  showClass: { popup: 'swal-portfolio-show' },
  hideClass: { popup: 'swal-portfolio-hide' },
  customClass: {
    popup: 'swal-portfolio',
    title: 'swal-portfolio-title',
    htmlContainer: 'swal-portfolio-text',
    confirmButton: 'swal-portfolio-confirm',
    cancelButton: 'swal-portfolio-cancel',
    actions: 'swal-portfolio-actions',
    timerProgressBar: 'swal-portfolio-progress',
  },
}

const escape = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

async function swal() {
  return (await import('sweetalert2')).default
}

export async function showSuccess({ name, ownerName }) {
  const Swal = await swal()
  const first = escape(name.trim().split(/\s+/)[0])
  return Swal.fire({
    ...base,
    icon: 'success',
    iconColor: '#10b981',
    title: 'Message sent! 🎉',
    html: `Thanks <b>${first}</b>, your query has been sent${ownerName ? ` to ${escape(ownerName)}` : ''}.<br>You'll hear back within 24 hours — a confirmation email is on its way to your inbox.`,
    confirmButtonText: 'Awesome!',
    timer: 7000,
    timerProgressBar: true,
  })
}

// Resolves to 'retry' or 'email' (or 'dismiss' for Esc / backdrop click)
export async function showError({ message, email }) {
  const Swal = await swal()
  const result = await Swal.fire({
    ...base,
    icon: 'error',
    iconColor: '#ef4444',
    title: "Couldn't send your message",
    html: `${escape(message)}${email ? `<br><br>Your message is still in the form — try again, or send it by email to <b>${escape(email)}</b>.` : ''}`,
    confirmButtonText: 'Try again',
    showCancelButton: Boolean(email),
    cancelButtonText: 'Email instead',
    reverseButtons: true,
  })
  if (result.isConfirmed) return 'retry'
  if (result.dismiss === Swal.DismissReason.cancel) return 'email'
  return 'dismiss'
}
