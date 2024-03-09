const Home = () => {
  return (
    <div className="">

<div className="w-full mx-auto px-4 h-screen flex items-center sm:px-6 lg:px-8 bg-blue-300">
  <div className="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
    <div>
        <section className=" p-8">
  <p className="text-black mt-4 mb-4 text-3xl underline">Questions That Motivate, Learning That Elevates</p>
  <p className="text-green-500 mb-4 text-2xl">Fueling Ambitions, One Question at a Time</p>

 
  <section className=" p-8 ">
  <h2 className="text-2xl font-semibold  text-blue-500">Upcoming Test</h2>
  <p className="text-black mb-4">
    Get ready for the upcoming scholarship test. Practice and improve
    your skills to maximize your chances of success.
  </p>
  {/* <h2 className="text-2xl font-semibold  text-green-500">Practice Tests</h2>
  <p className="text-black mb-4">
    Access a variety of practice tests to enhance your knowledge and
    boost your performance in test taking.
  </p>

   */}
   <a href="/test-dashboard" className=" py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gray-600 text-white
         hover:bg-blue-700   dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
          View Tests
          </a>
</section>

</section>

      <div className=" justify-center items-center  mt-2 grid gap-3 w-full sm:inline-flex">
        <a className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white
         hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" href="/login">
          Login
          <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m9 18 6-6-6-6"/></svg>
        </a>
        <a className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 
        disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" href="/signup">
          Sign up
        </a>
      </div>

      <div className="mt-6 lg:mt-10 grid grid-cols-2 gap-x-5">
       
   
      </div>
    </div>

    <div className="relative ms-4">
      <img className="w-full rounded-md" src="https://images.unsplash.com/photo-1665686377065-08ba896d16fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&h=800&q=80" 
      alt="Image Description" />
    

     
    </div>
  </div>
</div>

    <footer className="text-center text-white mt-8">
        <p>&copy; 2024 Think Twice Test App. All rights reserved.</p>
      </footer>
</div>

  );
};

export default Home;

