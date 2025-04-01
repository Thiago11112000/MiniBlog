import { useState, useEffect, useReducer } from 'react'
import { db } from '../firebase/config'
import { collection, addDoc, Timestamp } from 'firebase/firestore'

const initialState = {
  loading: false,
  error: null,
  success: false
}

const insertReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null, success: false }
    case "INSERTED_DOC":
      return { loading: false, error: null, success: true }
    case "ERROR":
      return { loading: false, error: action.payload, success: false }
    default:
      return state
  }
}

export const useInsertDocument = (docCollection) => {
  const [response, dispatch] = useReducer(insertReducer, initialState)
  const [cancelled, setCancelled] = useState(false) // Adicionando estado para cancelled

  const checkCancelBeforeDispatch = (action) => {
    if (!cancelled) {
      dispatch(action)
    }
  }

  const insertDocument = async (document) => {
    checkCancelBeforeDispatch({ type: "LOADING" })

    try {
      const newDocument = { ...document, createdAt: Timestamp.now() }
      
      const insertedDocument = await addDoc(
        collection(db, docCollection),
        newDocument
      )

      checkCancelBeforeDispatch({
        type: "INSERTED_DOC",
        payload: insertedDocument
      })
    } catch (error) {
      checkCancelBeforeDispatch({
        type: "ERROR",
        payload: error.message
      })
    }
  }

  useEffect(() => {
    return () => setCancelled(true)
  }, [])

  return { insertDocument, response }
}