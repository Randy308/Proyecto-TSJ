
export const SkeletonChart = () => {
  return (
    <div
      role="status"
      className="w-full p-4 m-4 rounded-sm shadow-sm animate-pulse md:p-6"
    >
      <div className="flex items-baseline justify-center mt-4">
        <div className="w-full bg-gray-100 rounded-t-lg h-12 dark:bg-gray-700"></div>
        <div className="w-full h-56 ms-6 bg-gray-200 rounded-t-lg dark:bg-gray-700"></div>
        <div className="w-full bg-gray-100 rounded-t-lg h-52 ms-6 dark:bg-gray-700"></div>
        <div className="w-full bg-gray-200 rounded-t-lg h-60 ms-6 dark:bg-gray-700"></div>
        <div className="w-full bg-gray-200 rounded-t-lg h-72 ms-6 dark:bg-gray-700"></div>
        <div className="w-full bg-gray-200 rounded-t-lg h-40 ms-6 dark:bg-gray-700"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};
