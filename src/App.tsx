import Button from './components/Button/button'

function App() {

  return (
    <>
      <Button>默认按钮</Button>
      <Button btnType="primary" disabled>主按钮</Button>
      <Button btnType="danger">危险按钮</Button>
      <Button btnType="link" href="https://www.baidu.com" disabled>链接按钮</Button>
    </>
  )
}

export default App
