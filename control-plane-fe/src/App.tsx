import { useState } from "react"
import { TInstance } from "./types/TInstance"
import Instance from "./components/Instance"


const App = () => {

  const [instances, setInstances] = useState<TInstance[]>([{
    id: "1",
    name: "test",
    status: "running",
    address: "https://test.com"
  }])

  const onInstanceCreate = () => {
    const newInstance: TInstance = {
      id: "2",
      name: "test2",
      status: "running",
      address: "https://test2.com"
    }
    setInstances([...instances, newInstance])
  }

  return (
    <>
      <header className="flex justify-center bg-gray-100 py-4 rounded-md mx-8 mt-8 mb-16">
        <h1 className="text-2xl font-bold">Notebook Control Plane</h1>
      </header>
      <div className="flex flex-col items-center">
        <div className="flex flex-col w-2/3">
          <div className="flex w-full justify-end">
            <button
              type="button"
              className="inline-flex mb-8 h-8 items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => onInstanceCreate()}
              >
              Create Instance
            </button>
          </div>
          {
            instances.map((instance) => (
              <Instance key={instance.id} instance={instance} />
            ))
          }
        </div>
      </div>
    </>
  )
}

export default App
