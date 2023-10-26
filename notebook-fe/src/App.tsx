import { useState } from "react";
import Block from "./components/Block";
import { EvalBlock } from "./types/EvalBlock";

const App = () => {
  const [evalBlocks, setEvalBlocks] = useState<EvalBlock[]>([{
    index: 0,
    identifier: "A1",
    input: "",
    output: "",
  }]);

  // Replace identifiers with corresponding output
  const replaceIdentifiers = (input: string): string => {
    return input.replace(/A\d+/g, (match) => {
      const evalBlock = evalBlocks.find(block => block.identifier === match);
      return evalBlock ? input.replace(match, `'${evalBlock.output}'`) : match;
    });
  };

  // Convert URLs to clickable links
  const convertToLinks = (input: string): string => {
    const urlRegex = /((http|https|ftp):\/\/[\w?=&./-;#~%-]+(?![\w\s?&./;#~%"=-]*>))/g;
    return input.replace(urlRegex, `<a href='$1' target='_blank' rel='noopener noreferrer'>$1</a>`);
  };

  const handleEvalBlockChange = (newEvalBlock: EvalBlock) => {
    const newEvalBlocks = evalBlocks.map(block => block.index === newEvalBlock.index ? newEvalBlock : block);
    setEvalBlocks(newEvalBlocks);
  };

  const handleNewBlock = () => {
    const newEvalBlock: EvalBlock = {
      index: evalBlocks.length,
      identifier: `A${evalBlocks.length + 1}`,
      input: "",
      output: "",
    };
    setEvalBlocks([...evalBlocks, newEvalBlock]);
  };

  const handleBlockRun = (evalBlock: EvalBlock) => {
    let input = replaceIdentifiers(evalBlock.input);
    input = convertToLinks(input);

    let output: string | HTMLElement = "";

    try {
      output = eval(input);
    } catch (error: unknown) {
      output = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    }

    handleEvalBlockChange({ ...evalBlock, output });
  };

  return (
    <div className="flex justify-center pt-12">
      <div className="flex flex-col px-8 w-full md:w-1/2 space-y-4">
        {evalBlocks.map((evalBlock) => (
          <Block
            key={evalBlock.index}
            evalBlock={evalBlock}
            onEvalBlockChange={handleEvalBlockChange}
            onEvalBlockRun={() => handleBlockRun(evalBlock)}
          />
        ))}
        <button
          type="button"
          className="inline-flex w-max h-8 items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={handleNewBlock}>
          Add new block
        </button>
      </div>
    </div>
  );
};

export default App;