export const EditorCard = () => {
  return (
    <div className="max-w-sm p-6  border  rounded-lg shadow bg-gray-800 border-gray-700 text-center  h-56">
      <a href="#">
        <h5 className="mb-2 text-2xl font-bold tracking-tight  text-white ">
          Add Editor
        </h5>
      </a>
      <p className="mb-3 font-normal  text-gray-400">
        Select editor of your choice for your youtube channel.
      </p>
      <div className="text-center mt-5 mb-5">
        <a
          href="/addeditor"
          className="inline-flex items-center px-3 py-2 text-sm font-medium  text-white  rounded-lg  focus:ring-4 focus:outline-none  bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
        >
          Add Editor
        </a>
      </div>
    </div>
  );
};
