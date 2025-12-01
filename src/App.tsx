import Button from './components/Button/button'
import Menu from './components/Menu/menu'
import MenuItem from './components/Menu/menuItem'
import SubMenu from './components/Menu/subMenu'

function App() {

  return (
    <>
      <Menu mode="horizontal" defaultIndex={0} onSelect={(index) => console.log(index)}>
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
