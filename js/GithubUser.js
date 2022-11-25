// api do GitHub para pegar os dados
export class GithubUser {
  // metódo estático
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`

    //recebe endpoint para fazer uma promessa
    return (
      fetch(endpoint)
        .then(data => data.json())
        // desestruturando para chamar direto, usando shorthand
        .then(({ login, name, public_repos, followers }) => ({
          login,
          name,
          public_repos,
          followers
        }))
    )
  }
}
