import emailjs from '@emailjs/browser'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export const emailConfigured = !!(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY &&
  SERVICE_ID !== 'service_xxxxxxx')

/**
 * Send amendment notification to all team members.
 * @param {Object} opts
 * @param {string} opts.sopId
 * @param {string} opts.sopTitle
 * @param {string} opts.version
 * @param {string} opts.changeSummary
 * @param {string} opts.changedBy
 * @param {string} opts.teamName
 * @param {Array}  opts.members - [{name, email}]
 */
export async function sendAmendmentNotification({
  sopId, sopTitle, version, changeSummary, changedBy, teamName, members,
}) {
  if (!emailConfigured) {
    console.warn('[EmailJS] Not configured — notification skipped. Set VITE_EMAILJS_* env vars.')
    return { sent: 0, skipped: members.length, reason: 'EmailJS not configured' }
  }

  emailjs.init(PUBLIC_KEY)

  const portalUrl = `${window.location.origin}${window.location.pathname}`
  let sent = 0

  for (const member of members) {
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        to_name: member.name,
        to_email: member.email,
        team_name: teamName,
        sop_id: sopId,
        sop_title: sopTitle,
        new_version: version,
        change_summary: changeSummary,
        changed_by: changedBy,
        portal_url: portalUrl,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      })
      sent++
    } catch (err) {
      console.error(`[EmailJS] Failed to send to ${member.email}:`, err)
    }
  }

  return { sent, skipped: members.length - sent }
}
