import { useState, useCallback } from 'react'
import { fetchUser, fetchRepos } from '../api/github.js'

export function useGitHub() {
  const [user, setUser] = useState(null)
  const [repos, setRepos] = useState([])
  const [fetchedAt, setFetchedAt] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const searchUser = useCallback(async (username) => {
    setLoading(true)
    setError(null)
    setUser(null)
    setRepos([])
    setFetchedAt(null)

    try {
      const [userData, reposData] = await Promise.all([
        fetchUser(username),
        fetchRepos(username, 1, 100),
      ])
      const timestamp = Date.now()
      setUser(userData)
      setRepos(reposData)
      setFetchedAt(timestamp)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearSearch = useCallback(() => {
    setUser(null)
    setRepos([])
    setFetchedAt(null)
    setError(null)
  }, [])

  return { user, repos, fetchedAt, loading, error, searchUser, clearSearch }
}
