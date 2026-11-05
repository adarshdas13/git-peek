const BASE = 'https://api.github.com'

export async function fetchUser(username) {
  const res = await fetch(`${BASE}/users/${username}`)
  if (!res.ok) {
    if (res.status === 404) throw new Error('User not found')
    if (res.status === 403) throw new Error('API rate limit exceeded — try again later')
    throw new Error('Failed to fetch user')
  }
  return res.json()
}

export async function fetchRepos(username, page = 1, perPage = 30, sort = 'updated') {
  const res = await fetch(
    `${BASE}/users/${username}/repos?per_page=${perPage}&page=${page}&sort=${sort}`
  )
  if (!res.ok) throw new Error('Failed to fetch repositories')
  return res.json()
}

export async function fetchLanguages(owner, repo) {
  const res = await fetch(`${BASE}/repos/${owner}/${repo}/languages`)
  if (!res.ok) return {}
  return res.json()
}

export async function fetchReadme(owner, repo) {
  const res = await fetch(`${BASE}/repos/${owner}/${repo}/readme`, {
    headers: { Accept: 'application/vnd.github.v3.raw' },
  })
  if (!res.ok) return null
  return res.text()
}

export async function fetchRepoDetails(owner, repo) {
  const res = await fetch(`${BASE}/repos/${owner}/${repo}`)
  if (!res.ok) throw new Error('Failed to fetch repo details')
  return res.json()
}

export async function fetchEvents(username) {
  const res = await fetch(`${BASE}/users/${username}/events/public?per_page=10`)
  if (!res.ok) return []
  return res.json()
}

