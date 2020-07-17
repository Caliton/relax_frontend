const setUser = ({ commit }, newUser) => {
  commit('SET_USER', newUser)
}

const setAccessToken = ({ commit }, newToken) => {
  commit('SET_ACCESS_TOKEN', newToken)
}

const setLogged = ({ commit }, isLogged) => {
  commit('SET_LOGGED', isLogged)
}

export {
  setUser,
  setAccessToken,
  setLogged
}
