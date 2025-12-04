import axios from 'axios'
import { useState, useEffect } from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas)

function App() {
  const [title, setTitle] = useState('')
  const postData = {
    title: 'title',
    body: 'body'
  }
  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/posts/1', {
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
      responseType: 'json'
    }).then(res => {
      console.log(res.data)
      setTitle(res.data.title)
    })
  }, [])

  useEffect(() => {
    axios.post('https://jsonplaceholder.typicode.com/posts', postData)
      .then(res => {
        console.log(res.data)
        setTitle(res.data.title)
      })
  }, [])

  return (
    <div className='App' style={{ marginTop: '100px', marginLeft: '100px' }}>
      {/* 格式设置为multipart/form-data */}
      <form method="post" encType="multipart/form-data" action="https://jsonplaceholder.typicode.com/posts">
        <input type='file' name='file'></input>
        <button type="submit">提交</button>
      </form>
    </div>
  )
}

export default App
