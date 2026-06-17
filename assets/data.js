/* Bug Bounty Checklist data.
   Each domain holds phases; each phase holds items.
   item: { t: title, d: detail/how, tags: [labels] } */

window.CHECKLIST = {
  web: {
    label: "Web Application",
    blurb: "End to end methodology for a web target, from passive recon to reporting. Work top to bottom; do not skip recon.",
    phases: [
      {
        name: "Phase 1. Scope and Rules",
        items: [
          { t: "Read the program policy fully", d: "Confirm in scope domains, out of scope assets, allowed test types, and reward table before sending a single request." },
          { t: "Note testing constraints", d: "Rate limits, no automated scanning rules, no social engineering, no physical, no DoS, required user agent or header tag." },
          { t: "Identify the asset boundary", d: "Wildcard scope, single host, specific paths only. Anything touched outside scope is unpaid and risky." },
          { t: "Set a unique marker", d: "Use a fixed identifier in your traffic so the program can attribute and whitelist your testing." },
          { t: "Record a baseline", d: "Capture normal responses and timings so anomalies are obvious later." }
        ]
      },
      {
        name: "Phase 2. Passive Recon",
        items: [
          { t: "WHOIS and registration data", d: "Owner org, registrar, creation date, related contacts that reveal sibling assets." },
          { t: "DNS records", d: "A, AAAA, CNAME, MX, TXT, NS. TXT often leaks vendors and verification tokens." },
          { t: "Certificate transparency logs", d: "crt.sh and similar reveal subdomains and internal naming patterns from issued certificates." },
          { t: "Search engine and archive mining", d: "Wayback Machine, Google dorks, GitHub code search for the domain, secrets, and forgotten endpoints." },
          { t: "ASN and IP ranges", d: "Map the netblocks the org owns to widen the host surface." },
          { t: "Technology fingerprint", d: "Server, framework, CMS, CDN, WAF, language, build headers. Drives which classes of bug to prioritise." },
          { t: "Public breach and paste exposure", d: "Look for leaked credentials and tokens tied to the target that may still work." }
        ]
      },
      {
        name: "Phase 3. Active Recon and Asset Discovery",
        items: [
          { t: "Subdomain enumeration", d: "Combine passive sources with active brute force and permutation. Resolve and dedupe." },
          { t: "Live host probing", d: "Probe ports and HTTP services, capture status, title, tech, and screenshots for triage." },
          { t: "Virtual host discovery", d: "Same IP may serve multiple hosts. Fuzz the Host header to find hidden apps." },
          { t: "Port and service scan", d: "Find non web services, admin panels, databases, and dev ports exposed to the internet." },
          { t: "Cloud asset discovery", d: "Storage buckets, blobs, and object stores tied to the brand. Check for public listing and write access." },
          { t: "Identify staging and dev environments", d: "dev, test, uat, staging, beta hostnames often have weaker controls and verbose errors." }
        ]
      },
      {
        name: "Phase 4. Content and Endpoint Discovery",
        items: [
          { t: "Crawl the full application", d: "Spider authenticated and unauthenticated. Capture every parameter, form, and request." },
          { t: "Directory and file fuzzing", d: "Use curated wordlists per detected tech. Hunt backups, configs, and admin paths." },
          { t: "Parse robots, sitemap, and security txt", d: "These name paths the owner did not want indexed and disclosure contacts." },
          { t: "Extract endpoints from JavaScript", d: "Pull API routes, paths, and parameters referenced in client bundles." },
          { t: "Map every HTTP method", d: "Test GET, POST, PUT, DELETE, PATCH, OPTIONS per endpoint. Method override may bypass checks." },
          { t: "Find old API versions", d: "v1 and legacy routes may lack fixes present in current versions." },
          { t: "GraphQL endpoint discovery", d: "Probe /graphql, /graphiql, and similar. If present, switch to the GraphQL checks in the API methodology for introspection, depth, and resolver authorisation." }
        ]
      },
      {
        name: "Phase 5. JavaScript and Client Side Analysis",
        items: [
          { t: "Collect every script and source map", d: "Download all JS, vendor bundles, and any exposed .map files that reconstruct source." },
          { t: "Hunt hardcoded secrets", d: "API keys, tokens, cloud credentials, signing keys, third party secrets left in client code." },
          { t: "Enumerate API routes and parameters", d: "Build a request inventory from the client even for endpoints not linked in the UI." },
          { t: "Review client side authorisation", d: "Hidden admin features gated only by JS flags are reachable by forcing the request." },
          { t: "Inspect postMessage handlers", d: "Missing origin checks lead to DOM XSS and data theft across frames." },
          { t: "Trace DOM sinks", d: "innerHTML, document.write, eval, location assignment fed by user input cause DOM XSS." },
          { t: "Audit dependency versions", d: "Map front end library versions to known client side vulnerabilities." },
          { t: "Check source map and debug leftovers", d: "Comments, TODOs, internal hostnames, and test credentials hidden in bundles." },
          { t: "Prototype pollution", d: "Polluting Object.prototype via __proto__ or constructor through JSON, query input, and unsafe merge or clone. Client side gadgets give DOM XSS; server side gives logic bypass and RCE." },
          { t: "Subresource integrity", d: "Third party scripts and styles loaded without integrity hashes. A swapped or compromised CDN asset then runs in the app origin." }
        ]
      },
      {
        name: "Phase 6. Authentication and the Login Page",
        items: [
          { t: "Username enumeration", d: "Different error text, status, or timing for valid versus invalid users reveals accounts." },
          { t: "Credential brute force protection", d: "Test for lockout, rate limit, and captcha. Try IP rotation and header tricks to bypass." },
          { t: "Password policy and reset flow", d: "Weak minimums, reusable reset tokens, tokens in URLs, host header poisoning of reset links." },
          { t: "Reset token quality", d: "Predictable, non expiring, reusable, or not bound to the account tokens enable takeover." },
          { t: "Multi factor bypass", d: "Skip the second step, brute the code, reuse a code, or remove the MFA parameter from the request." },
          { t: "OAuth and SSO flaws", d: "redirect_uri validation, state parameter for CSRF, token leakage, account linking confusion." },
          { t: "Default and weak credentials", d: "Vendor defaults and obvious combinations on admin and infra panels." },
          { t: "Login over insecure channel", d: "Credentials posted without TLS or mixed content on the login page." },
          { t: "Verbose authentication errors", d: "Stack traces and detailed messages that disclose internal logic." },
          { t: "Remember me and persistent tokens", d: "Long lived tokens that are guessable, not revoked on logout, or stored insecurely." },
          { t: "SAML assertion flaws", d: "XML signature wrapping, unsigned or signature stripped assertions accepted, audience and recipient not validated, and assertion replay across sessions." }
        ]
      },
      {
        name: "Phase 7. Session Management",
        items: [
          { t: "Cookie attributes", d: "HttpOnly, Secure, SameSite, sensible scope and expiry on every session cookie." },
          { t: "Session fixation", d: "Session identifier must rotate on privilege change and login." },
          { t: "Session invalidation", d: "Logout, password change, and reset must kill all active sessions server side." },
          { t: "Token entropy", d: "Session identifiers must be long and unpredictable, never sequential or encoded user data." },
          { t: "Concurrent session handling", d: "Behaviour with multiple active sessions and whether old tokens stay valid." },
          { t: "JWT handling", d: "alg none, weak signing secret, kid injection, unverified signature, missing expiry checks." }
        ]
      },
      {
        name: "Phase 8. Authorisation and Access Control",
        items: [
          { t: "Insecure direct object references", d: "Swap identifiers in requests to read or modify another user resource." },
          { t: "Horizontal privilege escalation", d: "One user accessing a peer account data or actions." },
          { t: "Vertical privilege escalation", d: "Standard user reaching admin only functions and endpoints." },
          { t: "Forced browsing to privileged pages", d: "Direct navigation to admin URLs that rely on hidden links for protection." },
          { t: "Parameter based role escalation", d: "Hidden role, isAdmin, or account_type fields accepted from the client." },
          { t: "Mass assignment", d: "Extra object properties bound by the framework grant elevated state." },
          { t: "Multi step flow tampering", d: "Skip or reorder steps to reach a state without passing required checks." }
        ]
      },
      {
        name: "Phase 9. Input Handling and Injection",
        items: [
          { t: "Reflected XSS", d: "User input echoed into the response without context aware encoding." },
          { t: "Stored XSS", d: "Persisted payloads that execute for other users, especially in profiles, comments, and admin views." },
          { t: "DOM XSS", d: "Client side sinks driven by URL fragments, query values, or message data." },
          { t: "SQL injection", d: "Error based, boolean and time blind, and second order in every parameter and header." },
          { t: "NoSQL injection", d: "Operator injection in JSON queries and authentication bypass on document stores." },
          { t: "Command injection", d: "User input reaching shell calls, file utilities, or system commands." },
          { t: "Path traversal and local file inclusion", d: "Parameters such as ?file= and ?page= that escape the web root with ../ sequences and encodings to read arbitrary files; PHP wrappers and log poisoning can escalate to code execution." },
          { t: "Server side template injection", d: "Template expressions evaluated server side leading to data leak or code execution." },
          { t: "XML external entity", d: "XML parsers that resolve external entities enabling file read and SSRF." },
          { t: "LDAP and other interpreter injection", d: "Filters and lookups built from unsanitised input." },
          { t: "Header and host injection", d: "Host, Referer, and forwarded headers reflected into links, caches, or logic." },
          { t: "CRLF and response splitting", d: "Newline injection into headers enabling cache poisoning and header forgery." },
          { t: "Insecure deserialisation", d: "Native deserialisers on attacker controlled data, including Java, .NET ViewState, PHP unserialize, Python pickle, and Ruby Marshal, leading to gadget chains and RCE." },
          { t: "HTTP parameter pollution", d: "Duplicate or array parameters across query, body, and path that change server side logic or bypass validation and WAF rules." },
          { t: "CSV and formula injection", d: "Exported spreadsheets that execute formula payloads beginning with =, +, -, or @ when opened, enabling command execution on the victim host." }
        ]
      },
      {
        name: "Phase 10. Server Side Request Forgery",
        items: [
          { t: "Identify outbound fetchers", d: "URL preview, webhook, import by URL, PDF and image processors, and integrations." },
          { t: "Reach internal services", d: "Loopback, private ranges, and internal hostnames behind the application." },
          { t: "Cloud metadata access", d: "Instance metadata endpoints that expose credentials and configuration." },
          { t: "Bypass URL filters", d: "Alternate encodings, redirects, DNS rebinding, and uncommon schemes." },
          { t: "Blind SSRF detection", d: "Out of band callbacks confirm requests even with no response shown." }
        ]
      },
      {
        name: "Phase 11. File Upload and Handling",
        items: [
          { t: "Content type and extension checks", d: "Bypass client and server filters to upload executable or active content." },
          { t: "Path traversal on upload", d: "Filename input that escapes the intended directory." },
          { t: "Server side processing flaws", d: "Image and document parsers vulnerable to injection or memory bugs." },
          { t: "Stored file retrieval", d: "Predictable URLs, missing authorisation, and direct access to other users files." },
          { t: "Polyglot and double extension", d: "Files valid as two types that slip past naive validation." }
        ]
      },
      {
        name: "Phase 12. Business Logic and Workflow",
        items: [
          { t: "Price and quantity tampering", d: "Negative values, currency switches, and rounding abuse in cart and checkout." },
          { t: "Coupon and reward abuse", d: "Stacking, reuse, and replay of single use discounts." },
          { t: "Workflow state bypass", d: "Reaching a final state without payment, approval, or verification." },
          { t: "Race conditions", d: "Concurrent requests that double spend, double redeem, or bypass single use limits. Use the single packet technique to land requests in the same tight window." },
          { t: "Quantity and limit bypass", d: "Exceeding per user caps through parallel or replayed requests." },
          { t: "Replay of signed or one time actions", d: "Reusing tokens, nonces, or receipts intended for a single use." }
        ]
      },
      {
        name: "Phase 13. Cross Origin and Request Forgery",
        items: [
          { t: "CSRF on state changing actions", d: "Missing or predictable anti CSRF tokens on sensitive POST and state changes." },
          { t: "CORS misconfiguration", d: "Reflected origin with credentials, null origin trust, or overly broad allow lists." },
          { t: "Clickjacking", d: "Sensitive actions framable due to missing frame ancestors protection." },
          { t: "Open redirect", d: "Unvalidated redirect parameters usable for phishing and token theft chains." },
          { t: "WebSocket security", d: "Cross site WebSocket hijacking from missing origin checks on the handshake, missing authentication, and injection inside messages." }
        ]
      },
      {
        name: "Phase 14. HTTP Protocol and Smuggling",
        items: [
          { t: "HTTP request smuggling", d: "Front end and back end disagreement on request boundaries: CL.TE, TE.CL, TE.TE, CL.0, and H2 downgrade desync. Chain to cache poisoning, request hijack, and auth bypass." },
          { t: "Client side desync", d: "Browser powered desync where the victim browser is coerced into smuggling a request. Confirm with response timing and a controlled gadget." }
        ]
      },
      {
        name: "Phase 15. Configuration and Disclosure",
        items: [
          { t: "Security headers", d: "Content security policy, frame ancestors, HSTS, and referrer policy presence and quality." },
          { t: "Exposed sensitive files", d: "git directories, env files, backups, configs, and debug consoles reachable over HTTP." },
          { t: "Verbose errors and stack traces", d: "Internal paths, framework versions, and query disclosure on error." },
          { t: "Directory listing", d: "Browsable folders exposing files not meant to be public." },
          { t: "Default and sample pages", d: "Server welcome pages, sample apps, and admin consoles left installed." },
          { t: "Sensitive data in transit and at rest", d: "Tokens in URLs, PII in responses, and secrets in caches and logs." },
          { t: "Subdomain takeover", d: "Dangling DNS records pointing to unclaimed third party services." },
          { t: "Cache poisoning and deception", d: "Unkeyed inputs that poison shared caches or trick caching of private pages." },
          { t: "Email spoofing controls", d: "Missing or weak SPF, DKIM, and DMARC on sending domains allow spoofed mail and phishing as the brand." }
        ]
      },
      {
        name: "Phase 16. Validation and Reporting",
        items: [
          { t: "Reproduce reliably", d: "Confirm the issue from a clean session with clear, minimal steps." },
          { t: "Assess real impact", d: "Tie the finding to concrete business and user harm, not theory." },
          { t: "Score severity", d: "Use a recognised rating and justify the vector and context." },
          { t: "Write a clear report", d: "Summary, steps, request and response evidence, impact, and a concrete fix." },
          { t: "Stay in scope and ethical", d: "No data exfiltration beyond proof, no lateral movement, no service disruption." }
        ]
      }
    ]
  },

  api: {
    label: "API",
    blurb: "Aligned to the OWASP API Security Top 10 with practical recon and per endpoint testing for REST and GraphQL.",
    phases: [
      {
        name: "Phase 1. API Recon and Inventory",
        items: [
          { t: "Locate API documentation", d: "Swagger, OpenAPI, Postman collections, developer portals, and published specs." },
          { t: "Discover specification files", d: "openapi.json, swagger.json, and schema endpoints often readable without auth." },
          { t: "Enumerate versions", d: "v1, v2, internal, and beta bases. Older versions may lack current fixes." },
          { t: "Map base paths and gateways", d: "Identify gateway hosts, microservice routes, and direct backend bypasses." },
          { t: "Capture all endpoints and methods", d: "Build a full inventory of routes, verbs, parameters, and expected roles." },
          { t: "Identify authentication scheme", d: "Bearer tokens, API keys, basic auth, mutual TLS, session cookies, or signed requests." }
        ]
      },
      {
        name: "Phase 2. Broken Object Level Authorisation",
        items: [
          { t: "Swap object identifiers", d: "Change ids in path, query, and body to access another tenant or user object." },
          { t: "Test predictable identifiers", d: "Sequential or guessable ids make enumeration of all records trivial." },
          { t: "Probe nested object references", d: "Child resources and embedded ids may skip the parent authorisation check." },
          { t: "Mass enumeration", d: "Iterate identifiers to confirm scale of exposure across the dataset." },
          { t: "Cross tenant isolation", d: "Confirm one tenant cannot read or modify another tenant data in multi tenant APIs." }
        ]
      },
      {
        name: "Phase 3. Broken Authentication",
        items: [
          { t: "Token validation", d: "Expired, malformed, revoked, and forged tokens must be rejected on every request." },
          { t: "JWT weaknesses", d: "alg none, weak or public signing keys, kid and jku abuse, unchecked signature and claims." },
          { t: "Credential and token brute force", d: "Missing rate limits on login, token, and refresh endpoints." },
          { t: "Refresh token handling", d: "Rotation, revocation on logout, and reuse detection for stolen tokens." },
          { t: "API key exposure and scope", d: "Keys in URLs, client code, or repos, and keys with broader scope than needed." },
          { t: "OAuth flow integrity", d: "redirect_uri validation, state parameter, scope escalation, and token leakage." }
        ]
      },
      {
        name: "Phase 4. Broken Object Property Level Authorisation",
        items: [
          { t: "Excessive data exposure", d: "Responses returning more fields than the client needs, including internal and PII fields." },
          { t: "Mass assignment", d: "Sending extra properties such as role, balance, or verified that the server binds blindly." },
          { t: "Read versus write field controls", d: "Fields readable but meant to be immutable that the API accepts on update." },
          { t: "Filter and field selection abuse", d: "Field selection parameters that return unauthorised attributes." }
        ]
      },
      {
        name: "Phase 5. Resource and Rate Controls",
        items: [
          { t: "Rate limiting presence", d: "Per user and per IP limits on sensitive and expensive endpoints." },
          { t: "Pagination and bulk limits", d: "Unbounded page size or list size that allows full table extraction." },
          { t: "Expensive query protection", d: "Limits on operations that consume heavy CPU, memory, or downstream calls." },
          { t: "Rate limit bypass", d: "Header spoofing, casing tricks, and alternate paths to evade counters." },
          { t: "Account and resource exhaustion", d: "Endpoints that create unlimited objects, emails, or jobs." }
        ]
      },
      {
        name: "Phase 6. Broken Function Level Authorisation",
        items: [
          { t: "Access admin functions as a low user", d: "Call administrative endpoints directly with a standard token." },
          { t: "Method based bypass", d: "An action blocked on one verb but allowed on another for the same route." },
          { t: "Guessable privileged routes", d: "Predictable admin and internal paths discoverable by naming convention." },
          { t: "Role enforcement per endpoint", d: "Each function checks the caller role server side, not just in the UI." }
        ]
      },
      {
        name: "Phase 7. Server Side Request Forgery via API",
        items: [
          { t: "URL accepting parameters", d: "Fields that fetch a remote resource, webhook, or callback by URL." },
          { t: "Internal and metadata access", d: "Reaching internal services and cloud metadata through the fetcher." },
          { t: "Scheme and filter bypass", d: "Alternate encodings, redirects, and rebinding to defeat allow lists." },
          { t: "Blind out of band confirmation", d: "Use a callback listener to confirm forged requests with no visible response." }
        ]
      },
      {
        name: "Phase 8. Injection and Input Handling",
        items: [
          { t: "SQL and NoSQL injection", d: "Test every parameter, header, and JSON field in queries and filters." },
          { t: "Command and code injection", d: "Input reaching shell, eval, or template engines on the server." },
          { t: "Content type confusion", d: "Switching JSON, XML, and form encodings to reach a weaker parser." },
          { t: "XML external entity", d: "XML bodies parsed with external entity resolution enabled." },
          { t: "Header and parameter pollution", d: "Duplicate parameters and crafted headers altering server side logic." }
        ]
      },
      {
        name: "Phase 9. Improper Inventory Management",
        items: [
          { t: "Shadow and undocumented endpoints", d: "Routes not in the spec but still live and often unprotected." },
          { t: "Deprecated and zombie versions", d: "Old API versions kept running without current security fixes." },
          { t: "Non production hosts", d: "Staging and debug APIs reachable from the internet with weak controls." },
          { t: "Exposed internal endpoints", d: "Health, metrics, debug, and admin routes that leak data or allow actions." }
        ]
      },
      {
        name: "Phase 10. Unsafe Consumption of Third Parties",
        items: [
          { t: "Trust of upstream responses", d: "Data from integrated services used without validation, enabling injection downstream." },
          { t: "Redirect following", d: "Blindly following redirects from third party services into internal targets." },
          { t: "Webhook authenticity", d: "Inbound webhooks verified by signature, not accepted from any caller." }
        ]
      },
      {
        name: "Phase 11. GraphQL Specific",
        items: [
          { t: "Introspection exposure", d: "Schema introspection enabled in production reveals all types and operations." },
          { t: "Query depth and complexity", d: "Deeply nested or recursive queries that exhaust server resources." },
          { t: "Batching and aliasing abuse", d: "Batched operations and aliases to brute force or bypass rate limits." },
          { t: "Authorisation per resolver", d: "Each field resolver enforces access, not only the top level operation." },
          { t: "Mutation and injection testing", d: "Mutations that change state and arguments that reach injectable sinks." }
        ]
      }
    ]
  },

  oss: {
    label: "Open Source Code",
    blurb: "Source level review for open source projects covering supply chain, secrets, language specific sinks, and disclosure.",
    phases: [
      {
        name: "Phase 1. Repository Recon",
        items: [
          { t: "Map the project layout", d: "Entry points, services, build files, and where untrusted input enters the code." },
          { t: "Read the security policy", d: "SECURITY.md and disclosure process define how and where to report safely." },
          { t: "Review issues and pull requests", d: "Open security discussions, partial fixes, and reverted patches signal weak areas." },
          { t: "Identify the trust boundary", d: "Which inputs are attacker controlled across network, files, arguments, and environment." },
          { t: "Check release and tag history", d: "Recent security tagged releases hint at recurring vulnerable patterns." }
        ]
      },
      {
        name: "Phase 2. Secrets and History",
        items: [
          { t: "Scan committed secrets", d: "API keys, tokens, private keys, and passwords in the current tree." },
          { t: "Audit full git history", d: "Secrets removed from the latest commit often remain in earlier history." },
          { t: "Inspect CI and config files", d: "Pipeline files, env samples, and dotfiles that leak credentials or endpoints." },
          { t: "Check published artifacts", d: "Packages and images may ship secrets, test data, or internal files." }
        ]
      },
      {
        name: "Phase 3. Dependencies and Supply Chain",
        items: [
          { t: "Inventory dependencies", d: "Direct and transitive packages with exact pinned versions." },
          { t: "Known vulnerable versions", d: "Map dependencies to published advisories and confirm reachability of the flaw." },
          { t: "Lockfile and integrity", d: "Missing lockfiles or integrity hashes allow tampered or substituted packages." },
          { t: "Dependency confusion", d: "Internal package names claimable on public registries." },
          { t: "Typosquat and malicious packages", d: "Suspicious low reputation packages and recently changed maintainers." },
          { t: "Build and CI pipeline trust", d: "Untrusted workflow triggers, unpinned actions, and secret exposure in CI." }
        ]
      },
      {
        name: "Phase 4. Authentication and Cryptography",
        items: [
          { t: "Credential handling", d: "Hardcoded defaults, plaintext storage, and weak password hashing." },
          { t: "Cryptographic primitives", d: "Outdated algorithms, ECB mode, static keys and nonces, and homemade crypto." },
          { t: "Randomness quality", d: "Non cryptographic random used for tokens, keys, and identifiers." },
          { t: "Token and signature verification", d: "Signatures actually verified, with constant time comparison where needed." },
          { t: "TLS and certificate handling", d: "Disabled verification, accepted self signed certs, and downgrade paths." }
        ]
      },
      {
        name: "Phase 5. Injection and Input Sinks",
        items: [
          { t: "SQL and query construction", d: "String concatenation into queries instead of parameterised statements." },
          { t: "Command execution", d: "User input reaching shell or process execution without strict validation." },
          { t: "Path traversal", d: "File paths built from input that escape the intended directory." },
          { t: "Template and expression evaluation", d: "User data into template engines or dynamic evaluation." },
          { t: "Deserialisation of untrusted data", d: "Native deserialisers on attacker controlled input enabling code execution." },
          { t: "Cross site scripting in rendering", d: "Server rendered output without context aware encoding." }
        ]
      },
      {
        name: "Phase 6. Server Side Request Forgery and Network",
        items: [
          { t: "Outbound request builders", d: "Functions that fetch URLs from input without host validation." },
          { t: "Redirect following", d: "Following redirects into internal ranges and metadata services." },
          { t: "DNS and address validation", d: "Validation that resolves and rechecks the final address, not just the string." }
        ]
      },
      {
        name: "Phase 7. Memory and Native Safety",
        items: [
          { t: "Buffer handling in native code", d: "Bounds on copies, array indexing, and length calculations in C and C++." },
          { t: "Integer overflow and underflow", d: "Arithmetic on sizes and counts that wraps and breaks allocation logic." },
          { t: "Use after free and double free", d: "Lifetime and ownership errors in manual memory management." },
          { t: "Format string handling", d: "User input used directly as a format specifier." },
          { t: "Unsafe blocks in safe languages", d: "Explicit unsafe regions that bypass the language safety guarantees." }
        ]
      },
      {
        name: "Phase 8. Access Control and Logic",
        items: [
          { t: "Authorisation checks at sinks", d: "Permission verified at the action, not only at the route or menu." },
          { t: "Insecure direct object references", d: "Identifiers from input used to fetch resources without ownership checks." },
          { t: "Privileged default configuration", d: "Insecure defaults, debug modes, and open bindings shipped on by default." },
          { t: "Race conditions", d: "Shared state and time of check to time of use gaps in concurrent paths." }
        ]
      },
      {
        name: "Phase 9. Files, Resources, and Errors",
        items: [
          { t: "File permission and creation", d: "World readable or writable files and predictable temporary file names." },
          { t: "Archive and decompression handling", d: "Zip slip path escape and decompression bombs on untrusted archives." },
          { t: "Resource exhaustion", d: "Unbounded loops, allocations, and recursion driven by input." },
          { t: "Error and exception handling", d: "Leaked internals on error and failure modes that default to allow." },
          { t: "Logging of sensitive data", d: "Secrets, tokens, and PII written to logs and traces." }
        ]
      },
      {
        name: "Phase 10. Verification and Disclosure",
        items: [
          { t: "Build a working proof of concept", d: "Confirm the issue with a minimal trigger on a clean checkout." },
          { t: "Determine version range", d: "Identify which releases and branches are affected." },
          { t: "Propose a fix or patch", d: "A concrete change that closes the issue without breaking valid use." },
          { t: "Follow coordinated disclosure", d: "Report privately through the stated channel and respect the embargo." },
          { t: "Request a CVE where applicable", d: "For valid impactful issues, pursue an identifier through the right authority." }
        ]
      }
    ]
  }
};
