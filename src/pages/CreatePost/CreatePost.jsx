import styles from './CreatePost.module.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthValue } from "../../context/AuthContext"
import { useInsertDocument } from '../../hooks/useInsertDocument'

const CreatePost = () => {
  const [title, setTitle] = useState("") 
  const [image, setImage] = useState("")
  const [body, setBody] = useState("")
  const [tags, setTags] = useState([])
  const [formError, setFormError] = useState("")
  const [loading, setLoading] = useState(false) 

  const { insertDocument, response } = useInsertDocument("posts") 
  const { user } = useAuthValue()
  const navigate = useNavigate() 

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormError("")
    setLoading(true) 

    // validate image URL
    try {
      new URL(image)
    } catch (error) {
      setFormError("A imagem precisa ser uma URL válida.")
      setLoading(false)
      return
    }

    // criar o array de tags
    const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase())

    // checar todos os valores
    if (!title || !image || !tags || !body) {
      setFormError("Por favor, preencha todos os campos!")
      setLoading(false)
      return
    }

    insertDocument({
      title,
      image,
      body,
      tags: tagsArray,
      uid: user.uid, // Corrigido de user.id para user.uid
      createdBy: user.displayName
    })

    // redirect to home page
    navigate("/")
  }

  return (
    <div className={styles.create_post}>
      <h2>Criar post</h2>
      <p>Escreva sobre o que quiser e compartilhe o seu conhecimento</p>
      <form onSubmit={handleSubmit}> 
        <label>
          <span>Título:</span>
          <input 
            type="text" 
            name="title"
            required
            placeholder="Pense em um bom título..." 
            onChange={(e) => setTitle(e.target.value)} 
            value={title}
          />
        </label>
        <label>
          <span>URL da imagem:</span>
          <input 
            type="text" 
            name="image"
            required
            placeholder="Insira uma imagem que representa o seu post..." 
            onChange={(e) => setImage(e.target.value)} 
            value={image} // Corrigido: estava usando title em vez de image
          />
        </label>
        <label>
          <span>Conteúdo:</span>
          <textarea 
            name="body"
            required
            placeholder="Insira o conteúdo do post"
            onChange={(e) => setBody(e.target.value)}
            value={body}
          ></textarea>
        </label>
        <label>
          <span>Tags:</span>
          <input 
            type="text"
            name="tags"
            required
            placeholder="Insira as tags separadas por vírgula"
            onChange={(e) => setTags(e.target.value)}
            value={tags}
          />
        </label>
        {!response.loading && !loading && <button className="btn">Cadastrar</button>}
        {response.loading && ( // Corrigido: removido { extra
          <button className="btn" disabled>
            Aguarde...
          </button>
        )}
        {response.error && <p className="error">{response.error}</p>} {/* Corrigido className e referência ao erro */}
        {formError && <p className="error">{formError}</p>} {/* Adicionado para mostrar erros de formulário */}
      </form>
    </div>
  )
}

export default CreatePost