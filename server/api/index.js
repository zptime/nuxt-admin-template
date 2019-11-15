import axios from 'axios'

export function login (data) {
  return axios.post('/api/login', data)
}

export function logout () {
  return axios.post('/api/logout')
}
