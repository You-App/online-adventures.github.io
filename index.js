/* To set in mobirise settings:
<!-- Global site tag (gtag.js) - Google Analytics -->
<script defer src="https://www.googletagmanager.com/gtag/js?id=UA-103238291-2"></script>
<script defer src="./index.js"></script>
<!-- netlify identity, hard to embed in the bundle (babel issues) -->
<script defer type="text/javascript" src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
 */

console.log('Hello from index.js!')

/*
document.querySelector('h1').textContent = document.title
Array.prototype.forEach.call(document.querySelectorAll('a'), function(el) {
	el.href || (el.href = el.text)
})
*/

const current_url = new URL(window.location.href)
if (current_url.hash) {
	// for help logging in dev
	console.log(current_url.hash)
}
// redirect to the appropriate webapp if it was requested
// XXX may not be required at all!
const REDIRECT_LS_KEY = 'OA.pending_redirect'
let redirect_request = localStorage.getItem(REDIRECT_LS_KEY)
if (redirect_request) {
	try {
		redirect_request = JSON.parse(redirect_request)
		console.warn('Seen redirect request!', redirect_request)
		const target_url = new URL(redirect_request.url)
		if (target_url.host !== current_url.host) {
			// should never happen since LS is not cross domain, but could be an attack.
			throw new Error('Forbidden external redirects')
		}
		const now_ms =  Date.now()
		if (now_ms - redirect_request.timestamp_ms > 5 * 60 * 1000) {
			throw new Error('Redirect request is outdated')
		}

		// propagate some params
		if (!target_url.hash)
			target_url.hash = current_url.hash
		if (!target_url.search)
			target_url.search = current_url.search

		localStorage.removeItem(REDIRECT_LS_KEY)
		window.location = target_url.href
	}
	catch (err) {
		console.error('redirection failed:', err)
		/* swallow */
	}
	// always, avoid loops
	localStorage.removeItem(REDIRECT_LS_KEY)
}

// Global site tag (gtag.js) - Google Analytics
// TODO rework
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'UA-103238291-2');

