import { useEffect, useRef } from "react";
import { EvalBlock } from "../types/EvalBlock";

interface BlockProps {
    evalBlock: EvalBlock;
    onEvalBlockChange: (evalBlock: EvalBlock) => void;
    onEvalBlockRun: () => void;
}

const Block = ( { evalBlock, onEvalBlockChange, onEvalBlockRun } : BlockProps) => {

    const containerRef = useRef<HTMLDivElement | null>(null);
    
    useEffect(() => {
        containerRef.current!.innerHTML = "";
        if (typeof evalBlock.output === 'string') {
            // Output is an HTML string
            containerRef.current!.innerHTML = evalBlock.output;
        } else if (evalBlock.output instanceof HTMLElement) {
            // Output is a DOM element
            containerRef.current!.appendChild(evalBlock.output);
        }
    }, [evalBlock.output])

    const handleInputChange = (newInput: string) => {
        onEvalBlockChange({
            ...evalBlock,
            input: newInput
        })
    }

    return (
        <div className="flex flex-col gap-y-2 w-full">
            <div>
                {evalBlock.identifier}
            </div>
            <div className="flex space-x-2">
                <div className="flex flex-col space-y-2 w-full">
                    <textarea
                        rows={4}
                        name="comment"
                        id="comment"
                        className="block w-full rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        defaultValue={evalBlock.input}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange(e.target.value)}
                    />
                
                    <div ref={containerRef} className="bg-gray-100 p-1.5 text-sm" />
                    
                </div>
                <button
                    type="button"
                    className="inline-flex h-8 items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => onEvalBlockRun()}
                    >
                    Run
                </button>
            </div>
        </div>
    );
}

export default Block;