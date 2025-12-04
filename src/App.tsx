import axios from 'axios'
import { useState, useEffect } from 'react'
import Button from './components/Button/button'
import Menu from './components/Menu/menu'
import MenuItem from './components/Menu/menuItem'
import SubMenu from './components/Menu/subMenu'
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
    <>
      <h1>{title}</h1>
      <Menu mode="horizontal" defaultIndex="0" onSelect={(index) => console.log(index)} defaultOpenSubMenus={['3']}>
        <MenuItem>首页</MenuItem>
        <MenuItem disabled>关于</MenuItem>
        <MenuItem >联系</MenuItem>
        <SubMenu title="下拉菜单">
          <MenuItem>子项1</MenuItem>
          <MenuItem>子项2</MenuItem>
        </SubMenu>
      </Menu>
      <Button>默认按钮</Button>
      <Button btnType="primary" disabled>主按钮</Button>
      <Button btnType="danger">危险按钮</Button>
      <Button btnType="link" href="https://www.baidu.com">链接按钮</Button>
      <Button size="sm" onClick={() => console.log('点击了小按钮')}>小按钮</Button>
      <Button size="lg">大按钮</Button>
      <Button btnType="primary" size="lg">大主按钮</Button>
      <Button btnType="danger" size="lg">大危险按钮</Button>
      <Button btnType="link" size="lg">大链接按钮</Button>
    </>
  )
}

export default App
