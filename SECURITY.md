# Security policy

## Reporting a vulnerability

Report privately through GitHub's [security advisory
form](https://github.com/7se7en72025/gear5-ui/security/advisories/new)
rather than a public issue. You should get an initial response within a week.

Please include the component, a proof of concept, and what an attacker gains.

## Scope

Anywhere UI ships source that consumers copy into their own projects, so the
relevant vulnerabilities are the ones that make a consuming application less
safe:

- A component rendering caller-supplied data in a way that permits script
  execution — this is what `sanitizeHref` exists to prevent, and a bypass of it
  is in scope.
- A component writing sensitive input somewhere it should not, such as
  `draft-storage` persisting a credential it is supposed to exclude.
- A component making a network request. It should never happen: the privacy
  scan in `tests/static-scan.test.ts` forbids it registry-wide, and a way
  around that check is in scope.

The documentation site itself is in scope for anything that would affect a
visitor.

## Out of scope

Vulnerabilities in `react` or in a consumer's own build tooling — report those
upstream. Findings that require an already-compromised consuming application
are also out of scope, since a copy-paste component cannot defend against its
host being hostile.

## Supported versions

Components are copied, not versioned — there is no release stream to backport
to. Fixes land on `main`, and the advisory names the components to re-copy.
