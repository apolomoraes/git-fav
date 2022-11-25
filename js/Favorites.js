import { GithubUser } from './GithubUser.js'

// como os dados serão estruturados
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root) // raiz do projeto
    this.load()
    this.onAddLine()
    this.noLine()
  }

  // load guarda os dados no banco de dados do navegador
  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  // salva os dados no localstorage, porque só jogar no local não resolve
  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    this.onAddLine()
    this.noLine()
  }

  // confere se tem alguma linha na table, se não tiver apareça a tela de nenhum favorito
  onAddLine() {
    if (localStorage.getItem('@github-favorites:') == '[]') {
      this.root.querySelector('.no-favorite').classList.remove('hide')
    }
  }

  // confere se tem alguma linha na table, se sim então some com a tela de nenhum favorito
  noLine() {
    if (localStorage.getItem('@github-favorites:') !== '[]') {
      this.root.querySelector('.no-favorite').classList.add('hide')
    }
  }

  async add(input) {
    const username = input.value
    input.value = ''

    //try = tente
    try {
      const userExists = this.entries.find(
        entry => entry.login.toUpperCase() === username.toUpperCase()
      )

      if (userExists) {
        throw new Error('Usúario já cadastrado')
      }

      //pega o usuário do github
      const user = await GithubUser.search(username)

      if (user.login === undefined) {
        throw new Error('Usuário não encontrado')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()
    } catch (error) {
      alert(error.message)
    }
  }

  // deleta o usuário usando o filter verificando se é diferente
  delete(user) {
    const filteredEntries = this.entries.filter(entry => {
      return entry.login !== user.login
    })
    // define entries é igual a filteresEntries para remover o usuário
    this.entries = filteredEntries
    this.update()
    this.save()
    this.onAddLine()
    this.noLine()
  }
}

// classe que vai criar a visualização e eventos do HTML
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onadd()
  }

  onadd() {
    const addButton = this.root.querySelector('.search button')

    const input = document.querySelector('#input-search')
    input.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        this.add(input)
      }
    })

    addButton.onclick = () => {
      let input = this.root.querySelector('.search input')
      this.add(input)
    }
  }

  // toda vez que um dado atualizar na página, essa função update é rodada
  update() {
    this.removeAllTr()

    // entries guarda os dados no localStorage
    this.entries.forEach(user => {
      //roda os dados e cria uma nova row
      const row = this.createRow()

      row.querySelector(
        '.user img'
      ).src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        this.delete(user)
        //faz o click do botão remover para remover o dado que o cliente quê
      }

      this.tbody.append(row)
    })
  }

  createRow() {
    // cria a tr, para criar a tr deve usar o createElement
    const tr = document.createElement('tr')

    tr.innerHTML = `
    <td class="user">
      <div>
        <img src="https://github.com/apolomoraes.png" alt="Imagem de">
        <a target = '_blank' href="https://github.com/apolomoraes">
          <p>Apolo Moraes</p>
          <span>apolomoraes</span>
        </a>
      </div>
    </td>
    <td class="repositories">50</td>
    <td class="followers">200</td>
    <td class="remove">Remover</td>
    `

    return tr
  }

  //remove a tr usando o root
  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach(tr => {
      tr.remove()
    })
  }
}
