import Button from './components/Button/button'

function App() {

  return (
    <>
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
