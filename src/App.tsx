import { QueryClient, QueryClientProvider } from 'react-query'
import './App.css'
import { Game } from './view/Game'

const queryClient = new QueryClient()


function App() {

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Game />
      </QueryClientProvider>
    </>
  )
}

export default App
