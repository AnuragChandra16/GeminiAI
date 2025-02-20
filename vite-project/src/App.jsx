
import { useState } from 'react'
import React from 'react'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import './App.css'


//!Function that must return a promise (useMutation)
const makeRequestAPI = async (prompt) => {
  const res = await axios.post("https://geminiai-real.onrender.com/generate", { prompt });
  return res.data;
};

function App() {
  const [prompt, setPrompt] = useState("");
  //!mutation
  const mutation = useMutation({
    mutationFn: makeRequestAPI,
    mutationKey: ["gemini-ai-request"],
  });
  //!submit handler
  const submitHandler = (e) => {
    e.preventDefault();
    mutation.mutate(prompt);
  };
  console.log(mutation);
  return (
    <div className="App">
      <header>Gemini AI Content Generator</header>
      <p>Enter a prompt and let Gemini AI craft a unique content for you.</p>
      <form className="App-form" onSubmit={submitHandler}>
        <label htmlFor="Enter your prompt:"></label>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Write a content about..."
          className="App-input"
        />
        <button className="App-button" type="submit">
          Generate Content
        </button>
        <section className="App-response">
        {mutation.isPending && <p className='gen'>Generating your content...</p>}
{mutation.isError && <p className='red'>Oops! {mutation.error.message}</p>}
{mutation.isSuccess && (
  <div>
    <p className='thanks'>Thanks for your patience, below is your content</p>
    <p className='ans'>{mutation.data}</p>
  </div>
)}

          
        </section>
      </form>
      </div>
  )
}
export default App;


// import { useState, useEffect } from 'react';
// import React from 'react';
// import axios from 'axios';
// import { useMutation } from '@tanstack/react-query';
// import './App.css';

// // API request function
// const makeRequestAPI = async (prompt) => {
//   try {
//     const res = await axios.post("https://geminiai-real.onrender.com/generate", { prompt });

//     console.log("API Response:", res.data); // Log full response

//     // Ensure we handle different response formats
//     if (!res.data || typeof res.data !== "object") {
//       throw new Error("Unexpected API response format");
//     }

//     return res.data.result || res.data; // Fallback to res.data if 'result' is missing
//   } catch (error) {
//     console.error("API Request Error:", error.response?.data || error.message);
//     throw error; // Ensure error propagates to React Query
//   }
// };

// function App() {
//   const [prompt, setPrompt] = useState("");

//   // Mutation setup
//   const mutation = useMutation({
//     mutationFn: makeRequestAPI,
//     mutationKey: ["gemini-ai-request"],
//   });

//   // Log mutation data when it updates
//   useEffect(() => {
//     if (mutation.isSuccess) {
//       console.log("Mutation Data:", mutation.data);
//     }
//   }, [mutation.data]);

//   // Submit handler
//   const submitHandler = (e) => {
//     e.preventDefault();
//     if (!prompt.trim() || mutation.isPending) return;

//     mutation.mutate(prompt, {
//       onSuccess: (data) => {
//         console.log("Mutation Success Data:", data);
//       },
//       onError: (error) => {
//         console.error("Mutation Error:", error.response?.data || error.message);
//       }
//     });
//   };

//   return (
//     <div className="App">
//       <header>Gemini AI Content Generator</header>
//       <p>Enter a prompt and let Gemini AI craft a unique content for you.</p>
      
//       <form className="App-form" onSubmit={submitHandler}>
//         <label htmlFor="prompt">Enter your prompt:</label>
//         <input
//           type="text"
//           id="prompt"
//           value={prompt}
//           onChange={(e) => setPrompt(e.target.value)}
//           placeholder="Write content about..."
//           className="App-input"
//         />
        
//         <button 
//           className="App-button" 
//           type="submit"
//           disabled={mutation.isPending}
//         >
//           {mutation.isPending ? "Generating..." : "Generate Content"}
//         </button>

//         <section className="App-response">
//           {mutation.isPending && <p className='gen'>Generating your content...</p>}

//           {mutation.isError && (
//             <p className='red'>
//               Oops! {mutation.error.response?.data || mutation.error.message}
//             </p>
//           )}

//           {mutation.isSuccess && (
//             <div>
//               <p className='thanks'>Thanks for your patience, below is your content:</p>
//               <p className='ans'>{mutation.data}</p>
//             </div>
//           )}
//         </section>

//         {/* Debugging: Show raw mutation data */}
//         <pre>Debug: {JSON.stringify(mutation.data, null, 2)}</pre>
//       </form>
//     </div>
//   );
// }

// export default App;
