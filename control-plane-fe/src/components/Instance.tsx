import { TInstance } from "../types/TInstance"

interface InstanceProps {
    instance: TInstance
}

const Instance = ({ instance }: InstanceProps) => {

    const onStop = () => {}

    const onDelete = () => {}


    return (
        <div className="flex items-center w-full justify-between">
            <div className="px-4">Notebook: {instance.name}</div> |
            <div className="px-4">State: {instance.status}</div> |
            <div className="px-4">Url: {instance.address}</div> 

            <button
                type="button"
                className="mx-4 inline-flex h-8 items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => onStop()}
                >
                Stop
            </button>

            <button
                type="button"
                className="inline-flex h-8 items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => onDelete()}
                >
                Delete
            </button>
        </div>
    )
}

export default Instance