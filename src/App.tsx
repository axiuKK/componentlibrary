import Button from './components/Button/button'
import Menu from './components/Menu/menu'
import MenuItem from './components/Menu/menuItem'

function App() {

  return (
    <>
      <Menu mode="vertical" defaultIndex={0} onSelect={(index) => console.log(index)}>
        <MenuItem index={0}>首页</MenuItem>
        <MenuItem index={1} disabled>关于</MenuItem>
        <MenuItem index={2}>联系</MenuItem>
        <li>123</li>
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
